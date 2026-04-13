# Database Setup & Migration Guide

## 🗄️ Step-by-Step Instructions

### Prerequisites
```
✅ .NET 8 SDK installed
✅ SQL Server (localdb) running
✅ All Phase 1 & Phase 2 code in place
```

---

## 📋 Step 1: Verify Connection String

Open `appsettings.json` and verify the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ECoVDB;Trusted_Connection=true;"
  }
}
```

**For local development**, this should work fine. **For production**, update with your server details.

---

## 🔄 Step 2: Create Database Schema (Migrations)

### In PowerShell (from `shadowfactory` folder):

```powershell
# 1. Navigate to project directory
cd C:\Users\LOQ\OneDrive\Desktop\ECOv\ Full\ Stack\circular-economy-hackathon\shadowfactory

# 2. Create migration
dotnet ef migrations add AddCircularEconomyEntities

# This will create a Migration file in: Migrations/[TIMESTAMP]_AddCircularEconomyEntities.cs
```

**Output Should Show**:
```
Build started...
Build succeeded.
Done. To undo this action, use 'dotnet ef migrations remove'
```

---

## ⬆️ Step 3: Apply Migration to Database

```powershell
# Apply the migration to create tables
dotnet ef database update
```

**Output Should Show**:
```
Build started...
Build succeeded.
Applying migration '[TIMESTAMP]_AddCircularEconomyEntities'.
Done.
```

---

## ✨ Step 4: Verify Database Created

The migration automatically:
- ✅ Creates all tables (WasteAssets, WasteJourneyEntries, etc.)
- ✅ Sets up foreign keys and relationships
- ✅ Creates indexes for performance
- ✅ Seeds test data (3 factories, 3 recyclers, 4 waste types, etc.)

**To verify**, check in SQL Server (localdb):
```sql
-- In SQL Server Management Studio
SELECT name FROM sys.tables WHERE name LIKE '%Waste%'

-- Should show:
-- WasteAssets
-- WasteJourneyEntries
-- EnvironmentalImpactRecords
-- WasteAssetOffers
-- WasteRecyclingOrders
```

---

## 🚀 Step 5: Run the Application

```powershell
# From shadowfactory folder
dotnet run

# Output should show:
# ✅ Seeding database with test data...
# ✅ Seed data created successfully!
#    - 4 waste types
#    - 4 packaging subtypes
#    - 3 test factories
#    - 3 recycling centers
#    - 4 recycler capabilities
```

**Application runs at**: `https://localhost:7113`

---

## 📊 Step 6: Test the API

### Using Swagger UI (Recommended)

```
URL: https://localhost:7113/swagger/index.html
```

### Example API Test: Create a Waste Asset

```bash
curl -X POST "https://localhost:7113/api/waste-assets/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "wasteTypeId": 1,
    "quantity": 500,
    "unit": "kg",
    "qualityNotes": "Clean, dry, sorted plastic",
    "isReusable": true,
    "maxReuseCount": 3
  }'
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Waste asset created successfully",
  "data": {
    "id": 1,
    "status": 0,
    "quantity": 500,
    "unit": "kg",
    "estimatedCO2EquivalentIfLandfilled": 1250,
    "journey": [
      {
        "status": 0,
        "timestamp": "2026-04-10T12:00:00Z",
        "responsibleFactory": "Factory A"
      }
    ]
  }
}
```

---

## 🧪 Testing Complete Workflow (End-to-End)

### Test Case 1: Factory Lists Waste
```powershell
# Get an auth token first (from login)
# Then create waste asset
POST /api/waste-assets/create
```

### Test Case 2: Factory B Makes Offer
```powershell
POST /api/waste-offers/create
{
  "wasteAssetId": 1,
  "offeredQuantity": 500,
  "offeredPricePerUnit": 2.0,
  "intendedUseType": "Recycling"
}
```

### Test Case 3: Accept Offer (Revenue Point #1)
```powershell
POST /api/waste-offers/1/accept
# Response: 5% commission calculated and logged
```

### Test Case 4: Send to Recycler (Revenue Point #2)
```powershell
POST /api/recycling-orders/send-to-recycler
{
  "wasteAssetId": 1,
  "recyclerId": 1
}
```

### Test Case 5: Complete Recycling (Revenue Point #3)
```powershell
POST /api/recycling-orders/1/complete
{
  "processMethodUsed": "Mechanical",
  "actualEfficiencyPercent": 88,
  "outputMaterialType": "Plastic Pellets",
  "outputQuantity": 420,
  "outputUnit": "kg"
}
# New WasteAsset created from output
# Environmental impact calculated: 934 kg CO2 avoided
```

### Test Case 6: View Platform Impact (Revenue Point #5)
```powershell
GET /api/impact-reports/platform/statistics
# Response: Platform-wide environmental metrics
```

---

## 🔙 Troubleshooting

### Issue: "Database already exists"
```powershell
# Remove the old database and start fresh
dotnet ef database drop
dotnet ef database update
```

### Issue: "Migration failed"
```powershell
# Remove last migration
dotnet ef migrations remove

# Check migration status
dotnet ef migrations list
```

### Issue: "Cannot connect to (localdb)"
```powershell
# Verify localdb is running
sqllocaldb info

# If not, create instance
sqllocaldb create

# Start it
sqllocaldb start mssqllocaldb
```

### Issue: JWT Token errors in API calls
```
Use Swagger UI instead - it handles JWT automatically
Or manually get token from /api/auth/login endpoint
```

---

## 📁 Files Created/Modified

### New Files
- ✅ `Services/WasteAssetService.cs` - Business logic
- ✅ `Services/ImpactCalculationService.cs` - Impact metrics
- ✅ `Controllers/CircularEconomyController.cs` - API endpoints
- ✅ `Data/SeedData.cs` - Test data seeding

### Modified Files
- ✅ `Program.cs` - DI registration + seed data call
- ✅ `ECoVDbContext.cs` - 5 new DbSets

### No Changes Needed
- `appsettings.json` - Connection string already configured
- `AuthController.cs` - Auth still works
- `Factory.cs` - Existing entities still work

---

## 🎯 What Happens When You Run

### On `dotnet ef migrations add`
1. Analyzes all DbSets in ECoVDbContext
2. Generates SQL CREATE TABLE statements
3. Creates migration file in `Migrations/` folder
4. Never touches actual database

### On `dotnet ef database update`
1. Reads migration files
2. Compares with current database state
3. Executes SQL to create missing tables
4. Updates `__EFMigrationsHistory` table
5. Seeds test data via Program.cs initialization

### On `dotnet run`
1. Loads Program.cs
2. Creates database scope
3. Calls `SeedData.SeedTestDataAsync()`
4. Seeds: 3 factories, 3 recyclers, 4 waste types
5. Starts API on https://localhost:7113

---

## ✅ Success Checklist

- [ ] Connection string verified
- [ ] Migration created with `dotnet ef migrations add`
- [ ] Database updated with `dotnet ef database update`
- [ ] Application runs with `dotnet run`
- [ ] No errors about missing tables
- [ ] Swagger accessible at `/swagger`
- [ ] Can create waste asset via API
- [ ] Can view impact reports
- [ ] Database has 3 test factories

---

## 📚 Next Steps After Setup

1. **Update Frontend** (React)
   - Replace WasteListing queries with WasteAsset
   - Add new marketplace UI
   - Add impact dashboard

2. **Test Payment Integration** (Paymob)
   - Commission charged on offer acceptance
   - Recycler fee collection

3. **Add Blockchain** (Optional)
   - Certificate NFTs
   - CO2 token minting

4. **Monitor Logs**
   - Track commission calculations
   - Monitor waste journey progression

---

## 💡 Pro Tips

### Tip 1: Speed Up Testing
```powershell
# Use InMemory database for tests
# No SQL Server needed for unit tests
```

### Tip 2: Reset Database Cleanly
```powershell
# Nuclear option - start fresh
dotnet ef database drop --force
dotnet ef database update
```

### Tip 3: Seed Custom Data
Edit `SeedData.cs` to add your own test factories, recyclers, etc.

### Tip 4: Monitor Activities
```sql
-- Check seeded factories
SELECT * FROM Factories WHERE IsVerified = 1

-- Check recyclers
SELECT * FROM Recyclers WHERE Status = 'Active'

-- Check waste types
SELECT * FROM WasteTypes
```

---

## 🎊 When Everything Works

You'll see in console:
```
🌱 Seeding database with test data...
✅ Seed data created successfully!
   - 4 waste types
   - 4 packaging subtypes
   - 3 test factories
   - 3 recycling centers
   - 4 recycler capabilities
```

And you can immediately:
- ✅ Create waste assets
- ✅ Make purchase offers
- ✅ Launch complete recycling workflows
- ✅ Track environmental impact
- ✅ View earnings reports

---

**Ready to go live!** 🚀
