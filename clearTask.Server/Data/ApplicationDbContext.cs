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

    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    base.OnModelCreating(modelBuilder);

    //    // Configure the one-to-many relationship between TaskModel and AppUserModel
    //    modelBuilder.Entity<TaskModel>()
    //        .HasOne(t => t.User)               // Each task is linked to one user
    //        .WithMany(u => u.Tasks)            // Each user can have multiple tasks
    //        .HasForeignKey(t => t.UserId)      // UserId is the foreign key in TaskModel
    //        .OnDelete(DeleteBehavior.Cascade); // Delete tasks if the user is deleted
    //}
}


