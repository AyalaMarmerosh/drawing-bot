namespace DrawingBot.Models
{
    public class Drawing
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public string JsonData { get; set; }
        public string Prompt { get; set; }

    }
}
