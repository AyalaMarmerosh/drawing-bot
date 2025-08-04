using DrawingBot.Models;
using Microsoft.EntityFrameworkCore;

namespace DrawingBot.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        // פונקציה ללוגין: מחפשת משתמש לפי שם וסיסמה (פשוט לצורך דוגמה)
        public async Task<User?> LoginAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null)
                return null;

            if (!PasswordHasher.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }
    }

}
