# Complete API Testing Guide

## 🧪 How to Test the ECOV System End-to-End

---

## Part 1: Preparation

### 1. Start the API
```powershell
cd shadowfactory
dotnet run

# Output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: https://localhost:7113
#       Now listening on: http://localhost:7113
```

### 2. Open Swagger UI
```
https://localhost:7113/swagger/index.html
```

You'll see organized API endpoints ready to test

---

## Part 2: Authentication Setup

### Get JWT Token

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "admin@ecov.test",
  "password": "Admin@123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@ecov.test"
    }
  }
}
```

**⚠️ Save this token!** You'll need it for all other API calls.

### In Swagger, Add Token Global Authentication:
1. Click **Authorize** button (top-right)
2. Paste: `Bearer YOUR_TOKEN_HERE`
3. Click **Authorize** → **Close**
4. All endpoints now automatically include your token

---

## Part 3: Complete E2E Testing Flow

### 🟡 Test 1: Get Factory List (Verify seeded data)

**Endpoint**: `GET /api/auth/factories-list` (or similar)

**Expected Response**: List of 3 test factories
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "factoryName": "مصنع ألفا",
      "status": "Active",
      "email": "alpha@ecov.test"
    },
    {
      "id": 2,
      "factoryName": "مصنع بيتا",
      "status": "Active",
      "email": "beta@ecov.test"
    },
    {
      "id": 3,
      "factoryName": "مصنع جاما",
      "status": "Active",
      "email": "gamma@ecov.test"
    }
  ]
}
```

---

### 🟢 Test 2: Create Waste Asset (Factory A Lists Waste)

**Endpoint**: `POST /api/waste-assets/create`

**Request Body**:
```json
{
  "wasteTypeId": 1,
  "quantity": 500,
  "unit": "kg",
  "qualityNotes": "Clean, dry, sorted plastic waste from beverage bottles",
  "isReusable": true,
  "maxReuseCount": 3
}
```

**Expected Response** (Status: 201 Created):
```json
{
  "success": true,
  "message": "Waste asset created successfully",
  "data": {
    "id": 1001,
    "status": 0,
    "generatorFactoryId": 1,
    "quantity": 500,
    "unit": "kg",
    "wasteTypeId": 1,
    "estimatedCO2EquivalentIfLandfilled": 1250.00,
    "isReusable": true,
    "maxReuseCount": 3,
    "currentReuseNumber": 0,
    "qualityNotes": "Clean, dry, sorted plastic waste from beverage bottles",
    "createdAt": "2026-04-10T12:30:00Z"
  }
}
```

**✅ Success Criteria**:
- Status 201 received
- CO2 calculated automatically: 500 kg × 2.5 = 1250 kg CO2e
- Status = 0 (Generated)

---

### 🔵 Test 3: Search Marketplace (Factory B finds waste)

**Endpoint**: `GET /api/waste-assets/marketplace/search?category=PackagingPlastic&page=1`

**Expected Response**:
```json
{
  "success": true,
  "message": "Search results",
  "data": [
    {
      "id": 1001,
      "wasteTypeId": 1,
      "quantity": 500,
      "unit": "kg",
      "estimatedCO2EquivalentIfLandfilled": 1250.00,
      "views": 1,
      "status": 0
    }
  ]
}
```

**✅ Success Criteria**: 
- Waste asset visible in marketplace
- Views counter incremented

---

### 🟣 Test 4: Create Purchase Offer (Factory B Makes Offer) 
### ✅ REVENUE POINT #1 TRIGGERS WHEN ACCEPTED

**Endpoint**: `POST /api/waste-offers/create`

**Request Body**:
```json
{
  "wasteAssetId": 1001,
  "offeredQuantity": 500,
  "offeredPricePerUnit": 2.5,
  "intendedUseType": "Recycling"
}
```

**Expected Response** (Status: 201 Created):
```json
{
  "success": true,
  "message": "Offer created successfully",
  "data": {
    "id": 500,
    "wasteAssetId": 1001,
    "buyerFactoryId": 2,
    "offerNumber": "OFF-20260410-A7K9M",
    "offeredQuantity": 500,
    "offeredPricePerUnit": 2.5,
    "totalOfferedPrice": 1250.00,
    "status": 0,
    "createdAt": "2026-04-10T12:35:00Z"
  }
}
```

**✅ Success Criteria**:
- Offer created with unique number
- Total price calculated: 500 × 2.5 = 1250 EGP
- Status = 0 (Pending)
- WasteAsset status changed to Reserved

---

### 💰 Test 5: Accept Offer (Seller Says Yes)
### ✅ **REVENUE POINT #1 MONEY FLOWS: 5% commission = 62.50 EGP**

**Endpoint**: `POST /api/waste-offers/500/accept`

**Expected Response**:
```json
{
  "success": true,
  "message": "Offer accepted - waste transferred to buyer",
  "data": {
    "id": 500,
    "status": 1,
    "acceptedAt": "2026-04-10T12:40:00Z",
    "totalOfferedPrice": 1250.00,
    "commission": 62.50,
    "commissionPercentage": 5.0
  }
}
```

**🎯 REVENUE LOGGED**:
```
Factory A (Seller): +1250 EGP
Factory B (Buyer): -1250 EGP
ECOV Platform: +62.50 EGP ✅ [REVENUE POINT #1]
```

**Database Changes**:
- WasteAsset status → 3 (Sold_OrderCreated)
- WasteJourneyEntry added: Status transition recorded
- Commission logged in sales record

---

### 📦 Test 6: Get Waste Journey (Check Immutable History)

**Endpoint**: `GET /api/waste-assets/1001/journey`

**Expected Response**:
```json
{
  "success": true,
  "message": "Waste journey retrieved",
  "data": [
    {
      "id": 1,
      "wasteAssetId": 1001,
      "status": 0,
      "timestamp": "2026-04-10T12:30:00Z",
      "responsibleFactory": "مصنع ألفا",
      "notes": "Waste generated and entered system"
    },
    {
      "id": 2,
      "wasteAssetId": 1001,
      "status": 3,
      "timestamp": "2026-04-10T12:40:00Z",
      "responsibleFactory": "مصنع بيتا",
      "notes": "Offer OFF-20260410-A7K9M accepted. Waste sold from Factory A to Factory B"
    }
  ]
}
```

**✅ Success Criteria**:
- Complete immutable chain of ownership
- Timestamps in order
- Entries cannot be modified (write-once)

---

### 🚚 Test 7: Send to Recycler (Factory B sends waste for processing)
### ✅ REVENUE POINT #2 BEGINS: 10% commission on recycling fee

**Endpoint**: `POST /api/recycling-orders/send-to-recycler`

**Request Body**:
```json
{
  "wasteAssetId": 1001,
  "recyclerId": 1
}
```

**Expected Response** (Status: 201 Created):
```json
{
  "success": true,
  "message": "Waste sent to recycler for processing",
  "data": {
    "id": 101,
    "wasteAssetId": 1001,
    "recyclerId": 1,
    "orderedByFactoryId": 2,
    "orderNumber": "REC-20260410-B3M2K",
    "status": 0,
    "quantityToProcess": 500,
    "unit": "kg",
    "createdAt": "2026-04-10T12:45:00Z"
  }
}
```

**Database Changes**:
- WasteRecyclingOrder created
- WasteAsset status → 7 (Processing)
- New journey entry added

---

### ♻️ Test 8: Complete Recycling (Recycler Finishes Processing)
### ✅ REVENUE POINT #2 MONEY FLOWS: 10% of recycling fee
### ✅ REVENUE POINT #3 PREPARED: New waste asset created from output

**Endpoint**: `POST /api/recycling-orders/101/complete`

**Request Body**:
```json
{
  "processMethodUsed": "Mechanical",
  "actualEfficiencyPercent": 88,
  "outputMaterialType": "Plastic Pellets",
  "outputQuantity": 420,
  "outputUnit": "kg",
  "beforePhoto": "https://example.com/before.jpg",
  "afterPhoto": "https://example.com/after.jpg"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Recycling completed - secondary material now available for sale",
  "data": {
    "id": 101,
    "status": 3,
    "processingCompletedAt": "2026-04-10T12:50:00Z",
    "processMethodUsed": "Mechanical",
    "actualEfficiencyPercent": 88,
    "outputMaterialType": "Plastic Pellets",
    "outputQuantity": 420,
    "impactRecord": {
      "id": 200,
      "wasteAssetId": 1001,
      "co2EquivalentKgIfLandfilled": 1250.00,
      "co2KgAvoided": 934.00,
      "methaneEmissionAvoided": 312.50,
      "landfillSpaceM3Saved": 2.50,
      "energyRecoveredKWh": 1050.00,
      "jobsCreatedInRecycling": 0.02,
      "productionCostSavedUsd": 63.00,
      "revenueFromRecycledMaterialUsd": 105.00,
      "certificateNumber": "CERT-20260410-A1B2C3D4",
      "certificateIssuedAt": "2026-04-10T12:50:00Z",
      "isVerified": true,
      "efficiencyScore": 74.8
    }
  }
}
```

**🎯 ENVIRONMENTAL IMPACT CALCULATED** (Automatic):
```
CO2 Baseline if Landfilled:  1250 kg CO2e
Process Type:                 Mechanical (85% efficiency)
Actual Efficiency:            88% (from recycler)
Combined Efficiency:          74.8%
CO2 AVOIDED:                  ✅ 934 kg CO2e
Methane Avoided:              312.5 kg
Landfill Space Saved:         2.5 m³
Energy Recovered:             1050 kWh (5.4 barrels oil equivalent)
Jobs Created:                 0.02 (1 job per 25 tons)
Production Cost Saved:        $63 (vs virgin material)
Revenue from pellets:         $105
```

**🎯 REVENUE POINT #2 MONEY FLOWS**:
```
Assume Recycler Fee: 500 EGP
ECOV Commission (10%): 50 EGP ✅ [REVENUE POINT #2]
```

**Database Changes**:
- WasteRecyclingOrder completed
- EnvironmentalImpactRecord created with 25 metrics
- WasteAsset status → 8 (Recycled)
- NEW WasteAsset created (ID: 1002) with 420 kg plastic pellets
- New WasteAsset automatically listed (IsPublic = true)

---

### 🌍 Test 9: View Environmental Impact (Factory Impact Summary)

**Endpoint**: `GET /api/impact-reports/factory/impact-summary`

**Expected Response**:
```json
{
  "success": true,
  "message": "Environmental impact summary",
  "data": {
    "factoryId": 1,
    "totalCO2Avoided": 934.00,
    "totalLandfillSpaceSaved": 2.50,
    "wasteProcessed": 420.00,
    "certificatesGenerated": 1
  }
}
```

---

### 📊 Test 10: View Platform-Wide Impact (Data Licensing Revenue)
### ✅ REVENUE POINT #5 DATA: Available for Government/NGO licensing

**Endpoint**: `GET /api/impact-reports/platform/statistics?fromDate=2026-01-01&toDate=2026-12-31`

**⚠️ NOTE: No authentication required!** (Public endpoint for data licensing)

**Expected Response**:
```json
{
  "success": true,
  "message": "Platform environmental impact statistics",
  "data": {
    "totalCO2Avoided": 934.00,
    "totalLandfillSpaceSaved": 2.50,
    "totalWasteProcessed": 500.00,
    "transactionsCompleted": 1
  }
}
```

**💰 This data is valuable because it can be licensed to**:
- Egyptian Ministry of Environment
- International NGOs (UN, Global Compact, etc.)
- ESG rating agencies (MSCI, Sustainalytics, Bloomberg)
- Governments for carbon credit programs

**Annual Licensing Revenue Potential**: 50,000 - 100,000 EGP

---

### 💼 Test 11: Get Commission Report (Factory Earnings)

**Endpoint**: `GET /api/impact-reports/factory/commission-report?fromDate=2026-04-01&toDate=2026-04-30`

**Expected Response**:
```json
{
  "success": true,
  "message": "Commission report",
  "data": {
    "factoryId": 2,
    "salesCommission": 62.50,
    "recyclingCommission": 50.00,
    "totalCommission": 112.50,
    "periodStart": "2026-04-01",
    "periodEnd": "2026-04-30"
  }
}
```

**✅ Success Criteria**:
- Sales commission tracked (5% of sale price)
- Recycling commission tracked (10% of processing fee)
- Accurate period filtering

---

### 💸 Test 12: REVENUE POINT #3 - Secondary Material Sales

**Assuming recycled plastic pellets are now sold**:

1. **New Waste Asset Created** (Plastic Pellets from recycling)
   - ID: 1002
   - Quantity: 420 kg
   - Type: Already recycled
   - Status: Available
   - IsPublic: true

2. **Factory C Makes Offer for Plastic Pellets**
   ```
   POST /api/waste-offers/create
   {
     "wasteAssetId": 1002,
     "offeredQuantity": 420,
     "offeredPricePerUnit": 3.5,
     "intendedUseType": "DirectReuse"
   }
   ```

3. **Seller (Recycler) Accepts**
   ```
   POST /api/waste-offers/{offerId}/accept
   ```

4. **✅ REVENUE POINT #3 FLOWS**:
   ```
   Sale Price: 420 × 3.5 = 1470 EGP
   Commission (7%): 102.90 EGP ✅ [REVENUE POINT #3]
   ```

---

## 📈 Complete Revenue Summary After These Tests

```
┌──────────────────────────────────────────────────────────────┐
│              ECOV REVENUE SUMMARY (Single Cycle)             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  REVENUE POINT #1 (Marketplace - First Sale)                │
│    Sale: 1250 EGP                                           │
│    Commission (5%): 62.50 EGP ✅                            │
│                                                              │
│  REVENUE POINT #2 (Recycler Processing)                     │
│    Recycling Fee: 500 EGP                                   │
│    Commission (10%): 50.00 EGP ✅                           │
│                                                              │
│  REVENUE POINT #3 (Secondary Material - Pellets)            │
│    Secondary Sale: 1470 EGP                                 │
│    Commission (7%): 102.90 EGP ✅                           │
│                                                              │
│  REVENUE POINT #5 (Data Licensing)                          │
│    Platform Data Available: YES ✅                          │
│    Potential Annual Value: 50,000-100,000 EGP               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  TOTAL PLATFORM REVENUE (This Cycle): 215.40 EGP            │
│  ENVIRONMENTAL IMPACT: 934 kg CO2 Avoided                   │
│  JOBS CREATED: 0.02 (scales with volume)                    │
│                                                              │
│  PROJECTED YEAR 1 (1000 trans/month):                       │
│    Revenue: 1,766,000 EGP                                   │
│    CO2 Avoided: 15.4M kg                                    │
│    Jobs Created: 300+                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting During Testing

### Issue: "Unauthorized" (401)
**Solution**: Get JWT token from `/api/auth/login` and add to Authorize header

### Issue: "Waste asset not found"
**Solution**: Create waste asset first, get the ID, use that ID in subsequent calls

### Issue: "Cannot send to recycler that doesn't exist"
**Solution**: Recycler ID must be 1-3 (from seeded data)

### Issue: "Invalid efficiency percentage"
**Solution**: actualEfficiencyPercent must be between 0-100

### Issue: Database lock
**Solution**:
```powershell
# Restart API and database
dotnet ef database drop
dotnet ef database update
```

---

## ✅ All Tests Passed Checklist

- [ ] Authentication works (token received)
- [ ] Waste asset created (ID assigned)
- [ ] Waste searchable in marketplace
- [ ] Offer created (with correct total price)
- [ ] Offer accepted (commission calculated)
- [ ] Waste journey shows all entries
- [ ] Sent to recycler successfully
- [ ] Recycling completed (impact calculated)
- [ ] Environmental impact recorded
- [ ] Platform statistics accessible
- [ ] Commission report accurate
- [ ] Secondary waste asset created

---

**When all tests pass, your circular economy platform is LIVE! 🚀**
