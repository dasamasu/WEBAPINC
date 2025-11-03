using Microsoft.EntityFrameworkCore.Storage;
using TiendaNC.API.Data;
using TiendaNC.API.Models;

namespace TiendaNC.API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        private IGenericRepository<User>? _users;
        private IGenericRepository<Product>? _products;
        private IGenericRepository<RefreshToken>? _refreshTokens;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<User> Users =>
            _users ??= new GenericRepository<User>(_context);

        public IGenericRepository<Product> Products =>
            _products ??= new GenericRepository<Product>(_context);

        public IGenericRepository<RefreshToken> RefreshTokens =>
            _refreshTokens ??= new GenericRepository<RefreshToken>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
