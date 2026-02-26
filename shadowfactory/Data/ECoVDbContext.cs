using Microsoft.EntityFrameworkCore;
using shadowfactory.Models;

namespace shadowfactory.Data
{
    public class ECoVDbContext : DbContext
    {
        public ECoVDbContext(DbContextOptions<ECoVDbContext> options) : base(options)
        {
        }

        public DbSet<Factory> Factories { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<VerificationToken> VerificationTokens { get; set; }  // ADD THIS LINE

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Factory>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.TaxNumber).IsUnique();
                entity.HasIndex(e => e.RegistrationNumber).IsUnique();

                entity.Property(e => e.FactorySize)
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.ProductionCapacity)
                    .HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => new { e.EntityType, e.EntityId });
            });

            // ADD VERIFICATION TOKEN CONFIGURATION
            modelBuilder.Entity<VerificationToken>(entity =>
            {
                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => e.Email);
                entity.HasIndex(e => e.ExpiresAt);
                entity.HasIndex(e => e.FactoryId);
            });
        }
    }
}