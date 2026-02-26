using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using shadowfactory.Data;  // Add this using statement

namespace shadowfactory.Data  // CHANGE FROM shadowfactory.Models
{
    public class ECoVDbContextFactory : IDesignTimeDbContextFactory<ECoVDbContext>
    {
        public ECoVDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ECoVDbContext>();
            optionsBuilder.UseSqlServer(
                "Server=np:\\\\.\\pipe\\LOCALDB#D843DC02\\tsql\\query;Database=ECoVFactoryDB;Trusted_Connection=True;MultipleActiveResultSets=true"
            );

            return new ECoVDbContext(optionsBuilder.Options);
        }
    }
}