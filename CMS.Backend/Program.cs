using Microsoft.EntityFrameworkCore;
using CMS.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();


builder.Services.AddDbContext<CMS.Data.ApplicationDbContext>(options =>

    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// Seed CategoryProduct data programmatically if empty
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CMS.Data.ApplicationDbContext>();
        if (!context.CategoryProducts.Any())
        {
            context.CategoryProducts.AddRange(
                new CMS.Data.Entities.CategoryProduct { Name = "Điện thoại", Description = "Điện thoại di động & Smartphone" },
                new CMS.Data.Entities.CategoryProduct { Name = "Laptop", Description = "Máy tính xách tay" },
                new CMS.Data.Entities.CategoryProduct { Name = "Phụ kiện", Description = "Phụ kiện công nghệ" },
                new CMS.Data.Entities.CategoryProduct { Name = "Gia dụng", Description = "Thiết bị điện gia dụng" }
            );
            context.SaveChanges();
        }
    }
    catch (Exception)
    {
        // Silent catch or logging
    }
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
