using Microsoft.EntityFrameworkCore;
using shadowfactory.Models;
using shadowfactory.Models.Entities;
using WasteListingEntity = shadowfactory.Models.Entities.WasteListing;
using TransactionEntity = shadowfactory.Models.Entities.Transaction;
using PartnerEntity = shadowfactory.Models.Entities.Partner;

namespace shadowfactory.Data
{
    public class ECoVDbContext : DbContext
    {
        public ECoVDbContext(DbContextOptions<ECoVDbContext> options) : base(options)
        {
        }

        public DbSet<Factory> Factories { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<VerificationToken> VerificationTokens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WasteListing> WasteListings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Partner> Partners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Factory configuration
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

            // AuditLog configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => new { e.EntityType, e.EntityId });
            });

            // VerificationToken configuration
            modelBuilder.Entity<VerificationToken>(entity =>
            {
                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => e.Email);
                entity.HasIndex(e => e.ExpiresAt);
                entity.HasIndex(e => e.FactoryId);
            });

            // ⭐⭐⭐ MINIMAL User configuration - EF will use [NotMapped] attributes ⭐⭐⭐
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => e.Role);
            });

            // WasteListing configuration
            modelBuilder.Entity<WasteListing>(entity =>
            {
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.ExpiresAt);

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)");
                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");
            });

            // Transaction configuration
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasIndex(e => e.WasteListingId);
                entity.HasIndex(e => e.BuyerFactoryId);
                entity.HasIndex(e => e.SellerFactoryId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)");
                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");
            });

            // Partner configuration
            modelBuilder.Entity<Partner>(entity =>
            {
                entity.HasIndex(e => e.Location);
                entity.HasIndex(e => e.Specialty);
                entity.HasIndex(e => e.IsVerified);
                entity.HasIndex(e => e.Rating);
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Initialize User defaults before saving
            var userEntries = ChangeTracker
                .Entries<User>()
                .Where(e => e.State == EntityState.Added);

            foreach (var entry in userEntries)
            {
                var user = entry.Entity;
                // Ensure nullable booleans have defaults
                user.EmailNotifications ??= true;
                user.AppNotifications ??= true;
                user.PublicProfile ??= true;
                if (user.RegistrationDate == default)
                    user.RegistrationDate = DateTime.Now;
            }

            // Auto-update UpdatedAt property
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is IHasTimestamps &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added)
                {
                    ((IHasTimestamps)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
                    ((IHasTimestamps)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;
                }
                else if (entityEntry.State == EntityState.Modified)
                {
                    ((IHasTimestamps)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }

    // Interface for entities with timestamp properties
    public interface IHasTimestamps
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}