Write-Host "=== ECoVFactory API Complete Test Suite ===" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

function Test-Endpoint {
    param($Name, $Url, $Method = "GET")
    
    Write-Host "`n[$Method] $Name" -ForegroundColor White
    Write-Host "  Endpoint: $Url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 5
        }
        
        if ($response.success -eq $false) {
            Write-Host "  ⚠ API Error: $($response.message)" -ForegroundColor Yellow
            return $false
        }
        
        Write-Host "  ✓ Success: $($response.message)" -ForegroundColor Green
        
        # Display relevant data
        if ($response.count -ne $null) {
            Write-Host "  Count: $($response.count)" -ForegroundColor DarkGray
        }
        if ($response.data -and $response.data.Count -gt 0) {
            Write-Host "  Items: $($response.data.Count)" -ForegroundColor DarkGray
        }
        
        return $true
    } catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Define test cases
$testCases = @(
    @{Name = "Health Check"; Url = "http://localhost:5000/api/simple"},
    @{Name = "Ping Test"; Url = "http://localhost:5000/api/simple/ping"},
    @{Name = "Factory Count"; Url = "http://localhost:5000/api/factory/count"},
    @{Name = "All Factories"; Url = "http://localhost:5000/api/factory"},
    @{Name = "Search Factories (Riyadh)"; Url = "http://localhost:5000/api/factory/search?location=Riyadh"},
    @{Name = "Get Factory by ID (1)"; Url = "http://localhost:5000/api/factory/1"}
)

$successCount = 0
$totalTests = $testCases.Count

foreach ($test in $testCases) {
    $result = Test-Endpoint -Name $test.Name -Url $test.Url
    if ($result) { $successCount++ }
}

# Summary
Write-Host "`n" + ("="*50) -ForegroundColor Yellow
Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host ("="*50) -ForegroundColor Yellow
Write-Host "Total tests: $totalTests" -ForegroundColor Cyan
Write-Host "Passed: $successCount" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $successCount)" -ForegroundColor $(if ($successCount -eq $totalTests) { "Gray" } else { "Red" })

if ($successCount -eq $totalTests) {
    Write-Host "`n🎉 ALL TESTS PASSED! API is fully operational!" -ForegroundColor Green
} elseif ($successCount -gt 0) {
    Write-Host "`n⚠ Some tests passed. API is partially working." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ All tests failed. API needs debugging." -ForegroundColor Red
}

Write-Host "`nDatabase Status: $(if ($successCount -ge 3) { '✅ Connected' } else { '❌ Issues' })" -ForegroundColor $(if ($successCount -ge 3) { "Green" } else { "Red" })
