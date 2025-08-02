import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Mail,
  Phone,
  Calendar,
  Crown,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

interface UserManagementProps {
  user: User;
}

const PERMISSIONS = [
  { id: 'products', label: 'Gestión de productos', description: 'Crear, editar y eliminar productos' },
  { id: 'orders', label: 'Gestión de pedidos', description: 'Ver y gestionar pedidos' },
  { id: 'customers', label: 'Gestión de clientes', description: 'Acceso al CRM y datos de clientes' },
  { id: 'analytics', label: 'Análisis y reportes', description: 'Ver métricas y generar reportes' },
  { id: 'marketing', label: 'Marketing', description: 'Crear campañas y gestionar promociones' },
  { id: 'finances', label: 'Finanzas', description: 'Ver comisiones y configurar pagos' },
  { id: 'settings', label: 'Configuración', description: 'Cambiar configuración de la tienda' },
  { id: 'users', label: 'Gestión de usuarios', description: 'Invitar y gestionar miembros del equipo' }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@tienda.com',
    phone: '+34 612 345 678',
    role: 'admin',
    status: 'active',
    permissions: PERMISSIONS.map(p => p.id),
    lastLogin: '2024-01-16T09:30:00Z',
    createdAt: '2023-06-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria@tienda.com',
    phone: '+34 698 765 432',
    role: 'manager',
    status: 'active',
    permissions: ['products', 'orders', 'customers', 'analytics'],
    lastLogin: '2024-01-15T16:45:00Z',
    createdAt: '2023-08-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Martín',
    email: 'carlos@tienda.com',
    role: 'staff',
    status: 'pending',
    permissions: ['products', 'orders'],
    createdAt: '2024-01-10T11:15:00Z'
  }
];

export function UserManagement({ user }: UserManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'staff' as TeamMember['role'],
    permissions: [] as string[]
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': { variant: 'default' as const, label: 'Administrador', icon: Crown },
      'manager': { variant: 'secondary' as const, label: 'Gerente', icon: Shield },
      'staff': { variant: 'outline' as const, label: 'Staff', icon: User },
      'viewer': { variant: 'outline' as const, label: 'Visualizador', icon: User }
    };
    
    const roleInfo = variants[role as keyof typeof variants] || variants.staff;
    const Icon = roleInfo.icon;
    
    return (
      <Badge variant={roleInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {roleInfo.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { variant: 'default' as const, label: 'Activo' },
      'pending': { variant: 'secondary' as const, label: 'Pendiente' },
      'inactive': { variant: 'destructive' as const, label: 'Inactivo' }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.active;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const handleInvite = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'pending',
      permissions: inviteForm.permissions,
      createdAt: new Date().toISOString()
    };

    setTeamMembers(prev => [newMember, ...prev]);
    setShowInviteDialog(false);
    setInviteForm({
      name: '',
      email: '',
      role: 'staff',
      permissions: []
    });
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  const handleTogglePermission = (permission: string) => {
    if (inviteForm.permissions.includes(permission)) {
      setInviteForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    } else {
      setInviteForm(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra miembros del equipo y permisos
          </p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invitar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Invita a un miembro a tu equipo y configura sus permisos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteName">Nombre completo</Label>
                  <Input
                    id="inviteName"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail">Email</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="juan@tienda.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteRole">Rol</Label>
                <Select value={inviteForm.role} onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value as TeamMember['role'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Permisos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={inviteForm.permissions.includes(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                      <div>
                        <Label 
                          htmlFor={permission.id} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInvite} disabled={!inviteForm.name || !inviteForm.email}>
                Enviar Invitación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Totales</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invitaciones Pendientes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Esperando aceptación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Admins:</span>
                <span>{teamMembers.filter(m => m.role === 'admin').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Staff:</span>
                <span>{teamMembers.filter(m => m.role === 'staff').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        {member.phone && (
                          <p className="text-xs text-muted-foreground">{member.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(member.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(member.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {member.permissions.length} permisos
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.lastLogin ? formatDate(member.lastLogin) : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}