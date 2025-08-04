using DrawingBot.DTOs;
using DrawingBot.Models;
using Microsoft.EntityFrameworkCore;

namespace DrawingBot.Services
{
    public class DrawingService
    {
        private readonly AppDbContext _context;
        public DrawingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Drawing> AddDrawingAsync(int userId, DrawingDto dto)
        {
            var drawing = new Drawing
            {
                UserId = userId,
                Name = dto.Name,
                JsonData = dto.JsonData,
                CreatedAt = DateTime.UtcNow,
                Prompt= dto.Prompt
            };
            _context.Drawings.Add(drawing);
            await _context.SaveChangesAsync();
            return drawing;
        }

        public async Task<Drawing?> GetDrawingByIdAsync(int id)
        {
            return await _context.Drawings.FindAsync(id);
        }

        public async Task<List<DrawingDto>> GetDrawingsByUserIdAsync(int userId)
        {
            var drawings = await _context.Drawings
                .Where(d => d.UserId == userId)
                .Select(d => new DrawingDto
                {
                    Id= d.Id,
                    Name = d.Name,
                    JsonData = d.JsonData,
                    Prompt = d.Prompt
                })
                .ToListAsync();

            return drawings;
        }

        public async Task<Drawing?> UpdateDrawingAsync(int drawingId, int userId, DrawingDto dto)
        {
            var drawing = await _context.Drawings.FindAsync(drawingId);
            if (drawing == null || drawing.UserId != userId)
                return null;

            drawing.Name = dto.Name;
            drawing.JsonData = dto.JsonData;
            drawing.Prompt = dto.Prompt;

            await _context.SaveChangesAsync();
            return drawing;
        }

    }
}
