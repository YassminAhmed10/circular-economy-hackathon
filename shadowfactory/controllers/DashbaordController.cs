using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using System.Security.Claims;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            ECoVDbContext context,
            ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<DashboardResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??"
                    });
                }

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "???????? ??? ?????"
                    });
                }

                var factoryId = user.FactoryId;

                // Get all dashboard data
                var stats = await GetDashboardStats(factoryId);
                var quickStats = GetQuickStats(stats);
                var recentTransactions = await GetRecentTransactions(factoryId);
                var marketItems = await GetMarketItems(factoryId);
                var myListings = await GetMyListings(factoryId);
                var partners = await GetPartners();
                var quickActions = GetQuickActions();

                var response = new DashboardResponseDto
                {
                    Stats = stats,
                    QuickStats = quickStats,
                    RecentTransactions = recentTransactions,
                    MarketItems = marketItems,
                    MyListings = myListings,
                    Partners = partners,
                    QuickActions = quickActions,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Role = user.Role,
                        FactoryId = user.FactoryId,
                        LastLogin = user.LastLogin
                    },
                    Factory = user.Factory != null ? new FactoryDto
                    {
                        Id = user.Factory.Id,
                        FactoryName = user.Factory.FactoryName,
                        FactoryNameEn = user.Factory.FactoryNameEn,
                        Location = user.Factory.Location,
                        IsVerified = user.Factory.IsVerified,
                        Status = user.Factory.Status
                    } : null,
                    LastUpdate = DateTime.UtcNow.ToString("yyyy/MM/dd HH:mm"),
                    WelcomeMessage = GetWelcomeMessage(user.FullName)
                };

                return Ok(new ApiResponse<DashboardResponseDto>
                {
                    Success = true,
                    Message = "?? ????? ?????? ???? ?????? ?????",
                    Data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard data");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ?????? ???? ??????"
                });
            }
        }

        private async Task<DashboardStatsResponse> GetDashboardStats(long? factoryId)
        {
            var stats = new DashboardStatsResponse();

            if (factoryId.HasValue)
            {
                // Total waste from my listings (convert to tons)
                var myWaste = await _context.WasteListings
                    .Where(w => w.FactoryId == factoryId.Value && w.Status == "Active")
                    .SumAsync(w => w.Amount);
                stats.TotalWaste = myWaste / 1000; // Convert kg to tons

                // Total views on my listings
                stats.TotalViews = await _context.WasteListings
                    .Where(w => w.FactoryId == factoryId.Value)
                    .SumAsync(w => w.Views);

                // Active orders
                stats.ActiveOrders = await _context.Transactions
                    .Where(t => (t.BuyerFactoryId == factoryId.Value || t.SellerFactoryId == factoryId.Value)
                             && (t.Status == "Pending" || t.Status == "UnderReview"))
                    .CountAsync();

                // Total revenue
                stats.TotalRevenue = await _context.Transactions
                    .Where(t => t.SellerFactoryId == factoryId.Value && t.Status == "Completed")
                    .SumAsync(t => t.Price);

                // Active listings
                stats.ActiveListings = await _context.WasteListings
                    .Where(w => w.FactoryId == factoryId.Value && w.Status == "Active")
                    .CountAsync();

                // Pending transactions
                stats.PendingTransactions = await _context.Transactions
                    .Where(t => (t.BuyerFactoryId == factoryId.Value || t.SellerFactoryId == factoryId.Value)
                             && t.Status == "Pending")
                    .CountAsync();

                // Environmental impact (calculated from total waste)
                stats.CarbonSaved = stats.TotalWaste * 2.5m; // 2.5 tons CO2 per ton of waste diverted
                stats.WaterSaved = stats.TotalWaste * 3000; // 3000 cubic meters per ton
            }

            return stats;
        }

        private List<QuickStatDto> GetQuickStats(DashboardStatsResponse stats)
        {
            return new List<QuickStatDto>
            {
                new QuickStatDto
                {
                    Title = "?????? ????????",
                    Value = $"{stats.TotalWaste:F1} ??",
                    Icon = "Package",
                    Color = "emerald",
                    Subtitle = "?? ???????? ??????"
                },
                new QuickStatDto
                {
                    Title = "?????????",
                    Value = stats.TotalViews.ToString("N0"),
                    Icon = "Eye",
                    Color = "blue",
                    Subtitle = "??? ????????"
                },
                new QuickStatDto
                {
                    Title = "??????? ??????",
                    Value = stats.ActiveOrders.ToString(),
                    Icon = "ShoppingCart",
                    Color = "purple",
                    Subtitle = "??? ????????"
                },
                new QuickStatDto
                {
                    Title = "?????? ?????????",
                    Value = $"{stats.TotalRevenue:N0} ?",
                    Icon = "TrendingUp",
                    Color = "amber",
                    Subtitle = "?? ???????? ????????"
                }
            };
        }

        private async Task<List<RecentTransactionDashboardDto>> GetRecentTransactions(long? factoryId)
        {
            if (!factoryId.HasValue)
                return new List<RecentTransactionDashboardDto>();

            var transactions = await _context.Transactions
                .Include(t => t.WasteListing)
                .Include(t => t.BuyerFactory)
                .Include(t => t.SellerFactory)
                .Where(t => t.BuyerFactoryId == factoryId.Value || t.SellerFactoryId == factoryId.Value)
                .OrderByDescending(t => t.CreatedAt)
                .Take(5)
                .ToListAsync();

            return transactions.Select(t => new RecentTransactionDashboardDto
            {
                Id = t.Id,
                Type = t.WasteType,
                Amount = $"{t.Amount} {t.Unit}",
                Price = $"{t.Price:N0} ?",
                Date = t.CreatedAt.ToString("yyyy/MM/dd"),
                Status = GetStatusText(t.Status),
                StatusColor = GetStatusColor(t.Status),
                TransactionType = t.BuyerFactoryId == factoryId.Value ? "buy" : "sell"
            }).ToList();
        }

        private async Task<List<DashboardWasteListingDto>> GetMarketItems(long? factoryId)
        {
            var items = await _context.WasteListings
                .Include(w => w.Factory)
                .Where(w => w.Status == "Active")
                .OrderByDescending(w => w.CreatedAt)
                .Take(6)
                .ToListAsync();

            return items.Select(w => new DashboardWasteListingDto
            {
                Id = w.Id,
                Type = w.Type,
                Amount = w.Amount,
                Unit = w.Unit,
                Price = w.Price,
                FactoryName = w.Factory != null ? w.Factory.FactoryName : w.FactoryName,
                Location = w.Factory != null ? w.Factory.Location : w.Location,
                Description = w.Description,
                Category = w.Category,
                ImageUrl = w.ImageUrl,
                Status = w.Status,
                Views = w.Views,
                Offers = w.Offers,
                CreatedAt = w.CreatedAt,
                IsMyListing = w.FactoryId == factoryId
            }).ToList();
        }

        private async Task<List<MyListingDto>> GetMyListings(long? factoryId)
        {
            if (!factoryId.HasValue)
                return new List<MyListingDto>();

            var listings = await _context.WasteListings
                .Where(w => w.FactoryId == factoryId.Value)
                .OrderByDescending(w => w.CreatedAt)
                .Take(3)
                .ToListAsync();

            return listings.Select(w => new MyListingDto
            {
                Id = w.Id,
                Title = w.Type,
                Status = GetStatusText(w.Status),
                Views = w.Views,
                Offers = w.Offers,
                Price = $"{w.Price:N0} ?",
                CreatedAt = w.CreatedAt,
                Category = w.Category
            }).ToList();
        }

        private async Task<List<DashboardPartnerDto>> GetPartners()
        {
            var partners = await _context.Partners
                .Where(p => p.IsVerified)
                .OrderByDescending(p => p.Rating)
                .Take(3)
                .ToListAsync();

            return partners.Select(p => new DashboardPartnerDto
            {
                Id = p.Id,
                Name = p.Name,
                Location = p.Location,
                Specialty = p.Specialty,
                Rating = p.Rating,
                CompletedDeals = p.CompletedDeals,
                IsVerified = p.IsVerified,
                LogoUrl = p.LogoUrl,
                Description = p.Description
            }).ToList();
        }

        private List<QuickActionDto> GetQuickActions()
        {
            return new List<QuickActionDto>
            {
                new QuickActionDto
                {
                    Title = "???? ??? ?????",
                    Description = "???? ???? ???? ???????? ???????",
                    Icon = "ShoppingCart",
                    Route = "/marketplace",
                    ButtonText = "????? ?????",
                    ButtonColor = "emerald"
                },
                new QuickActionDto
                {
                    Title = "????? ??????",
                    Description = "??? ?????? ????? ?? ?????",
                    Icon = "Package",
                    Route = "/list-waste",
                    ButtonText = "????? ?????? ?????",
                    ButtonColor = "emerald"
                },
                new QuickActionDto
                {
                    Title = "?????????",
                    Description = "????? ???? ????? ???????? ????????",
                    Icon = "BarChart",
                    Route = "/analytics",
                    ButtonText = "??? ?????????",
                    ButtonColor = "emerald"
                }
            };
        }

        private string GetStatusText(string status)
        {
            return status switch
            {
                "Active" => "???",
                "Pending" => "??? ????????",
                "Completed" => "??????",
                "Cancelled" => "?????",
                "UnderReview" => "??? ????????",
                "Sold" => "????",
                "Expired" => "?????",
                _ => status
            };
        }

        private string GetStatusColor(string status)
        {
            return status switch
            {
                "Active" or "Completed" or "Sold" => "emerald",
                "Pending" or "UnderReview" => "amber",
                "Cancelled" or "Expired" => "red",
                _ => "gray"
            };
        }

        private string GetWelcomeMessage(string fullName)
        {
            var hour = DateTime.UtcNow.Hour;
            string greeting = hour < 12 ? "???? ?????" : hour < 18 ? "???? ?????" : "???? ?????";

            return $"{greeting}? {fullName}!";
        }

        // Additional endpoints for dashboard functionality

        [HttpGet("analytics")]
        [ProducesResponseType(typeof(ApiResponse<AnalyticsDataDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAnalytics()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??"
                    });
                }

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null || !user.FactoryId.HasValue)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "???????? ??? ????? ?? ??? ???? ????"
                    });
                }

                var factoryId = user.FactoryId.Value;
                var analyticsData = await GetAnalyticsData(factoryId);

                return Ok(new ApiResponse<AnalyticsDataDto>
                {
                    Success = true,
                    Message = "?? ????? ?????? ????????? ?????",
                    Data = analyticsData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting analytics data");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ?????? ?????????"
                });
            }
        }

        private async Task<AnalyticsDataDto> GetAnalyticsData(long factoryId)
        {
            var analyticsData = new AnalyticsDataDto();

            // Get monthly revenue data for the last 6 months
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            var monthlyRevenue = await _context.Transactions
                .Where(t => t.SellerFactoryId == factoryId &&
                           t.Status == "Completed" &&
                           t.CompletedAt >= sixMonthsAgo)
                .GroupBy(t => new { t.CompletedAt.Value.Year, t.CompletedAt.Value.Month })
                .Select(g => new MonthlyRevenueDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:00}",
                    Revenue = g.Sum(t => t.Price),
                    Transactions = g.Count()
                })
                .OrderBy(r => r.Month)
                .ToListAsync();

            analyticsData.MonthlyRevenue = monthlyRevenue;

            // Get waste category distribution
            var categoryDistribution = await _context.Transactions
                .Include(t => t.WasteListing)
                .Where(t => t.SellerFactoryId == factoryId && t.Status == "Completed")
                .GroupBy(t => t.WasteListing.Category)
                .Select(g => new WasteCategoryDistributionDto
                {
                    Category = g.Key,
                    CategoryName = GetCategoryName(g.Key),
                    Amount = g.Sum(t => t.Amount),
                    Revenue = g.Sum(t => t.Price),
                    Color = GetCategoryColor(g.Key)
                })
                .ToListAsync();

            analyticsData.CategoryDistribution = categoryDistribution;

            // Get top partners (factories you've transacted with)
            var topPartners = await _context.Transactions
                .Include(t => t.BuyerFactory)
                .Where(t => t.SellerFactoryId == factoryId && t.Status == "Completed")
                .GroupBy(t => t.BuyerFactoryId)
                .Select(g => new TopPartnerDto
                {
                    Name = g.First().BuyerFactory.FactoryName,
                    Transactions = g.Count(),
                    TotalAmount = g.Sum(t => t.Amount),
                    Rating = 4.5m // This should come from partner rating system
                })
                .OrderByDescending(p => p.Transactions)
                .Take(5)
                .ToListAsync();

            analyticsData.TopPartners = topPartners;

            // Get environmental impact
            var totalWasteSold = await _context.Transactions
                .Where(t => t.SellerFactoryId == factoryId && t.Status == "Completed")
                .SumAsync(t => t.Amount);

            var wasteInTons = totalWasteSold / 1000; // Convert kg to tons

            analyticsData.EnvironmentalImpact = new EnvironmentalImpactDto
            {
                CarbonSaved = wasteInTons * 2.5m,
                WaterSaved = wasteInTons * 3000,
                EnergySaved = wasteInTons * 500, // 500 kWh per ton
                LandfillDiverted = wasteInTons
            };

            return analyticsData;
        }

        private string GetCategoryName(string category)
        {
            return category switch
            {
                "plastic" => "???????",
                "metal" => "?????",
                "paper" => "???",
                "glass" => "????",
                "electronic" => "??????????",
                "textile" => "???????",
                "organic" => "?????",
                "hazardous" => "????",
                _ => category
            };
        }

        private string GetCategoryColor(string category)
        {
            return category switch
            {
                "plastic" => "blue",
                "metal" => "gray",
                "paper" => "amber",
                "glass" => "emerald",
                "electronic" => "purple",
                "textile" => "pink",
                "organic" => "green",
                "hazardous" => "red",
                _ => "emerald"
            };
        }

        [HttpGet("categories")]
        [ProducesResponseType(typeof(ApiResponse<List<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.WasteListings
                    .Where(w => w.Status == "Active")
                    .GroupBy(w => w.Category)
                    .Select(g => new CategoryDto
                    {
                        Id = g.Key,
                        Name = GetCategoryName(g.Key),
                        Count = g.Count(),
                        Icon = GetCategoryIcon(g.Key),
                        Color = GetCategoryColor(g.Key)
                    })
                    .OrderByDescending(c => c.Count)
                    .ToListAsync();

                return Ok(new ApiResponse<List<CategoryDto>>
                {
                    Success = true,
                    Message = "?? ????? ?????? ?????",
                    Data = categories
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ??????"
                });
            }
        }

        private string GetCategoryIcon(string category)
        {
            return category switch
            {
                "plastic" => "Droplet",
                "metal" => "HardDrive",
                "paper" => "FileText",
                "glass" => "Glass",
                "electronic" => "Cpu",
                "textile" => "Shirt",
                "organic" => "Leaf",
                "hazardous" => "AlertTriangle",
                _ => "Package"
            };
        }
    }
}
//

