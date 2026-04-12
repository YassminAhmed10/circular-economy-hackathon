using Microsoft.EntityFrameworkCore;
using shadowfactory.Models;
using shadowfactory.Models.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using shadowfactory.Data;

namespace shadowfactory.Data
{
    public class ECoVDbContext : DbContext
    {
        public ECoVDbContext(DbContextOptions<ECoVDbContext> options) : base(options) { }

        // Core entities
        public DbSet<Factory> Factories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<VerificationToken> VerificationTokens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<FactoryWasteType> FactoryWasteTypes { get; set; }

        // Marketplace / legacy
        public DbSet<WasteListing> WasteListings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        // Factory waste/purchase sets (required by profile controller)
        public DbSet<FactoryWaste> FactoryWastes { get; set; }
        public DbSet<FactoryPurchase> FactoryPurchases { get; set; }

        // New phase entities
        public DbSet<WasteAsset> WasteAssets { get; set; }
        public DbSet<WasteJourneyEntry> WasteJourneyEntries { get; set; }
        public DbSet<WasteRecyclingOrder> WasteRecyclingOrders { get; set; }
        public DbSet<EnvironmentalImpactRecord> EnvironmentalImpactRecords { get; set; }
        public DbSet<Offer> Offers { get; set; } // Added DbSet for Offers
        public DbSet<Escrow> Escrows { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Minimal mappings for new entities (expand only as needed)
            modelBuilder.Entity<WasteAsset>(entity =>
            {
                entity.ToTable("WasteAssets", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Unit).HasMaxLength(20).HasDefaultValue("kg");
                entity.Property(e => e.CurrentStatus).HasMaxLength(50).HasDefaultValue("Available");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<WasteJourneyEntry>(entity =>
            {
                entity.ToTable("WasteJourneyEntries", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProofUrl).HasMaxLength(500);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.HasIndex(e => e.WasteAssetId);
            });

            modelBuilder.Entity<WasteRecyclingOrder>(entity =>
            {
                entity.ToTable("WasteRecyclingOrders", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Unit).HasMaxLength(20).HasDefaultValue("kg");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.WasteType).HasMaxLength(100);
            });

            modelBuilder.Entity<EnvironmentalImpactRecord>(entity =>
            {
                entity.ToTable("EnvironmentalImpactRecords", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CO2AvoidedKg).HasColumnType("decimal(18,2)");
                entity.Property(e => e.EnergySavedKwh).HasColumnType("decimal(18,2)");
                entity.Property(e => e.WaterSavedLiters).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CalculationMethod).HasMaxLength(200);
                entity.Property(e => e.CalculationDate).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<Offer>(entity =>
            {
                entity.ToTable("Offers", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Unit).HasMaxLength(20).HasDefaultValue("kg");
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.ExpiresAt).HasColumnType("datetimeoffset");
            });

            // Merge/add any additional mappings required for FactoryWaste, FactoryPurchase etc.
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is IHasTimestamps &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var timestamps = (IHasTimestamps)entityEntry.Entity;
                if (entityEntry.State == EntityState.Added)
                {
                    timestamps.CreatedAt = DateTime.UtcNow;
                    timestamps.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    timestamps.UpdatedAt = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
