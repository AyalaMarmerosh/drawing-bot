using DrawingBot.Models;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

namespace DrawingBot.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private static readonly string _systemPromptTemplate = File.ReadAllText("gemini-prompt.txt");

        public GeminiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = Environment.GetEnvironmentVariable("GeminiApiKey");

            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new InvalidOperationException("Gemini API key is missing. Please set the 'GeminiApiKey' environment variable.");
            }
        }

        public async Task<List<DrawingCommand>> GetDrawingCommands(string prompt)
        {
            string systemPrompt = _systemPromptTemplate.Replace("{prompt}", prompt);  // Replace {prompt} placeholder in the system prompt template with the actual user input.

            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        parts = new[]
                        {
                            new { text = systemPrompt }
                        }
                    }
                }
            };

            var requestJson = JsonSerializer.Serialize(requestBody);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key={_apiKey}"),
                Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(jsonResponse);
            var contentText = document  // Parse the response JSON and extract the generated content text from the LLM.
                .RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            try
            {
                // Use regular expression to extract the JSON array of drawing commands from the LLM response.
                var jsonMatch = System.Text.RegularExpressions.Regex.Match(contentText, @"\[\s*{.*?}\s*\]", System.Text.RegularExpressions.RegexOptions.Singleline);

                if (!jsonMatch.Success)
                    return new List<DrawingCommand>();

                var jsonArrayText = jsonMatch.Value;

                var result = JsonSerializer.Deserialize<List<DrawingCommand>>(jsonArrayText, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (result == null || result.Any(cmd => !IsValidCommand(cmd)))
                    return new List<DrawingCommand>();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing response: {ex.Message}");
                return new List<DrawingCommand>();
            }

        }

        private bool IsValidCommand(DrawingCommand command)
        {
            if (string.IsNullOrWhiteSpace(command.Type))
                return false;

            var validTypes = new[] { "rectangle", "circle", "line", "fill", "clear" };

            if (!validTypes.Contains(command.Type.ToLower()))
                return false;

            // בדיקות כלליות למספרים (יכולות להשתנות לפי הלוגיקה שלך)
            if (command.X < 0 || command.Y < 0)
                return false;

            if (command.Type == "rectangle" || command.Type == "line")
            {
                if (command.Width <= 0 || command.Height <= 0)
                    return false;
            }

            if (command.Type == "circle" && command.Radius <= 0)
                return false;

            if (string.IsNullOrWhiteSpace(command.Color))
                return false;

            return true;
        }

    }
}