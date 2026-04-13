# ECOv Platform: Marketplace Refactoring & Enhancement

## 🎯 Objective
Transform the ECOv marketplace from a simple buy/sell system into a semi-circular workflow where waste can be purchased and optionally processed by recyclers, with integrated payment handling.

---

## 📋 Architecture Overview

### Core Principles
- ✅ **Backward Compatibility**: Existing functionality preserved
- ✅ **Clean Separation of Concerns**: Services, Controllers, DTOs organized logically
- ✅ **Extensible Design**: Easy to add new payment methods or recycler workflows
- ✅ **Quality Tracking**: Environmental impact and efficiency metrics built-in

### System Flow

```
┌─────────────────┐
│ Factory Browser │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Browse WasteListings           │
│  (Category, Location, Price)    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  CREATE ORDER (Buyer ➜ Seller)  │
│  - OrderPayment created         │
│  - Buyer pays seller            │
└────────┬────────────────────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
    ┌─────────┐         ┌──────────────────┐
    │ Complete │         │ Send to Recycler │
    │ (End)   │         └────────┬─────────┘
    └─────────┘                  │
                                 ▼
                    ┌────────────────────────┐
                    │ Recycler Services      │
                    │ - Accept/Reject        │
                    │ - Process              │
                    │ - RecyclerPayment      │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │ Complete Processing    │
                    │ - Output materials     │
                    │ - Efficiency % tracked │
                    │ - CO2 avoided logged   │
                    └────────────────────────┘
```

---

## 📦 Database Schema Changes

### 1. **Extended Order Table**
New columns added:
```sql
OrderStatus         VARCHAR(50)    -- Pending, Confirmed, In Progress, Sent to Recycler, Completed
PaymentStatus       VARCHAR(50)    -- Pending, Paid, Failed
RecyclerStatus      VARCHAR(50)    -- None, Requested, Accepted, Processing, Completed, Rejected
TotalPrice          DECIMAL(18,2)  -- Computed: Amount * Price
RecyclerProcessingFee DECIMAL(18,2) -- Optional: Recycler fee
RecyclerId           INT            -- FK to Recyclers
WasteRecyclingOrderId BIGINT        -- FK to WasteRecyclingOrders
RecyclerRequestedAt  DATETIME       -- When recycler request made
RecyclerAcceptedAt   DATETIME       -- When recycler accepted
```

### 2. **New OrderPayment Table**
Tracks all payments (buyer→seller, buyer→recycler):
```sql
OrderPayments (New Table)
├── Id                    BIGINT PK
├── OrderId              BIGINT FK → Orders
├── PaymentType          INT (0=OrderPayment, 1=RecyclerFee)
├── PayerFactoryId       BIGINT FK → Factories
├── PayeeFactoryId       BIGINT FK → Factories
├── Amount               DECIMAL(18,2)
├── Status               INT (0=Pending, 1=Paid, 2=Failed, 3=Refunded)
├── PaymentMethod        VARCHAR(100)
├── TransactionReference VARCHAR(200)
├── Notes                VARCHAR(500)
├── CreatedAt            DATETIME
├── CompletedAt          DATETIME
├── FailedAt             DATETIME
└── UpdatedAt            DATETIME
```

### 3. **Enhanced WasteRecyclingOrder**
Added Order reference:
```sql
OrderId BIGINT FK → Orders (nullable)
```
This allows linking recycling orders back to marketplace orders.

---

## 🛠️ Services Implementation

### 1. **OrderService** (`Services/OrderService.cs`)

**Purpose**: Manage complete order lifecycle from creation to completion/recycling.

**Key Methods**:
```csharp
// Order Operations
CreateOrderAsync(wasteListingId, buyerId, sellerId, qty, names)
    └→ Creates Order + OrderPayment (buyer pays seller)

GetOrderByIdAsync(orderId)
    └→ Retrieves order with all related data

GetOrdersByFactoryAsync(factoryId, role)
    └→ Get orders where factory is buyer or seller

UpdateOrderStatusAsync(orderId, newStatus)
    └→ Transition order through lifecycle

// Recycler Integration
RequestRecyclerAsync(orderId, recyclerId, processingFee)
    └→ Request recycler + create WasteRecyclingOrder
    └→ Create RecyclerPayment record

AcceptRecyclerRequestAsync(orderId)
    └→ Recycler confirms they'll process waste

RejectRecyclerRequestAsync(orderId, reason)
    └→ Recycler declines + order returns to buyer

CompleteOrderAsync(orderId)
    └→ Mark order and recycling (if applicable) as complete

GetPendingOrdersAsync(factoryId)
    └→ Orders not yet completed

GetOrderWithPaymentsAsync(orderId)
    └→ Order + full payment history
```

**Status Transitions**:
```
Order Lifecycle:
  Pending → Confirmed → In Progress → Completed
                      → Sent to Recycler → Processing → Completed

RecyclerStatus:
  None → Requested → Accepted → Processing → Completed
                   → Rejected (return to buyer)
```

---

### 2. **PaymentService** (`Services/PaymentService.cs`)

**Purpose**: Handle payment lifecycle, status tracking, and financial reconciliation.

**Key Methods**:
```csharp
// Payment Creation & Processing
CreateOrderPaymentAsync(orderId, payerId, payeeId, amount, type)
    └→ Create pending payment record

ProcessPaymentAsync(paymentId, method, reference)
    └→ Mark payment as Paid (with confirmation details)

MarkPaymentAsFailedAsync(paymentId, reason)
    └→ Mark payment as Failed

RefundPaymentAsync(paymentId, reason)
    └→ Refund previously paid amount

// Payment Queries
GetOrderPaymentsAsync(orderId)
    └→ All payments for an order (buyer→seller + recycler fees)

GetFactoryPaymentsAsync(factoryId, role)
    └→ As payer or payee

GetTotalPaidForOrderAsync(orderId)
    └→ Sum of paid payments

GetOutstandingBalanceAsync(orderId)
    └→ Total due - amount paid

GetPendingPaymentsAsync(factoryId, role)
    └→ Awaiting processing

GetPaymentSummaryAsync(factoryId)
    └→ Receivable, Payable, Paid, Pending totals
```

**Payment Types**:
- `OrderPayment (0)`: Buyer pays Seller for waste
- `RecyclerFee (1)`: Buyer pays Recycler for processing

**Payment Statuses**:
- `Pending (0)`: Created, awaiting payment
- `Paid (1)`: Payment completed successfully
- `Failed (2)`: Payment attempt failed
- `Refunded (3)`: Previously paid, now refunded

---

### 3. **RecyclerIntegrationService** (`Services/RecyclerIntegrationService.cs`)

**Purpose**: Manage recycler workflow, job tracking, and performance metrics.

**Key Methods**:
```csharp
// Recycler Discovery & Job Management
GetSuitableRecyclersAsync(orderId)
    └→ Recyclers capable of processing waste type

GetRecyclerJobsAsync(recyclerId, status)
    └→ All jobs for a recycler (filtered by status)

GetPendingJobsAsync(recyclerId)
    └→ Pending + Processing jobs

GetCompletedJobsAsync(recyclerId, limit)
    └→ Recent completed jobs

// Job Workflow
AcceptRecyclingJobAsync(recyclingOrderId)
    └→ Recycler confirms job acceptance

RejectRecyclingJobAsync(recyclingOrderId, reason)
    └→ Recycler declines + save reason

UpdateProcessingStatusAsync(recyclingOrderId, status)
    └→ Update: Pending → Processing → Completed

CompleteProcessingAsync(recyclingOrderId, outputQty, materialType)
    └→ Finalize job with output details
    └→ Calculate efficiency % (output/input)
    └→ Mark order as completed

// Performance Analytics
GetRecyclerMetricsAsync(recyclerId)
    └→ Total processed, pending, rejected
    └→ Average efficiency %, total CO2 avoided
    └→ Rating + conversions
```

**Recycling Order Status Enum**:
```csharp
enum WasteRecyclingOrderStatus
{
    Pending,      // 0 - Awaiting recycler response
    Accepted,     // 1 - Recycler confirmed
    Processing,   // 2 - Work in progress
    Completed,    // 3 - Done
    Rejected,     // 4 - Recycler declined
    Failed        // 5 - Issue occurred
}
```

---

## 📊 DTOs (API Response Objects)

### Enhanced Order DTO
```csharp
OrderDto {
    // Existing fields
    Id, OrderNumber, WasteType, WasteCategory,
    Amount, Unit, Price, BuyerName, SellerName,
    Status, Notes, OrderDate, DeliveryDate, CompletedDate,
    
    // ✅ NEW FIELDS
    TotalPrice,           // Computed: qty * price
    RecyclerProcessingFee, // If using recycler
    OrderStatus,          // Pending, Confirmed, In Progress, etc.
    PaymentStatus,        // Pending, Paid, Failed
    RecyclerStatus,       // None, Requested, Accepted, etc.
    RecyclerId,
    RecyclerName
}
```

### Payment DTOs
```csharp
OrderPaymentDto {
    Id, OrderId, PaymentType, PayerFactoryId, PayeeFactoryId,
    Amount, Status, PaymentMethod, TransactionReference,
    CreatedAt, CompletedAt
}

PaymentSummaryDto {
    TotalReceivable,      // Money owed to this factory
    TotalPayable,         // Money owed by this factory
    TotalPaid,            // Already processed
    PendingPayments,      // Waiting to process
    CompletedTransactions,
    FailedTransactions
}
```

### Recycler Integration DTOs
```csharp
RequestRecyclerDto {
    OrderId,              // Which order
    RecyclerId,           // Which recycler
    ProcessingFee,        // How much to charge
    SpecialInstructions   // Any notes
}

WasteRecyclingOrderDto {
    Id, OrderNumber, LinkedOrderId, RecyclerId, RecyclerName,
    QuantityToProcess, Unit, ProcessingCost,
    Status, StatusDisplay,
    ActualEfficiencyPercent, OutputMaterialType, OutputQuantity,
    CO2AvoidedKg, CreatedAt, AcceptedAt, ProcessingStartedAt,
    ProcessingCompletedAt, RejectionReason
}

SuitableRecyclerDto {
    Id, CompanyName, CompanyNameAr, ContactEmail, ContactPhone,
    Location, Rating, TotalConversions, IsVerified,
    Capabilities (list)
}

RecyclerPerformanceDto {
    RecyclerId, RecyclerName,
    TotalOrdersProcessed, TotalOrdersPending, TotalOrdersRejected,
    AverageEfficiencyPercent, TotalWasteProcessed, TotalOutputGenerated,
    EstimatedCO2Avoided, Rating
}
```

---

## 🔧 Database Migration

**Migration Name**: `20260410124642_EnhanceOrderWithPaymentAndRecycler`

**Applied Successfully**: ✅

**Changes**:
1. Added columns to `Orders` table (OrderStatus, PaymentStatus, RecyclerStatus, TotalPrice, RecyclerProcessingFee, RecyclerId, WasteRecyclingOrderId, RecyclerRequestedAt, RecyclerAcceptedAt)
2. Created new `OrderPayments` table with indexes
3. Updated `WasteRecyclingOrders` to include `OrderId` foreign key
4. Added foreign key relationships in `OnModelCreating`

---

## 🚀 Service Registration

**Location**: `Program.cs` (lines ~155-165)

```csharp
// ✅ NEW: MARKETPLACE & PAYMENT SERVICES
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IRecyclerIntegrationService, RecyclerIntegrationService>();
```

These are automatically injected into controllers via dependency injection.

---

## 📡 API Endpoints (To Be Implemented)

### <span style="color: orange;">🟠 **NOT YET IMPLEMENTED** - Next Phase</span>

The following endpoints should be created in new/extended controllers:

### **OrdersController** (Extend existing)
```
POST   /api/orders/{orderId}/request-recycler
       Request recycler for waste processing
       Body: RequestRecyclerDto
       Response: OrderDto (updated with recycler info)

POST   /api/orders/{orderId}/accept-recycler
       Buyer confirms they want to send to recycler
       Response: { success: bool }

POST   /api/orders/{orderId}/complete
       Mark order as complete
       Response: OrderDto

GET    /api/orders/{orderId}/payments
       Get all payment records for order
       Response: List<OrderPaymentDto>

GET    /api/orders/{factoryId}/summary
       Financial summary for factory
       Response: PaymentSummaryDto
```

### **PaymentsController** (New Controller)
```
POST   /api/payments/{paymentId}/process
       Process pending payment
       Body: CreatePaymentRequest
       Response: OrderPaymentDto

POST   /api/payments/{paymentId}/refund
       Refund a payment
       Response: { success: bool, reason: string }

GET    /api/payments/pending
       Get pending payments for logged-in factory
       Response: List<OrderPaymentDto>

GET    /api/payments/summary
       Payment summary for factory
       Response: PaymentSummaryDto
```

### **RecyclerOrderController** (Possibly extend RecyclerController)
```
GET    /api/recycler/jobs
       Get jobs for logged-in recycler
       Query: status=all|pending|processing|completed
       Response: List<WasteRecyclingOrderDto>

POST   /api/recycler/jobs/{jobId}/accept
       Recycler accepts job
       Response: WasteRecyclingOrderDto

POST   /api/recycler/jobs/{jobId}/reject
       Recycler rejects job
       Body: { reason: string }
       Response: { success: bool }

POST   /api/recycler/jobs/{jobId}/complete
       Finalize job with output
       Body: CompleteProcessingRequest
       Response: WasteRecyclingOrderDto

GET    /api/recycler/jobs/{jobId}/metrics
       Performance metrics for recycler
       Response: RecyclerPerformanceDto

GET    /api/orders/{orderId}/suitable-recyclers
       Get recyclers suitable for an order
       Response: List<SuitableRecyclerDto>
```

---

## ✨ Key Features & Benefits

### 1. **Complete Payment Tracking**
- ✅ Separate payment records for order and recycler fees
- ✅ Payment status visibility (Pending/Paid/Failed/Refunded)
- ✅ Transaction history and reconciliation
- ✅ Outstanding balance calculations

### 2. **Flexible Recycler Integration**
- ✅ Optional recycler workflow (order can end without recycling)
- ✅ Multiple recycler rejection/acceptance scenarios
- ✅ Clear status transitions and state management
- ✅ Performance tracking for recyclers

### 3. **Environmental Impact Measurement**
- ✅ Efficiency percentage calculated automatically
- ✅ CO2 avoided tracked
- ✅ Output material quantity and type recorded
- ✅ Historical data for analytics

### 4. **Backward Compatibility**
- ✅ Existing Orders still function (recycler workflow optional)
- ✅ Old endpoints unchanged
- ✅ New fields have sensible defaults
- ✅ No data migration needed

### 5. **Clean Architecture**
- ✅ Service layer handles business logic
- ✅ Controllers just orchestrate and return DTOs
- ✅ Database context configured with proper relationships
- ✅ Logging throughout for debugging

---

## 📝 Implementation Notes

### Status Handling
Orders have **two** status fields now:
- `Status` (Arabic, legacy): "معلق", "مؤكد", "مكمل" for UI backwards compatibility  
- `OrderStatus` (English, NEW): "Pending", "Confirmed", "In Progress", "Completed" for APIs

The services prioritize `OrderStatus` for new logic.

### Payment Calculation
When creating an order:
```
TotalPrice = Quantity * UnitPrice
```

If recycler is involved:
```
RecyclerProcessingFee = Amount set by recycler request
PaymentStatus tracks: (1) Buyer→Seller payment + (2) Buyer→Recycler payment
```

### Recycler Workflow
When buyer requests recycler:
1. New `WasteRecyclingOrder` created (linked to Order)
2. `RecyclerPayment` created  
3. `RecyclerStatus` set to "Requested"
4. `RecyclerRequestedAt` timestamp recorded
5. Recycler can now: Accept, Reject, or (after accepting) Process

---

## 🧪 Testing Scenarios

### Scenario 1: Simple Order (No Recycler)
```
1. Factory A creates listing (100kg @ 50/kg)
2. Factory B purchases (Amount=100)
   → Order created
   → OrderPayment: Pending (5000 total)
3. Admin processes payment
   → OrderPayment: Paid
   → Order delivery arranged
4. Order marked complete
   → OrderStatus: Completed
```

### Scenario 2: Order with Recycler
```
1. Factory B has order from step above
2. Requests recycler (RecyclerId=1, Fee=500)
   → OrderPayment created: Recycler Fee (500, Pending)
   → WasteRecyclingOrder created (Pending)
   → RecyclerStatus: Requested
3. Recycler accepts job
   → WasteRecyclingOrder: Accepted
   → RecyclerStatus: Accepted
   → RecyclerAcceptedAt: timestamp
4. Recycler completes processing
   → OutputQuantity: 80kg (recycled pellets)
   → ActualEfficiencyPercent: 80%
   → WasteRecyclingOrder: Completed
   → Order: Completed
5. Buyer can view: Original order + recycler output + all payments
```

### Scenario 3: Recycler Rejection
```
1. Recycler receives job
2. Issues detected, rejects job
   → WasteRecyclingOrder: Rejected
   → RejectionReason: "Contaminated material"
   → RecyclerStatus: Rejected
   → RecyclerId: cleared
3. Buyer can request different recycler or keep waste
```

---

## 🔐 Permission & Authorization

Services handle:
- ✅ Buyer can only request recycler for their own orders
- ✅ Seller can view received payments
- ✅ Recycler can only see jobs assigned to them
- ✅ Factory can only retrieve their own financial summaries

*(Authorization logic to be implemented in Controllers)*

---

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe, LocalPay, etc.)
- [ ] Payment installments/credit terms
- [ ] Automatic recycler matching algorithm
- [ ] Quality rating system for recyclers
- [ ] Batch recycling orders
- [ ] Export to certified statements
- [ ] Multi-currency support
- [ ] Payment dispute resolution workflow

---

## 📚 Code Quality

✅ **Build Status**: SUCCESS  
✅ **Compilation**: No errors  
✅ **Warning Count**: ~202 (existing warnings, not related to new code)  
✅ **Services**: 3 new services, fully functional  
✅ **DTOs**: Comprehensive API response objects  
✅ **Database**: Migration applied successfully  
✅ **DI Registration**: Proper scoping with Scoped lifetime

---

## 🎓 Architecture Decisions

### Why Separate OrderPayment Records?
- Allows tracking multiple payments for one order (buyer→seller + buyer→recycler)
- Enables payment history and reconciliation
- Makes financial reporting clearer
- Supports future payment types

### Why Two Status Fields on Order?
- `Status`: Legacy, keeps UI compatible
- `OrderStatus`: New, cleaner for APIs
- Planned migration: Eventually only use `OrderStatus`

### Why Optional Recycler?
- Flexibility: buyers can choose to recycle or not
- Backward compatibility: existing orders not affected
- Preserves order workflow without recycler involvement

### Why RecyclerIntegrationService Separate?
- Recycler operations are distinct from payment operations
- Easier maintenance and testing
- Can be used independently by recycler dashboards

---

## 📞 Support & Questions

For implementation of Controllers and endpoints, refer to:
- [OrdersController.cs](../controllers/OrdersController.cs) - existing structure
- [MarketplaceController.cs](../controllers/MarketplaceController.cs) - patterns
- Service interfaces above for method signatures

---

**Status**: 🟢 **FOUNDATION COMPLETE** - Ready for Controller & API Implementation

**Created**: 2026-04-10  
**Last Updated**: 2026-04-10  
**Version**: 1.0
