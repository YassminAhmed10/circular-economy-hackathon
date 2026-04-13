using shadowfactory.Models;
using shadowfactory.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace shadowfactory.Data
{
    /// <summary>
    /// Seeding minimal test data for the circular economy platform
    /// This runs AFTER migrations to populate basic reference data
    /// </summary>
    public static class SeedData
    {
        public static async Task SeedTestDataAsync(ECoVDbContext context)
        {
            try
            {
                // Check if we already have data
                if (await context.WasteTypes.AnyAsync())
                {
                    Console.WriteLine("✓ Database already seeded, skipping...");
                    return;
                }

                Console.WriteLine("🌱 Beginning database seeding with minimal test data...");

                // 1. Seed Waste Types
                var wasteTypes = new List<WasteType>
                {
                    new WasteType { NameEn = "Packaging Plastic", NameAr = "", Icon = "🔴" },
                    new WasteType { NameEn = "Packaging Paper", NameAr = "", Icon = "📦" },
                    new WasteType { NameEn = "Metal", NameAr = "", Icon = "🔧" },
                    new WasteType { NameEn = "Electronic Waste", NameAr = "", Icon = "⚡" }
                };

                context.WasteTypes.AddRange(wasteTypes);
                await context.SaveChangesAsync();
                Console.WriteLine($"✓ Seeded {wasteTypes.Count} waste types");

                // 2. Seed Packaging Waste Subtypes
                var subtypes = new List<PackagingWasteSubtype>
                {
                    new PackagingWasteSubtype { Name = "PET Bottles", NameAr = "", Description = "Plastic bottles", Icon = "🍾" },
                    new PackagingWasteSubtype { Name = "HDPE Containers", NameAr = "", Description = "Hard plastic containers", Icon = "📚" },
                    new PackagingWasteSubtype { Name = "Aluminum Cans", NameAr = "", Description = "Beverage cans", Icon = "🥫" },
                    new PackagingWasteSubtype { Name = "Cardboard", NameAr = "", Description = "Cardboard boxes", Icon = "📫" }
                };

                context.PackagingWasteSubtypes.AddRange(subtypes);
                await context.SaveChangesAsync();
                Console.WriteLine($"✓ Seeded {subtypes.Count} packaging subtypes");

                // 3. Seed Test Factories
                var factories = new List<Factory>
                {
                    new Factory
                    {
                        FactoryName = "Alpha Factory",
                        FactoryNameEn = "Alpha Factory",
                        IndustryType = "Plastic Manufacturing",
                        Location = "Cairo",
                        Address = "123 Industrial Street, Cairo",
                        Phone = "+2010012345",
                        Email = "alpha@factory.com",
                        OwnerName = "Ahmed Ali",
                        OwnerPhone = "+2010012345",
                        TaxNumber = "TAX001",
                        RegistrationNumber = "REG001"
                    },
                    new Factory
                    {
                        FactoryName = "Beta Factory",
                        FactoryNameEn = "Beta Factory",
                        IndustryType = "Paper Manufacturing",
                        Location = "Alexandria",
                        Address = "456 Manufacturing Ave, Alexandria",
                        Phone = "+2011012345",
                        Email = "beta@factory.com",
                        OwnerName = "Fatima Mohamed",
                        OwnerPhone = "+2011012345",
                        TaxNumber = "TAX002",
                        RegistrationNumber = "REG002"
                    }
                };

                context.Factories.AddRange(factories);
                await context.SaveChangesAsync();
                Console.WriteLine($"✓ Seeded {factories.Count} factories");

                // 4. Seed Test Recyclers
                var recyclers = new List<Recycler>
                {
                    new Recycler
                    {
                        CompanyName = "First Recycling Center",
                        CompanyNameAr = "",
                        Description = "Leading plastic recycling facility",
                        DescriptionAr = "",
                        ContactEmail = "recycler1@ecov.test",
                        ContactPhone = "+20123456789",
                        WhatsappNumber = "+20123456789",
                        Location = "Cairo Industrial",
                        LocationAr = "",
                        LogoUrl = "/logos/recycler1.png",
                        CertificationNumber = "CERT001",
                        IsVerified = true
                    },
                    new Recycler
                    {
                        CompanyName = "Second Recycling Center",
                        CompanyNameAr = "",
                        Description = "Paper and cardboard recycling",
                        DescriptionAr = "",
                        ContactEmail = "recycler2@ecov.test",
                        ContactPhone = "+20123456790",
                        WhatsappNumber = "+20123456790",
                        Location = "Alexandria Port",
                        LocationAr = "",
                        LogoUrl = "/logos/recycler2.png",
                        CertificationNumber = "CERT002",
                        IsVerified = true
                    }
                };

                context.Recyclers.AddRange(recyclers);
                await context.SaveChangesAsync();
                Console.WriteLine($"✓ Seeded {recyclers.Count} recyclers");

                // 5. Seed Recycler Capabilities  
                var capabilities = new List<RecyclerCapability>
                {
                    new RecyclerCapability
                    {
                        RecyclerId = 1,
                        InputWasteSubtypeId = 1,
                        OutputMaterialType = "Plastic Pellets",
                        OutputMaterialTypeAr = "",
                        CapacityPerMonth = 10000m,
                        CapacityUnit = "kg",
                        LeadTime = 7,
                        ProcessDescription = "Mechanical recycling of PET bottles"
                    },
                    new RecyclerCapability
                    {
                        RecyclerId = 2,
                        InputWasteSubtypeId = 4,
                        OutputMaterialType = "Recycled Paper",
                        OutputMaterialTypeAr = "",
                        CapacityPerMonth = 20000m,
                        CapacityUnit = "kg",
                        LeadTime = 5,
                        ProcessDescription = "Cardboard to recycled paper"
                    }
                };

                context.RecyclerCapabilities.AddRange(capabilities);
                await context.SaveChangesAsync();
                Console.WriteLine($"✓ Seeded {capabilities.Count} recycler capabilities");

                // 6. Seed Test Admin User
                var salt = GenerateSalt();
                var adminUser = new User
                {
                    Email = "admin@ecov.test",
                    FullName = "Admin User",
                    Phone = "+201234567890",
                    Salt = Convert.ToBase64String(salt),
                    PasswordHash = HashPassword("Admin@123", salt),
                    Role = "Admin",
                    IsActive = true
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
                Console.WriteLine("✓ Seeded admin user (admin@ecov.test / Admin@123)");

                Console.WriteLine("✅ Database seeding completed successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error during seeding: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                // Don't throw - allow app to continue even if seeding fails
            }
        }

        private static byte[] GenerateSalt()
        {
            byte[] buffer = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(buffer);
            }
            return buffer;
        }

        private static string HashPassword(string password, byte[] salt)
        {
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(32);
                byte[] hashWithSalt = new byte[48];
                Buffer.BlockCopy(salt, 0, hashWithSalt, 0, 16);
                Buffer.BlockCopy(hash, 0, hashWithSalt, 16, 32);
                return Convert.ToBase64String(hashWithSalt);
            }
        }
    }
}
