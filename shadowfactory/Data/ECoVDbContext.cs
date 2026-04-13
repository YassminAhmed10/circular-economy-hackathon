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
    // Define the interface outside the class
    public interface IHasTimestamps
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }

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
        public DbSet<WasteType> WasteTypes { get; set; }
        public DbSet<FactoryWaste> FactoryWastes { get; set; }
        public DbSet<FactoryPurchase> FactoryPurchases { get; set; }
        public DbSet<PackagingWasteSubtype> PackagingWasteSubtypes { get; set; }
        public DbSet<Recycler> Recyclers { get; set; }
        public DbSet<RecyclerCapability> RecyclerCapabilities { get; set; }
        public DbSet<RecyclerSuggestion> RecyclerSuggestions { get; set; }
        public DbSet<WasteAsset> WasteAssets { get; set; }
        public DbSet<WasteJourneyEntry> WasteJourneyEntries { get; set; }
        public DbSet<EnvironmentalImpactRecord> EnvironmentalImpactRecords { get; set; }
        public DbSet<WasteAssetOffer> WasteAssetOffers { get; set; }
        public DbSet<WasteRecyclingOrder> WasteRecyclingOrders { get; set; }
        public DbSet<OrderPayment> OrderPayments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==================== GLOBAL UNICODE CONFIGURATION ====================
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(string))
                    {
                        property.SetIsUnicode(true);
                    }
                }
            }

            // ==================== FACTORY CONFIGURATION ====================
            modelBuilder.Entity<Factory>(entity =>
            {
                entity.ToTable("Factories");
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Email);
                entity.HasIndex(e => e.TaxNumber);
                entity.HasIndex(e => e.RegistrationNumber);
                entity.HasIndex(e => e.FactoryName);
                entity.HasIndex(e => e.Location);
                entity.HasIndex(e => e.Status);

                entity.Property(e => e.FactoryName).IsRequired().HasMaxLength(255).IsUnicode(true);
                entity.Property(e => e.FactoryNameEn).IsRequired().HasMaxLength(255).IsUnicode(true);
                entity.Property(e => e.IndustryType).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(500).IsUnicode(true);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Fax).HasMaxLength(20);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Website).HasMaxLength(500);
                entity.Property(e => e.OwnerName).IsRequired().HasMaxLength(255).IsUnicode(true);
                entity.Property(e => e.OwnerPhone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.OwnerEmail).HasMaxLength(255);
                entity.Property(e => e.TaxNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.RegistrationNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EmployeeCount);
                entity.Property(e => e.EstablishmentYear);
                entity.Property(e => e.FactorySize).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ProductionCapacity).HasColumnType("decimal(18,2)");
                entity.Property(e => e.LogoUrl).HasColumnType("nvarchar(max)");
                entity.Property(e => e.IsVerified).HasDefaultValue(false);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending").IsUnicode(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.DescriptionAr).HasMaxLength(1000).IsUnicode(true);
                entity.Property(e => e.DescriptionEn).HasMaxLength(1000).IsUnicode(true);
                entity.Property(e => e.Rating).HasColumnType("decimal(3,2)");
                entity.Property(e => e.TotalReviews);
                entity.Property(e => e.Latitude).HasColumnType("decimal(10,8)");
                entity.Property(e => e.Longitude).HasColumnType("decimal(11,8)");

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

                entity.Property(e => e.Type).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.TypeEn).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.Unit).IsRequired().HasMaxLength(20).IsUnicode(true);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.FactoryName).IsRequired().HasMaxLength(200).IsUnicode(true);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.Description).HasMaxLength(500).IsUnicode(true);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("Active").IsUnicode(true);
                entity.Property(e => e.Views).HasDefaultValue(0);
                entity.Property(e => e.Offers).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.TitleAr).HasMaxLength(200).IsUnicode(true);
                entity.Property(e => e.TitleEn).HasMaxLength(200).IsUnicode(true);
                entity.Property(e => e.DescriptionAr).HasMaxLength(1000).IsUnicode(true);
                entity.Property(e => e.DescriptionEn).HasMaxLength(1000).IsUnicode(true);
                entity.Property(e => e.CompanyNameAr).HasMaxLength(200).IsUnicode(true);
                entity.Property(e => e.CompanyNameEn).HasMaxLength(200).IsUnicode(true);
                entity.Property(e => e.LocationAr).HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.LocationEn).HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.WeightAr).HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.WeightEn).HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.Rating).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Reviews);
                entity.Property(e => e.Badge).HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.Specifications).IsUnicode(true);
                entity.Property(e => e.SellerRating).HasColumnType("decimal(18,2)");
                entity.Property(e => e.SellerTotalSales);
                entity.Property(e => e.SellerJoined).HasMaxLength(20).IsUnicode(true);
                entity.Property(e => e.SellerWhatsapp).HasMaxLength(20);
                entity.Property(e => e.Latitude).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Longitude).HasColumnType("decimal(18,2)");
                entity.Property(e => e.LocationLink).HasMaxLength(500);

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

                entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.WasteType).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.WasteCategory).IsRequired().HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.Unit).IsRequired().HasMaxLength(20).IsUnicode(true);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.BuyerName).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.SellerName).IsRequired().HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50).HasDefaultValue("معلق").IsUnicode(true);
                entity.Property(e => e.OrderStatus).HasMaxLength(50).HasDefaultValue("Pending").IsUnicode(true);
                entity.Property(e => e.PaymentStatus).HasMaxLength(50).HasDefaultValue("Pending").IsUnicode(true);
                entity.Property(e => e.RecyclerStatus).HasMaxLength(50).HasDefaultValue("None").IsUnicode(true);
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.RecyclerProcessingFee).HasColumnType("decimal(18,2)");
                entity.Property(e => e.RecyclerRequestedAt);
                entity.Property(e => e.RecyclerAcceptedAt);
                entity.Property(e => e.Notes).HasMaxLength(500).IsUnicode(true);
                entity.Property(e => e.RecipientName).HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.RecipientPhone).HasMaxLength(20);
                entity.Property(e => e.DeliveryAddress).HasMaxLength(500).IsUnicode(true);
                entity.Property(e => e.Governorate).HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.DeliveryMethod).HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.PaymentMethod).HasMaxLength(50).IsUnicode(true);
                entity.Property(e => e.OrderType).HasMaxLength(50).HasDefaultValue("direct").IsUnicode(true);
                entity.Property(e => e.OrderDate).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

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

                entity.HasOne(e => e.Recycler)
                    .WithMany()
                    .HasForeignKey(e => e.RecyclerId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.WasteRecyclingOrder)
                    .WithOne(w => w.Order)
                    .HasForeignKey<WasteRecyclingOrder>(w => w.OrderId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(e => e.Payments)
                    .WithOne(p => p.Order)
                    .HasForeignKey(p => p.OrderId)
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
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(255).IsUnicode(true);
                entity.Property(e => e.Salt).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50).HasDefaultValue("FactoryOwner").IsUnicode(true);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.EmailNotifications).HasDefaultValue(true);
                entity.Property(e => e.AppNotifications).HasDefaultValue(true);
                entity.Property(e => e.PublicProfile).HasDefaultValue(true);
                entity.Property(e => e.RegistrationDate).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Factory)
                    .WithMany(f => f.Users)
                    .HasForeignKey(e => e.FactoryId);
            });

            // ==================== ORDER PAYMENT CONFIGURATION ====================
            modelBuilder.Entity<OrderPayment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.ToTable("OrderPayments");

                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.PayerFactoryId);
                entity.HasIndex(e => e.PayeeFactoryId);
                entity.HasIndex(e => new { e.OrderId, e.PaymentType, e.Status });
                entity.HasIndex(e => e.CreatedAt);

                entity.Property(e => e.PaymentType).IsRequired().HasDefaultValue(0);
                entity.Property(e => e.Status).IsRequired().HasDefaultValue(0);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.PaymentMethod).HasMaxLength(100).IsUnicode(true);
                entity.Property(e => e.TransactionReference).HasMaxLength(200);
                entity.Property(e => e.Notes).HasMaxLength(500).IsUnicode(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(e => e.Order)
                    .WithMany(o => o.Payments)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.PayerFactory)
                    .WithMany()
                    .HasForeignKey(e => e.PayerFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.PayeeFactory)
                    .WithMany()
                    .HasForeignKey(e => e.PayeeFactoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Keep your existing configurations for other entities...
        }

        // Fix SaveChangesAsync - remove the IHasTimestamps check if entities don't implement it
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Normalize Unicode strings before saving
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                foreach (var property in entry.Properties)
                {
                    if (property.Metadata.ClrType == typeof(string) && property.CurrentValue != null)
                    {
                        var stringValue = property.CurrentValue.ToString();
                        if (!string.IsNullOrEmpty(stringValue))
                        {
                            property.CurrentValue = stringValue.Normalize(System.Text.NormalizationForm.FormC);
                        }
                    }
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}