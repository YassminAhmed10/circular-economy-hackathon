# Profile API Integration - Diagnostic Guide

## Current Issue
The Profile API data is **not being fetched** into WasteDetails. The factory profile shows `source: cached` instead of `🌐 FROM PROFILE API`.

---

## What Should Happen ✅
```
Browser Console Should Show:
📌 [Profile API] Attempting to fetch for email: elnour2@gmail.com
📮 [Profile API] Response received: {
  hasResponse: true,
  hasData: true,
  hasNestedData: true,
  response: {...}
}
✅ [Profile API] Successfully enriched factory: El Nour
   - Logo: YES ✓
   - Tax Number: 33333332
   - Registration Number: 111233
   - Address: giza
```

---

## What's Actually Happening ❌
```
Browser Console Shows:
⏭️ Skipping Profile API fetch: No email available in rawWaste
OR
📮 [Profile API] Response received: {
  hasResponse: false,  ← Problem here!
  hasData: false,
  hasNestedData: false,
  response: null
}
```

---

## Diagnosis Steps

### Step 1: Check if Email is Available
```javascript
// Open browser DevTools → Console → Run:
console.log('Available email:', document.querySelector('[data-waste-email]')?.textContent)
```

### Step 2: Check API Endpoint Exists on Backend
```javascript
// In Console, test the endpoint:
fetch('https://localhost:54464/api/profile/factory/elnour2@gmail.com')
  .then(r => r.json())
  .then(d => console.log('Backend Response:', d))
  .catch(e => console.error('Backend Error:', e))
```

**Expected Success Response:**
```json
{
  "data": {
    "factoryId": "...",
    "factoryName": "El Nour",
    "email": "elnour2@gmail.com",
    "taxNumber": "33333332",
    "registrationNumber": "111233",
    "address": "giza",
    "logoUrl": "...",
    ...
  }
}
```

**Expected Error if Endpoint Missing:**
```
Backend Error: 404 Not Found
```

---

## Root Cause Analysis

### Issue 1: Backend Endpoint Missing ❌
**Endpoint:** `GET /api/profile/factory/{email}`

**Status:** ❓ UNKNOWN - needs verification

**Action Required:**
- Check if this endpoint exists in your C# backend
- Should query database for factory by email
- Return complete factory profile data

**Backend Controller Example (C#):**
```csharp
[HttpGet("factory/{email}")]
public async Task<IActionResult> GetFactoryByEmail(string email)
{
    var factory = await _db.Factories
        .FirstOrDefaultAsync(f => f.Email == email);
    
    if (factory == null)
        return NotFound();
    
    return Ok(new { data = factory });
}
```

---

### Issue 2: Email Not Available in Waste Item ⚠️
**Check:** Does the waste item have an email field?

**Fix:** In the waste listing API response, ensure:
```json
{
  "id": "4120",
  "titleAr": "...",
  "email": "elnour2@gmail.com",  // ← MUST be present
  "companyAr": "El Nour",
  ...
}
```

---

### Issue 3: API Response Structure Mismatch 🔧
**Current Code Expects:**
```javascript
profileResponse?.data?.data  // Nested data structure
```

**If Backend Returns:**
```javascript
{ factoryId, factoryName, ... }  // Flat structure
```

**Fix:** Adjust in WasteDetails.jsx line ~652:
```javascript
// Change from:
if (profileResponse?.data?.data) {
  const completeProfile = { ...profileResponse.data.data };
  
// To:
if (profileResponse?.data) {
  const completeProfile = { ...profileResponse.data };
```

---

## Testing Checklist

- [ ] Backend endpoint `/api/profile/factory/{email}` exists and returns 200
- [ ] Waste item from API includes `email` field
- [ ] Response structure matches `{ data: { factoryId, ... } }`
- [ ] Email is available in `rawWaste` before Profile API is called
- [ ] Console shows "✅ [Profile API] Successfully enriched factory" message

---

## Next Steps
1. **Test Backend Endpoint** using the diagnostic curl/fetch commands above
2. **Share Backend Controller Code** for the /profile/factory endpoint
3. **Check Waste Listing Response** - verify email field is included
4. **Verify Database** - ensure factories have complete profile data (taxNumber, registrationNumber, address)

