using Microsoft.EntityFrameworkCore;

namespace ControleChamados.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}