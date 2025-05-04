using clearTask.Server;
using clearTask.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure environment and configuration sources
ConfigureEnvironment(builder);

// Register services
ConfigureServices(builder);

var app = builder.Build();

// Configure the HTTP request pipeline
ConfigureMiddleware(app);

// Start application
app.Run();

// Configuration method implementations
void ConfigureEnvironment(WebApplicationBuilder builder)
{
    builder.Configuration
        .SetBasePath(builder.Environment.ContentRootPath)
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables();
}

void ConfigureServices(WebApplicationBuilder builder)
{
    // Database
    ConfigureDatabase(builder);

    // Identity and Authentication
    ConfigureIdentityAndAuth(builder);

    // CORS
    ConfigureCors(builder);

    // Other Services
    ConfigureAdditionalServices(builder);
}

void ConfigureDatabase(WebApplicationBuilder builder)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        options.UseNpgsql(connectionString);
    });
}

void ConfigureIdentityAndAuth(WebApplicationBuilder builder)
{
    // Identity configuration
    builder.Services.AddIdentity<AppUserModel, IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

    // JWT Authentication
    var jwtKey = builder.Configuration["Jwt:Key"] ??
        throw new InvalidOperationException("JWT Key is not configured in appsettings.json");
    var key = Encoding.ASCII.GetBytes(jwtKey); 
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
        ConfigureJwtEvents(options);
    });
}

void ConfigureJwtEvents(JwtBearerOptions options)
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Headers["Authorization"].ToString();
            Console.WriteLine($"Token received: {token}");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
    };
}

void ConfigureCors(WebApplicationBuilder builder)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAllOrigins", builder =>
        {
            builder.WithOrigins(
                "http://localhost:5174",
                "http://localhost:5173",
                "http://ec2-54-91-29-197.compute-1.amazonaws.com:4173",
                "https://nammaweb.live",  // Add your domain
                "http://nammaweb.live"    // Add both http and https versions
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
    });
}

void ConfigureAdditionalServices(WebApplicationBuilder builder)
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSingleton<IRateLimitService, RateLimitService>();
    builder.Services.AddSingleton<Logger>();

    // Add Response Caching
    builder.Services.AddResponseCaching();

    ConfigureSwagger(builder);
}

void ConfigureSwagger(WebApplicationBuilder builder)
{
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme (Example: 'Bearer 12345abcdef')",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });
}

void ConfigureMiddleware(WebApplication app)
{
    // Initialize Logger
    Logger.Initialize(app.Services.GetRequiredService<IServiceScopeFactory>());

    // Development specific middleware
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        });
    }

    // Add Response Caching middleware BEFORE authentication
    app.UseResponseCaching();
    // General middleware
    app.UseRouting();
    app.UseCors("AllowAllOrigins");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    // Configure listening addresses
    app.Urls.Add("http://0.0.0.0:5076");
}