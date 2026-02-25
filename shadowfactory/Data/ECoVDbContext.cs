using Microsoft.EntityFrameworkCore;
using shadowfactory.Models;
using shadowfactory.Models.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace shadowfactory.Data
{
    public class ECoVDbContext : DbContext
    {
        public ECoVDbContext(DbContextOptions<ECoVDbContext> options) : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<Factory> Factories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<VerificationToken> VerificationTokens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<FactoryWasteType> FactoryWasteTypes { get; set; }
        public DbSet<WasteListing> WasteListings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Partner> Partners { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==================== FACTORY CONFIGURATION ====================
            modelBuilder.Entity<Factory>(entity =>
            {
                entity.ToTable("Factories");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.TaxNumber).IsUnique();
                entity.HasIndex(e => e.RegistrationNumber).IsUnique();
                entity.HasIndex(e => e.FactoryName);
                entity.HasIndex(e => e.Location);
                entity.HasIndex(e => e.Status);

                entity.Property(e => e.FactoryName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FactoryNameEn).IsRequired().HasMaxLength(255);
                entity.Property(e => e.IndustryType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Fax).HasMaxLength(20);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Website).HasMaxLength(500);
                entity.Property(e => e.OwnerName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.OwnerPhone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.OwnerEmail).HasMaxLength(255);
                entity.Property(e => e.TaxNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.RegistrationNumber).IsRequired().HasMaxLength(50);

                entity.Property(e => e.FactorySize)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2);

                entity.Property(e => e.ProductionCapacity)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2);

                entity.Property(e => e.LogoUrl).HasMaxLength(500);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Navigation properties
                entity.HasMany(e => e.Users)
                    .WithOne(u => u.Factory)
                    .HasForeignKey(u => u.FactoryId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(e => e.FactoryWasteTypes)
                    .WithOne(f => f.Factory)
                    .HasForeignKey(f => f.FactoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.AuditLogs)
                    .WithOne(a => a.Factory)
                    .HasForeignKey(a => a.FactoryId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.VerificationToken)
                    .WithOne(v => v.Factory)
                    .HasForeignKey<VerificationToken>(v => v.FactoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ==================== USER CONFIGURATION ====================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => e.Role);

                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Salt).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50).HasDefaultValue("FactoryOwner");

                // Ignore properties not in database
                entity.Ignore(e => e.Phone);
                entity.Ignore(e => e.EmailNotifications);
                entity.Ignore(e => e.AppNotifications);
                entity.Ignore(e => e.PublicProfile);
                entity.Ignore(e => e.RegistrationDate);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithMany(f => f.Users)
                    .HasForeignKey(e => e.FactoryId);
            });

            // ==================== AUDIT LOG CONFIGURATION ====================
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("AuditLogs");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => new { e.EntityType, e.EntityId });

                entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
                entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.IpAddress).HasMaxLength(45);
                entity.Property(e => e.UserAgent).HasMaxLength(500);
                entity.Property(e => e.Url).HasMaxLength(500);
                entity.Property(e => e.Timestamp).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithMany(f => f.AuditLogs)
                    .HasForeignKey(e => e.FactoryId);
            });

            // ==================== VERIFICATION TOKEN CONFIGURATION ====================
            modelBuilder.Entity<VerificationToken>(entity =>
            {
                entity.ToTable("VerificationTokens");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => e.Email);
                entity.HasIndex(e => e.ExpiresAt);
                entity.HasIndex(e => e.FactoryId);

                entity.Property(e => e.Token).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.TokenType).IsRequired().HasMaxLength(50).HasDefaultValue("email_verification");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithOne(f => f.VerificationToken)
                    .HasForeignKey<VerificationToken>(e => e.FactoryId);
            });

            // ==================== FACTORY WASTE TYPE CONFIGURATION ====================
            modelBuilder.Entity<FactoryWasteType>(entity =>
            {
                entity.ToTable("FactoryWasteTypes");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => e.WasteCode);
                entity.HasIndex(e => new { e.FactoryId, e.WasteCode }).IsUnique();

                entity.Property(e => e.WasteCode).IsRequired().HasMaxLength(50);

                entity.Property(e => e.WasteAmount)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.WasteUnit).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Frequency).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.WasteNameAr).HasMaxLength(255);
                entity.Property(e => e.WasteNameEn).HasMaxLength(255);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithMany(f => f.FactoryWasteTypes)
                    .HasForeignKey(e => e.FactoryId);
            });

            // ==================== WASTE LISTING CONFIGURATION ====================
            modelBuilder.Entity<WasteListing>(entity =>
            {
                entity.ToTable("WasteListings", "dbo");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.FactoryId);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.ExpiresAt);

                entity.Property(e => e.Type).IsRequired().HasMaxLength(100);
                entity.Property(e => e.TypeEn).IsRequired().HasMaxLength(50);

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Unit).IsRequired().HasMaxLength(20);

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.FactoryName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Active");
                entity.Property(e => e.Views).HasDefaultValue(0);
                entity.Property(e => e.Offers).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithMany()
                    .HasForeignKey(e => e.FactoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ==================== ORDER CONFIGURATION ====================
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Orders");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.OrderNumber).IsUnique();
                entity.HasIndex(e => e.BuyerFactoryId);
                entity.HasIndex(e => e.SellerFactoryId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.OrderDate);

                entity.Property(e => e.OrderNumber)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.WasteType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.WasteCategory)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Unit)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.BuyerName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.SellerName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("معلق");

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.OrderDate)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Relationships
                entity.HasOne(e => e.WasteListing)
                    .WithMany()
                    .HasForeignKey(e => e.WasteListingId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BuyerFactory)
                    .WithMany()
                    .HasForeignKey(e => e.BuyerFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.SellerFactory)
                    .WithMany()
                    .HasForeignKey(e => e.SellerFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==================== TRANSACTION CONFIGURATION ====================
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transactions");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.WasteListingId);
                entity.HasIndex(e => e.BuyerFactoryId);
                entity.HasIndex(e => e.SellerFactoryId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);

                entity.Property(e => e.WasteType).IsRequired().HasMaxLength(100);

                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Unit).IsRequired().HasMaxLength(20);

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)")
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Pending");
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.WasteListing)
                    .WithMany()
                    .HasForeignKey(e => e.WasteListingId);

                entity.HasOne(e => e.BuyerFactory)
                    .WithMany()
                    .HasForeignKey(e => e.BuyerFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.SellerFactory)
                    .WithMany()
                    .HasForeignKey(e => e.SellerFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==================== PARTNER CONFIGURATION ====================
            modelBuilder.Entity<Partner>(entity =>
            {
                entity.ToTable("Partners");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Location);
                entity.HasIndex(e => e.Specialty);
                entity.HasIndex(e => e.IsVerified);
                entity.HasIndex(e => e.Rating);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Specialty).IsRequired().HasMaxLength(100);

                entity.Property(e => e.Rating)
                    .HasColumnType("decimal(3,2)")
                    .HasPrecision(3, 2)
                    .HasDefaultValue(0);

                entity.Property(e => e.CompletedDeals).HasDefaultValue(0);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.LogoUrl).HasMaxLength(500);
                entity.Property(e => e.ContactEmail).HasMaxLength(100);
                entity.Property(e => e.ContactPhone).HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
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
                else
                {
                    ((IHasTimestamps)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }

    public interface IHasTimestamps
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}