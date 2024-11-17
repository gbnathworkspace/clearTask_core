using clearTask.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<AppUserModel>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<AppUserModel> AppUserModels { get; set; }
    public DbSet<TaskModel> Tasks { get; set; }
    public DbSet<TaskListModel> TaskListModels { get; set; }
}


