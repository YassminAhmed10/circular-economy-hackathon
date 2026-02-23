var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();  // This registers controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// ⭐⭐⭐ THIS IS THE CRITICAL LINE! ⭐⭐⭐
app.MapControllers();  // Without this, no controller endpoints work!

app.Run();
