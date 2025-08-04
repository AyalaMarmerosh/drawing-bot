namespace DrawingBot.Models
{
    public class DrawingCommand
    {
        public string Type { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Radius { get; set; }
        public string Color { get; set; }
    }
}
