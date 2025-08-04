using DrawingBot.Models;
using Microsoft.EntityFrameworkCore;

namespace DrawingBot.Services
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Drawing> Drawings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Drawing>()
                .HasOne(d => d.User)
                .WithMany(u => u.Drawings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }


        public AppDbContext(DbContextOptions<AppDbContext> options ) : base(options) { }
    }
}
