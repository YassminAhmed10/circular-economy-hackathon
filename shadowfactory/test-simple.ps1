Write-Host "=== Testing ECoVFactory API ===" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# Stop any running API
Write-Host "`nStopping any running API..." -ForegroundColor Cyan
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Start API in background
Write-Host "Starting API on port 5000..." -ForegroundColor Cyan
$apiProcess = Start-Process dotnet -ArgumentList "run", "--urls", "`"http://localhost:5000`"" -PassThru -NoNewWindow

# Wait for API to start
Write-Host "Waiting for API to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

# Test endpoints
$baseUrl = "http://localhost:5000/api"
Write-Host "`nTesting endpoints:" -ForegroundColor White

# Test 1: Simple endpoint
Write-Host "`n1. Testing /api/simple" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/simple" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $_" -ForegroundColor Red
}

# Test 2: Factory count
Write-Host "`n2. Testing /api/factory/count" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/factory/count" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Success: $($response.message)" -ForegroundColor Green
    Write-Host "   Factory count: $($response.count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $_" -ForegroundColor Red
}

# Test 3: All factories
Write-Host "`n3. Testing /api/factory" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/factory" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Success: $($response.message)" -ForegroundColor Green
    Write-Host "   Found $($response.count) factories" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $_" -ForegroundColor Red
}

# Test 4: Simple ping
Write-Host "`n4. Testing /api/simple/ping" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/simple/ping" -Method Get -TimeoutSec 5
    Write-Host "   ✓ Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $_" -ForegroundColor Red
}

# Cleanup
Write-Host "`nStopping API..." -ForegroundColor Cyan
Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue

Write-Host "`n=== Test Complete ===" -ForegroundColor Yellow
