using LAmour.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Data;

public class LAmourDbContext(DbContextOptions<LAmourDbContext> options) : DbContext(options)
{
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Masseuse> Masseuses => Set<Masseuse>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ServiceCategory>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Name).HasMaxLength(120);
        });

        modelBuilder.Entity<Service>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Price).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.ServiceCategory)
                .WithMany(c => c.Services)
                .HasForeignKey(x => x.ServiceCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Appointment>(e =>
        {
            e.Property(x => x.TotalPrice).HasColumnType("decimal(10,2)");

            e.HasOne(x => x.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Masseuse)
                .WithMany(m => m.Appointments)
                .HasForeignKey(x => x.MasseuseId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.SecondMasseuse)
                .WithMany()
                .HasForeignKey(x => x.SecondMasseuseId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => new { x.MasseuseId, x.StartsAt });
        });

        modelBuilder.Entity<AdminUser>(e =>
        {
            e.HasIndex(x => x.Username).IsUnique();
        });
    }
}
