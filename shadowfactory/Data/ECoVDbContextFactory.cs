using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace shadowfactory.Data
{
    /// <summary>
    /// Design-time factory for EF Core migrations
    /// </summary>
    public class ECoVDbContextFactory : IDesignTimeDbContextFactory<ECoVDbContext>
    {
        public ECoVDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ECoVDbContext>();

            // Build configuration to read from appsettings.json
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            // Get the connection string from appsettings.json
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new ECoVDbContext(optionsBuilder.Options);
        }
    }
}