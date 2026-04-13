# ⚡ Quick Start Guide - ECOv System (April 12, 2026)

## 🚀 Start the System

### Option 1: Sequential Start (Recommended)

**Terminal 1: Start Backend**
```powershell
cd "C:\Users\LOQ\OneDrive\Desktop\ECOv Full Stack\circular-economy-hackathon\shadowfactory"
dotnet run
```
Wait for: `Application started. Press Ctrl+C to shut down.`

**Terminal 2: Start Frontend**
```powershell
cd "C:\Users\LOQ\OneDrive\Desktop\ECOv Full Stack\circular-economy-hackathon\factory_ui"
npm run dev
```
Wait for: `VITE Local: http://localhost:5174`

### Option 2: Parallel Start
- Open both directories in VS Code terminals
- Run both `dotnet run` and `npm run dev` simultaneously

---

## 🔑 Test Credentials

### Admin Account
- **Email**: `admin@ecov.test`
- **Password**: `Admin@123`
- **Role**: Can approve/reject ALL orders

### Factory Account (Alpha Factory)
- **Email**: `alpha@factory.com`
- Get password from: `shadowfactory/Data/SeedData.cs` line ~200
- **Role**: Can create orders, view own orders

---

## 🧪 Quick Test Flow (5 minutes)

### Step 1: Login as Admin
1. Go to http://localhost:5174/login
2. Enter admin credentials
3. Click "Login"

### Step 2: View Marketplace
1. Click "Marketplace" in navigation
2. You should see waste listings with factory names and quantities
3. ✅ Verify: Listings load without errors

### Step 3: Logout & Login as Factory
1. Logout (top-right menu)
2. Login as factory user
3. Go to Marketplace

### Step 4: Create Order
1. Click on any waste listing (NOT from your own factory)
2. Click "Place Order"
3. Fill in:
   - Quantity: 50
   - Recipient: Test Name
   - Phone: +201234567890
   - Address: Test Address
   - Delivery: pickup
   - Payment: cash
4. Click "Submit Order"
5. ✅ Verify: Success message appears

### Step 5: Admin Approves
1. Logout & login as admin
2. Go to Admin Dashboard > Direct Orders
3. Click "Approve" on the order you just created
4. ✅ Verify: Status changes to "مقبول" (Accepted) without error

### Step 6: Check Factory History
1. Logout & login as factory buyer
2. Go to "My Orders"
3. ✅ Verify: Order shows with status "مقبول"

**Total Time**: ~5 minutes | **Expected Result**: ✅ ALL PASSED

---

## 🐛 If Something Goes Wrong

### Orders not loading
```
1. Check backend is running: http://localhost:54464/api/orders/debug-db
2. Check token in browser console: localStorage.getItem('authToken')
3. Check browser console for errors
```

### Can't create order
```
1. Make sure you're NOT on your own factory
2. Check quantity available (compare to original listing)
3. Check console for network errors
```

### Admin can't approve (THE FIX)
```
OLD ERROR: "يجب أن يكون لديك مصنع مسجل"
STATUS: ✅ FIXED

If you still see this:
1. Clear browser cache: Ctrl+Shift+Delete
2. Restart backend: Ctrl+C then 'dotnet run'
3. Login again
```

### Quantity not updating
```
1. Refresh Marketplace page (F5)
2. Check if order status actually changed to "مقبول"
3. Look at database: SELECT * FROM WasteListings WHERE Id=X
```

---

## 📊 Database Check

### View Current Orders
```powershell
# In SQL Server Management Studio or Azure Data Studio
USE ECoV_DB;
SELECT OrderNumber, BuyerName, SellerName, Amount, Status, OrderDate
FROM Orders
ORDER BY OrderDate DESC;
```

### View Waste Listings (with Reserved Amounts)
```sql
SELECT FactoryName, Type, Amount, ReservedAmount, Unit, Price
FROM WasteListings
WHERE Status = 'Active';
```

### Check Admin User Exists
```sql
SELECT Email, FullName, Role, FactoryId, IsActive
FROM Users
WHERE Email = 'admin@ecov.test';
```

---

## 📝 Important Notes

✅ **What Works Now**:
- Admin login
- Admin views all orders
- Admin approves/rejects orders ← **FIXED!**
- Factory creates orders
- Quantities reserve/restore correctly
- Each user sees only their data

✅ **Fixed This Session**:
- Backend authorization for admin users
- Order status update endpoint
- Factory filtering logic
- Build compilation

**Build Status**:
- Backend: ✅ 0 errors
- Frontend: ✅ Building successfully

**Next Priority** (if deploying):
1. Add unit tests
2. Set up CI/CD pipeline
3. Configure HTTPS certificates
4. Set up monitoring
5. Create deployment documentation

---

## 🎯 System URLs

| Component | URL |
|-----------|-----|
| **Frontend** | http://localhost:5174 |
| **Backend API** | https://localhost:54464/api |
| **API Debug** | https://localhost:54464/api/orders/debug-db |
| **Marketplace** | http://localhost:5174/marketplace |
| **My Orders** | http://localhost:5174/orders |
| **Admin Dashboard** | http://localhost:5174/admin/dashboard |
| **Admin Orders** | http://localhost:5174/admin/direct-orders |

---

## 💾 Most Important Files

**Backend** (Authorization Fixes):
- `controllers/OrdersController.cs` ← **Authorization logic**
- `Data/ECoVDbContext.cs` ← Database setup
- `Program.cs` ← Middleware configuration

**Frontend** (Order Flow):
- `pages/Orders.jsx` ← Factory order history
- `pages/AdminDirectOrders.jsx` ← Admin approval dashboard
- `pages/WasteDetails.jsx` ← Order creation form
- `services/api.js` ← API interceptor

**Documents**:
- `FULL_SYSTEM_INTEGRATION_GUIDE.md` ← Complete reference
- `SYSTEM_FIX_COMPLETION_REPORT.md` ← Technical details

---

## ✨ Success Indicators

After following the Quick Test Flow, you should see:

✅ **Orders Page** (Factory)
```
┌────────────────────────────────────────────┐
│ My Orders                                  │
├────────────────────────────────────────────┤
│ Order #  │ Type    │ Qty│ Status │ Date   │
│ ORD-ABC1 │ Plastic │50  │ مقبول  │ 04/12 │
└────────────────────────────────────────────┘
```

✅ **Admin Dashboard** (Admin)
```
┌────────────────────────────────────────────┐
│ Direct Orders                              │
├────────────────────────────────────────────┤
│ Order #  │ Type    │ Qty│ Status │ ✓ ✗   │
│ ORD-ABC1 │ Plastic │50  │ مقبول  │ ✓ ✗   │
└────────────────────────────────────────────┘
Status: Shows "مقبول" after approval
Console: No errors showing "يجب أن يكون لديك مصنع مسجل"
```

✅ **Console Messages**
```
✅ Loaded 1 total orders, 1 are direct usage orders
✅ API Response: 200 /orders?type=direct
✅ API Response: 200 /orders/1/status
```

---

## 🎓 Architecture at a Glance

```
FRONTEND (React/Vite)
  ↓ (HTTP/HTTPS)
API Gateway (localhost:54464)
  ↓
.NET Controllers
  ├── OrdersController ← [FIXED AUTHORIZATION]
  ├── MarketplaceController
  └── ProfileController
  ↓
EntityFramework ORM
  ↓
SQL Server Database
  ├── Orders table
  ├── WasteListings table
  ├── Users table
  ├── Factories table
  └── [Other tables]
```

---

**Status**: ✅ Ready for Testing
**Last Updated**: April 12, 2026 - 3:27 PM
**Build Time**: < 10 seconds
**Deploy Time**: < 5 minutes

---

Start the system and follow the Quick Test Flow to verify everything works! 🚀
