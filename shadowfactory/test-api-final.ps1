Write-Host "=== ECoVFactory API Test ===" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

# Stop any running API
Write-Host "`nStopping any running API..." -ForegroundColor Cyan
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | 
    Where-Object { $_.MainWindowTitle -like "*shadowfactory*" -or $_.ProcessName -eq "dotnet" } | 
    Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Start API
Write-Host "Starting API on port 5000..." -ForegroundColor Cyan
$apiProcess = Start-Process dotnet -ArgumentList "run", "--urls", "`"http://localhost:5000`"" -PassThru -NoNewWindow

# Wait for API to start
Write-Host "Waiting for API to start (10 seconds)..." -ForegroundColor Cyan
for ($i = 1; $i -le 10; $i++) {
    Write-Host "." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds 1
}
Write-Host "`n"

# Test endpoints
$baseUrl = "http://localhost:5000/api"
$successCount = 0
$totalTests = 0

function Test-Endpoint {
    param($Name, $Url, $Method = "GET")
    
    $totalTests = $script:totalTests + 1
    $script:totalTests = $totalTests
    
    Write-Host "`nTest #$totalTests: $Name" -ForegroundColor White
    Write-Host "  Endpoint: $Method $Url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 5
        }
        
        Write-Host "  ✓ Success" -ForegroundColor Green
        
        if ($response -is [string]) {
            Write-Host "  Response: $response" -ForegroundColor DarkGray
        } elseif ($response) {
            $jsonResponse = $response | ConvertTo-Json -Compress
            if ($jsonResponse.Length -gt 100) {
                Write-Host "  Response: $($jsonResponse.Substring(0, 100))..." -ForegroundColor DarkGray
            } else {
                Write-Host "  Response: $jsonResponse" -ForegroundColor DarkGray
            }
        }
        
        $script:successCount = $script:successCount + 1
        return $true
    } catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Simple endpoint (no database)
Test-Endpoint -Name "Simple Test Endpoint" -Url "$baseUrl/simple"

# Test 2: Factory count (with database)
Test-Endpoint -Name "Factory Count" -Url "$baseUrl/factory/count"

# Test 3: All factories
Test-Endpoint -Name "All Factories" -Url "$baseUrl/factory"

# Test 4: Test ping
Test-Endpoint -Name "Simple Ping" -Url "$baseUrl/simple/ping"

# Summary
Write-Host "`n" + ("="*40) -ForegroundColor Yellow
Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host ("="*40) -ForegroundColor Yellow
Write-Host "Tests passed: $successCount/$totalTests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

if ($successCount -gt 0) {
    Write-Host "`nAPI is working!" -ForegroundColor Green
    Write-Host "Swagger UI should be available if configured." -ForegroundColor Gray
} else {
    Write-Host "`nAPI failed all tests. Checking if API is running..." -ForegroundColor Red
    
    # Check if port 5000 is listening
    try {
        $tcpTest = New-Object System.Net.Sockets.TcpClient
        $tcpTest.Connect("localhost", 5000)
        Write-Host "Port 5000 is open - API might have different routes" -ForegroundColor Yellow
        $tcpTest.Close()
    } catch {
        Write-Host "Port 5000 is closed - API is not running" -ForegroundColor Red
    }
}

# Cleanup
Write-Host "`nStopping API..." -ForegroundColor Cyan
Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue

Write-Host "`nTest complete!" -ForegroundColor Green
