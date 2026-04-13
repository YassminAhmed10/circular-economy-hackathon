# Frontend-Backend Integration Guide

## 🔗 Overview

This document outlines how the React frontend (factory_ui) integrates with the .NET backend (shadowfactory) for the marketplace, payment, and recycler workflows.

**Status**: ✅ **INTEGRATION COMPLETE**

---

## 📡 API Service Layer

### Location: `factory_ui/src/services/circularEconomyApi.js`

This is the main API client that handles all communication with the backend. It uses Axios with interceptors for:
- Automatic JWT token injection from localStorage
- Error handling and 401 redirects
- Request/response logging

#### Key API Functions Added:

**Marketplace Orders**
```javascript
// Create a new order when buyer purchases waste
createMarketplaceOrder(orderData)
  ├─ wasteListingId: source waste listing
  ├─ buyerId: factory making purchase
  ├─ sellerId: factory selling waste
  ├─ quantity: amount being purchased
  └─ usageType: 'Direct' or 'Recycling'

// Get all orders for a factory
getFactoryOrders(factoryId, role)
  └─ role: 'buyer', 'seller', or 'all'

// Get order with payment details
getOrderWithPayments(orderId)
```

**Payments**
```javascript
// Process a pending payment
processPayment(paymentId, paymentData)
  └─ paymentData: { paymentMethod, transactionReference, notes }

// Get pending payments for factory
getPendingPayments(factoryId, role)
  └─ role: 'payer', 'payee', or 'both'

// Get financial summary
getPaymentSummary(factoryId)
  └─ Returns: totalReceivable, totalPayable, totalPaid, etc.
```

**Recycler Integration**
```javascript
// Request recycler for an order
requestRecycler(orderId, recyclerData)
  └─ recyclerData: { recyclerId, processingFee, specialInstructions }

// Get suitable recyclers for order
getSuitableRecyclers(orderId)

// Recycler job management
getRecyclerJobs(recyclerId, status)
acceptRecyclingJob(recyclingOrderId)
rejectRecyclingJob(recyclingOrderId, reason)
completeRecyclingJob(recyclingOrderId, completeData)

// Performance metrics
getRecyclerMetrics(recyclerId)
```

---

## 🎨 Updated Frontend Pages

### 1. **Marketplace.jsx** - Browse & Purchase Waste

**Purpose**: Displays available waste listings and handles order creation

**Key Features**:
- ✅ List waste listings from database
- ✅ Search and filter by waste type, status, price
- ✅ Bid modal with usage type selection (Direct or Recycler)
- ✅ Create marketplace order on bid submission
- ✅ Request recycler if selected

**Data Flow**:
```
User browses → Selects waste → Opens bid modal
    ↓
Chooses usage type: Direct or Send to Recycler
    ↓
If Direct: Create order → Success
If Recycler: 
  - Create order
  - Request recycler (optional)
  - Success
```

**Import Changes**:
```javascript
import { 
    createMarketplaceOrder, 
    requestRecycler,
    getSuitableRecyclers 
} from '../services/circularEconomyApi'
```

**Key Handler**:
```javascript
const handleBidSubmit = async (asset, bidData) => {
    // 1. Create marketplace order
    const orderRes = await createMarketplaceOrder(orderData)
    
    // 2. If recycler selected, request recycler
    if (bidData.usageType === 'sendToRecycler' && bidData.selectedRecycler) {
        await requestRecycler(orderId, {
            recyclerId: bidData.selectedRecycler,
            processingFee: bidData.offeredPrice * 0.1,
            specialInstructions: bidData.notes
        })
    }
}
```

---

### 2. **Orders.jsx** - Manage Purchases & Sales

**Purpose**: View all orders (as buyer or seller) and access order details

**Key Features**:
- ✅ Load real orders from database
- ✅ Display stats: total, completed, pending, revenue
- ✅ Filter by status
- ✅ View order details modal with payment breakdown
- ✅ Loading/error states

**Data Flow**:
```
Component mounts
    ↓
Fetch orders for logged-in factory (via getFactoryOrders)
    ↓
Display in table with status badges
    ↓
User clicks "Details" → Load full order with payments
```

**Import Changes**:
```javascript
import { 
    getFactoryOrders, 
    getOrderWithPayments, 
    updateOrderStatus 
} from '../services/circularEconomyApi'
```

**Live Data**:
- `orders.length` → total order count
- `orders.filter(o => o.orderStatus === 'Completed')` → completed count
- `orders.reduce((sum, o) => sum + o.totalPrice)` → revenue calculation

---

### 3. **Payment.jsx** - Process Payments

**Purpose**: View pending payments and process payment submissions

**Key Features**:
- ✅ Display payment summary (receivable, payable, paid)
- ✅ List pending payments with filters
- ✅ Process payment form with method selection
- ✅ Loading/error handling
- ✅ Bilingual UI (Arabic/English)

**Data Flow**:
```
Component mounts
    ↓
Fetch pending payments + summary (for factory)
    ↓
Display summary cards + payment table
    ↓
User clicks "Process Payment"
    ↓
Modal opens → Select method → Submit
    ↓
Call processPayment API → Reload data
```

**Import Changes**:
```javascript
import { 
    getPendingPayments, 
    processPayment, 
    getPaymentSummary,
    getOutstandingBalance 
} from '../services/circularEconomyApi'
```

**Key Calculations**:
- **Receivable**: Money owed TO this factory (from orders they sold)
- **Payable**: Money owed BY this factory (from orders they bought)
- **Paid**: Already processed payments
- **Pending**: Awaiting processing

---

### 4. **RecyclingOrders.jsx** - Recycler Job Management

**Purpose**: Recyclers manage their recycling jobs and track metrics

**Key Features**:
- ✅ List recycling jobs with status filtering
- ✅ Performance metrics dashboard (processed, efficiency, CO2 saved)
- ✅ Accept/Reject job workflow
- ✅ Complete job form with output details
- ✅ Real-time metrics updates

**Data Flow**:
```
Recycler logs in
    ↓
Fetch jobs for this recycler (via getRecyclerJobs)
    ↓
Display job list with action buttons based on status
    ↓
Pending → Accept/Reject buttons
Accepted/Processing → Complete job button
Details button → Shows full job info

User accepts job
    ↓
Call acceptRecyclingJob → Status → Accepted
    ↓
User completes job
    ↓
Call completeRecyclingJob → Auto-calculates efficiency
    ↓
Reload metrics
```

**Import Changes**:
```javascript
import { 
    getRecyclerJobs, 
    acceptRecyclingJob, 
    rejectRecyclingJob, 
    completeRecyclingJob,
    getRecyclerMetrics 
} from '../services/circularEconomyApi'
```

**Job Status Lifecycle**:
```
Pending (awaiting recycler)
    ↓
Accepted (recycler confirmed)
    ↓
Processing (work in progress)
    ↓
Completed (done, efficiency calculated)

Alternative: Rejected (recycler declined)
```

---

## 🔄 Complete User Workflows

### Workflow 1: Simple Marketplace Purchase (No Recycler)

```
┌─ BUYER ──────────────────────────┐
│ 1. Browse marketplace            │
│    → Load waste listings         │
│ 2. Select waste & click bid      │
│    → Open bid modal              │
│ 3. Enable "Direct Use"           │
│    → Create order (POST)         │
│ 4. View in Orders page           │
│    → GET factory orders          │
│ 5. Make payment                  │
│    → View pending payments       │
│    → Process payment (POST)      │
└──────────────────────────────────┘

┌─ SELLER ────────────────────────┐
│ 1. See order in Orders page     │
│    → GET factory orders         │
│ 2. View order details           │
│    → GET order with payments    │
│ 3. Receives payment             │
│    → Payment marked as Paid     │
└─────────────────────────────────┘

Order Status Flow:
Pending → Confirmed → Completed
```

### Workflow 2: Marketplace Purchase with Recycler

```
┌─ BUYER ──────────────────────────┐
│ 1. Browse marketplace            │
│    → Load waste listings         │
│ 2. Select waste & click bid      │
│    → Open bid modal              │
│ 3. Enable "Send to Recycler"     │
│    → Select recycler from list   │
│ 4. Submit bid                    │
│    → Create order (POST)         │
│    → Request recycler (POST)     │
│ 5. Make payments (2 total)       │
│    → Buyer → Seller payment      │
│    → Buyer → Recycler fee        │
└──────────────────────────────────┘

┌─ RECYCLER ───────────────────────┐
│ 1. See job in RecyclingOrders    │
│    → GET recycler jobs (pending) │
│ 2. Accept or reject job          │
│    → PUT accept job or reject    │
│ 3. Log processing start          │
│ 4. Complete job w/ metrics       │
│    → POST complete job           │
│    → Auto-calculates efficiency  │
│ 5. View metrics dashboard        │
│    → GET recycler metrics        │
└──────────────────────────────────┘

Order Status Flow:
Pending → Confirmed → Sent to Recycler → Completed

Recycler Status Flow:
Requested → Accepted → Processing → Completed
```

### Workflow 3: Payment Management

```
┌─ FACTORY (ANY ROLE) ─────────────┐
│ 1. View Payment dashboard        │
│    → GET pending payments        │
│    → GET payment summary         │
│ 2. See all pending items         │
│    - Order payments (owed)       │
│    - Recycler fees (owed)        │
│ 3. Process each payment          │
│    → POST process payment        │
│    → Provide method + reference  │
│ 4. Payment marked as Paid        │
│ 5. Metrics update automatically  │
│    - Total paid increases        │
│    - Balance decreases           │
└──────────────────────────────────┘

Payment Types:
├─ OrderPayment: Buyer pays seller
└─ RecyclerFee: Buyer pays recycler

Filter Options:
├─ All: Show everything
├─ Payable: Money I owe
└─ Receivable: Money owed to me
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           React Frontend (factory_ui)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Marketplace.jsx → Orders.jsx → Payment.jsx       │
│       ↓              ↓              ↓              │
│ [Waste Listings] [Order List]  [Payments]         │
│       ↓              ↓              ↓              │
│  RecyclingOrders.jsx                              │
│       ↓                                            │
│  [Recycler Jobs]                                  │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │ axios HTTP
                   ↓
┌─────────────────────────────────────────────────────┐
│      circularEconomyApi.js (Axios Client)          │
│                                                     │
│ ├─ /orders (marketplace orders)                   │
│ ├─ /payments (payment operations)                 │
│ ├─ /recycler/jobs (recycler workflow)             │
│ ├─ JWT interceptor (token injection)              │
│ └─ Error handling (401, network errors)           │
│                                                     │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────┐
│   .NET Backend (shadowfactory @ localhost:54464)   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Controllers:                                      │
│  ├─ OrdersController                              │
│  │  └─ POST /orders (create)                      │
│  │  └─ GET /orders/factory/{id}                   │
│  │  └─ GET /orders/{id}/with-payments             │
│  │  └─ POST /orders/{id}/request-recycler         │
│  │                                                │
│  ├─ PaymentsController                            │
│  │  └─ POST /payments/{id}/process                │
│  │  └─ GET /payments/pending/{factoryId}          │
│  │  └─ GET /payments/summary/{factoryId}          │
│  │                                                │
│  └─ RecyclerOrdersController (or extend above)    │
│     └─ GET /recycler/{id}/jobs                    │
│     └─ POST /recycler/jobs/{id}/accept            │
│     └─ POST /recycler/jobs/{id}/complete          │
│     └─ GET /recycler/{id}/metrics                 │
│                                                     │
│  Services:                                         │
│  ├─ OrderService (business logic)                 │
│  ├─ PaymentService (payment processing)           │
│  └─ RecyclerIntegrationService (recycler ops)     │
│                                                     │
│  Database (SQL Server):                            │
│  ├─ Orders                                        │
│  ├─ OrderPayments                                 │
│  ├─ WasteRecyclingOrders                          │
│  └─ All related tables                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Key Data Models

### OrderDto (API Response)
```javascript
{
    id: 1,
    orderNumber: "ORD-001",
    quantity: 100,
    unit: "kg",
    totalPrice: 5000,
    orderStatus: "Pending",        // NEW
    paymentStatus: "Pending",      // NEW
    recyclerStatus: "None",        // NEW
    orderDate: "2026-04-10T10:00:00Z",
    payments: [                    // NEW
        {
            id: 1,
            paymentType: "OrderPayment",
            amount: 5000,
            status: "Pending"
        }
    ]
}
```

### PaymentDto (API Response)
```javascript
{
    id: 1,
    orderId: 1,
    paymentType: "OrderPayment",   // or "RecyclerFee"
    amount: 5000,
    status: "Pending",             // or "Paid", "Failed", "Refunded"
    payerFactoryId: 2,
    payeeFactoryId: 1,
    createdAt: "2026-04-10T10:00:00Z"
}
```

### RecyclerMetricsDto (API Response)
```javascript
{
    recyclerId: 3,
    recyclerName: "EcoRecycle Corp",
    totalOrdersProcessed: 25,
    averageEfficiencyPercent: 85.5,
    estimatedCO2Avoided: 12500,    // kg
    rating: 4.8
}
```

---

## 🚀 How to Test

### 1. **Test Marketplace → Orders**
```
1. Login as Factory A (Buyer)
2. Go to Marketplace
3. Browse waste listings
4. Click "Place Bid" on any waste
5. Fill form: quantity, price, usage type, recycler (if selected)
6. Submit bid → Order created
7. Go to Orders page
8. See new order in list with status "Pending"
9. Click "Details" to view payments
```

### 2. **Test Payments**
```
1. Go to Payment dashboard
2. See summary cards with totals
3. Scroll to pending payments table
4. See orders you owe payment for
5. Click "Process Payment"
6. Select payment method (card/bank/cash)
7. Enter transaction reference
8. Submit → Payment marked "Paid"
9. Metrics update immediately
```

### 3. **Test Recycler Workflow**
```
1. Login as Factory B (Recycler)
2. Go to RecyclingOrders
3. See pending jobs (from orders sent to recycler)
4. See performance metrics dashboard
5. For pending job: Click "Accept" → Status becomes "Accepted"
6. Later: Click "Complete" → Fill output details
7. Submit → Job marked "Completed", metrics recalculate
8. See updated CO2 avoided, efficiency %, processed count
```

---

## 🐛 Common Issues & Solutions

### Issue: "API returns 404 Not Found"
**Cause**: Endpoint not implemented on backend
**Solution**: Check that controller action exists and is named correctly

### Issue: "Token missing" or "401 Unauthorized"
**Cause**: JWT token not in localStorage or expired
**Solution**: 
- Ensure user is logged in
- Token is stored in localStorage during login
- Interceptor in circularEconomyApi injects it automatically

### Issue: "Payment fails silently"
**Cause**: Payment ID doesn't match payment record
**Solution**: 
- Verify paymentId parameter
- Check that payment exists and status is "Pending"
- Look at browser console for error details

### Issue: "Recycler jobs not showing"
**Cause**: Recycler ID or factory ID mismatch
**Solution**:
- Verify user is logged in as recycler
- Check factory ID in user object
- Ensure jobs are assigned to this recycler ID

---

## 📋 Checklist for Production

- [ ] All API endpoints implemented on backend
- [ ] JWT tokens working correctly
- [ ] Database migrations applied
- [ ] CORS enabled for frontend domain
- [ ] Error messages are user-friendly
- [ ] Loading spinners show during API calls
- [ ] Modal forms prevent double-submission
- [ ] Payment processing is transactional
- [ ] Recycler metrics recalculate correctly
- [ ] Order status transitions make sense
- [ ] Arabic/English translations complete
- [ ] Mobile responsive design tested

---

## 📞 Support

For integration issues:
1. Check browser console for error messages
2. Check backend logs (Debug/Release output)
3. Verify API endpoint URLs match
4. Ensure JWT token is present and valid
5. Test individual endpoints with Postman first

---

**Last Updated**: April 10, 2026  
**Frontend Version**: React 19.2.4 with Vite  
**Backend Version**: .NET 8 with EF Core  
**Database**: SQL Server
