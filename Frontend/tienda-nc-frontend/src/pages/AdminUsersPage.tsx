import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, UserPlus, Edit2, Trash2, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { User, UserRole } from '../types';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserRowSkeleton } from '../components/Skeleton';
import { ConfirmDialog } from '../components/ConfirmDialog';

const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await authAPI.getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast.error('Error al cargar usuarios');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    
    const userToDelete = users.find(u => u.id === userId);
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que quieres eliminar al usuario "${userToDelete?.name}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await authAPI.deleteUser(userId);
          setUsers(users.filter(u => u.id !== userId));
          toast.success('Usuario eliminado exitosamente');
        } catch (error: any) {
          toast.error('Error al eliminar usuario');
        }
      }
    });
  };

  const handleToggleRole = async (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes cambiar tu propio rol');
      return;
    }

    const newRole = user.role === UserRole.Admin ? UserRole.User : UserRole.Admin;
    const actionText = newRole === UserRole.Admin ? 'dar permisos de administrador' : 'quitar permisos de administrador';
    
    setConfirmDialog({
      isOpen: true,
      title: 'Cambiar Rol de Usuario',
      message: `¿Estás seguro de que quieres ${actionText} al usuario "${user.name}"?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          await authAPI.updateUserRole(user.id, newRole);
          setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
          toast.success('Rol actualizado exitosamente');
        } catch (error: any) {
          toast.error('Error al actualizar rol');
        }
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    return role === UserRole.Admin 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Usuarios
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast('Funcionalidad en desarrollo')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                Nuevo Usuario
              </motion.button>
            </div>
            <p className="text-gray-600 mt-2">
              Administra usuarios y sus permisos en el sistema
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos los roles</option>
                  <option value={UserRole.Admin}>Administradores</option>
                  <option value={UserRole.User}>Usuarios</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    // Show skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <UserRowSkeleton key={index} />
                    ))
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role === UserRole.Admin ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleRole(user)}
                            disabled={user.id === currentUser?.id}
                            className={`p-2 rounded-lg transition-colors ${
                              user.id === currentUser?.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title={`${user.role === UserRole.Admin ? 'Quitar' : 'Dar'} permisos de administrador`}
                          >
                            {user.role === UserRole.Admin ? (
                              <ShieldOff className="h-5 w-5" />
                            ) : (
                              <Shield className="h-5 w-5" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toast('Funcionalidad en desarrollo')}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar usuario"
                          >
                            <Edit2 className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                            className={`p-2 rounded-lg transition-colors ${
                              user.id === currentUser?.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
            
            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedRole !== 'all' 
                    ? 'Intenta cambiar los filtros de búsqueda'
                    : 'Comienza agregando un nuevo usuario'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Administradores</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === UserRole.Admin).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Usuarios Regulares</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === UserRole.User).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default AdminUsersPage;
