using Microsoft.AspNetCore.Mvc;
using DrawingBot.Models;
using DrawingBot.Services;
using Microsoft.EntityFrameworkCore;
using DrawingBot.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace DrawingBot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrawController : ControllerBase
    {
        private readonly GeminiService _gemini;
        private readonly UserService _userService;
        private readonly DrawingService _drawingService;
        private readonly JwtService _jwtService;

        public DrawController(GeminiService gemini, UserService userService, DrawingService drawingService, JwtService jwtService)
        {
            _gemini = gemini;
            _userService = userService;
            _drawingService = drawingService;
            _jwtService = jwtService;
        }

        [Authorize]
        [HttpPost("decode")]
        public async Task<IActionResult> DecodePrompt([FromBody] string prompt)
        {
            var commands = await _gemini.GetDrawingCommands(prompt);
            return Ok(commands);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.LoginAsync(request.Username, request.Password);

            if (user == null)
                return Unauthorized("שם משתמש או סיסמה שגויים.");

            var token = _jwtService.GenerateToken(user);
            return Ok(new
            {
                token,
                user = new { user.Id, user.UserName }
            });
        }

        [Authorize]
        [HttpPost("drawing")]
        public async Task<IActionResult> CreateDrawing([FromBody] DrawingDto dto)
        {
            Console.WriteLine("dto.Name: " + dto.Name);
            Console.WriteLine("dto.JsonData: " + dto.JsonData);


            var userIdString = User.FindFirst("userId")?.Value;

            Console.WriteLine("userId from token: " + userIdString);

            if (userIdString == null)
                return Unauthorized();

            if (!int.TryParse(userIdString, out var userId))
                return BadRequest("Invalid user ID format in token.");

            var drawing = await _drawingService.AddDrawingAsync(userId, dto);
            return CreatedAtAction(nameof(GetDrawing), new { id = drawing.Id }, drawing);

        }

        [Authorize]
        [HttpGet("user-drawings")]
        public async Task<IActionResult> GetUserDrawings()
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (userIdString == null)
                return Unauthorized();

            if (!int.TryParse(userIdString, out var userId))
                return BadRequest("Invalid user ID format in token.");

            var drawings = await _drawingService.GetDrawingsByUserIdAsync(userId);
            return Ok(drawings);
        }


        [Authorize]
        [HttpPut("drawing/{id}")]
        public async Task<IActionResult> UpdateDrawing(int id, [FromBody] DrawingDto dto)
        {
            var userIdString = User.FindFirst("userId")?.Value;

            if (userIdString == null)
                return Unauthorized();

            if (!int.TryParse(userIdString, out var userId))
                return BadRequest("Invalid user ID format in token.");

            var updatedDrawing = await _drawingService.UpdateDrawingAsync(id, userId, dto);

            if (updatedDrawing == null)
                return NotFound("Drawing not found or you do not have permission to edit it.");

            return Ok(updatedDrawing);
        }


        [HttpGet("drawing/{id}")]
        public async Task<IActionResult> GetDrawing(int id)
        {
            var drawing = await _drawingService.GetDrawingByIdAsync(id);
            if (drawing == null)
                return NotFound();

            return Ok(drawing);
        }

    }
}
