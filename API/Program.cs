using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ControleChamados.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
        policy.WithOrigins("https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PermitirTudo");

app.MapControllers();

app.Run();