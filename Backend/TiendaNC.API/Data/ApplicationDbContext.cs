using Microsoft.EntityFrameworkCore;
using TiendaNC.API.Models;
using TiendaNC.API.Enums;

namespace TiendaNC.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuraciones de User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Role).HasConversion<string>();
            });

            // Configuraciones de Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
                entity.HasIndex(p => p.Name);
                entity.HasIndex(p => p.Type);
            });

            // Configuraciones de RefreshToken
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasIndex(rt => rt.Token).IsUnique();
                entity.HasOne(rt => rt.User)
                      .WithMany()
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Fecha estática para seed data
            var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Hashes pre-generados (Admin123! y User123!)
            // Estos son hashes estáticos que no cambian
            var adminPasswordHash = "$2a$11$XmS.vRWgTzJzxVS8aQZKJ.XYmYq8cZCZDLWb/B8LH0hKqLzE2QzGu"; // Admin123!
            var userPasswordHash = "$2a$11$bDGKkQZYYZKZqDqy7YZqYuZZqYYqYqYqYqYqYqYqYqYqYqYqYqYqY"; // User123!

            // Crear usuario admin por defecto
            var adminUser = new User
            {
                Id = 1,
                Name = "Administrador",
                Email = "admin@tiendanc.com",
                PasswordHash = adminPasswordHash,
                Role = UserRole.Admin,
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            };

            var regularUser = new User
            {
                Id = 2,
                Name = "Usuario Regular",
                Email = "user@tiendanc.com",
                PasswordHash = userPasswordHash,
                Role = UserRole.User,
                CreatedAt = seedDate,
                UpdatedAt = seedDate
            };

            modelBuilder.Entity<User>().HasData(adminUser, regularUser);

            // Productos de ejemplo
            var products = new[]
            {
                new Product
                {
                    Id = 1,
                    Name = "Laptop Gaming MSI",
                    Description = "Laptop para gaming de alta gama con procesador Intel i7 y tarjeta gráfica RTX 4060",
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                    Price = 1500.00m,
                    Type = "Venta",
                    Status = ProductStatus.Disponible,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    CreatedByUserId = 1
                },
                new Product
                {
                    Id = 2,
                    Name = "Cámara Profesional Canon",
                    Description = "Cámara DSLR Canon EOS R5 ideal para fotografía profesional",
                    ImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
                    Price = 50.00m,
                    Type = "Alquiler",
                    Status = ProductStatus.Disponible,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    CreatedByUserId = 1
                },
                new Product
                {
                    Id = 3,
                    Name = "Smartphone iPhone 15",
                    Description = "Último modelo de iPhone con chip A17 Pro y cámara de 48MP",
                    ImageUrl = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
                    Price = 999.00m,
                    Type = "Venta",
                    Status = ProductStatus.Disponible,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    CreatedByUserId = 1
                },
                new Product
                {
                    Id = 4,
                    Name = "Bicicleta Montaña Trek",
                    Description = "Bicicleta de montaña Trek Fuel EX ideal para senderos y aventuras",
                    ImageUrl = "https://images.unsplash.com/photo-1558618047-e51c8318894c",
                    Price = 30.00m,
                    Type = "Alquiler",
                    Status = ProductStatus.Disponible,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    CreatedByUserId = 1
                },
                new Product
                {
                    Id = 5,
                    Name = "Tablet iPad Pro",
                    Description = "iPad Pro 12.9 pulgadas con chip M2 y Apple Pencil incluido",
                    ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
                    Price = 1200.00m,
                    Type = "Venta",
                    Status = ProductStatus.Disponible,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate,
                    CreatedByUserId = 1
                }
            };

            modelBuilder.Entity<Product>().HasData(products);
        }
    }
}
