import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Eye, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { Customer } from '../types/crm-types';
import { 
  formatCurrency, 
  formatDate, 
  getCustomerSegmentColor, 
  getCustomerSegmentLabel,
  calculateCustomerHealth 
} from '../utils/crm-utils';

interface CustomerListProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
}

export function CustomerList({ customers, onViewCustomer, onEditCustomer }: CustomerListProps) {
  const getHealthBadge = (customer: Customer) => {
    const health = calculateCustomerHealth(customer);
    return (
      <Badge variant="outline" className={health.color}>
        {health.score}
      </Badge>
    );
  };

  const getContactIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      case 'sms': return <Phone className="h-3 w-3" />;
      default: return <Mail className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead>Salud</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                        <AvatarFallback>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{customer.email}</span>
                          {getContactIcon(customer.preferredChannel)}
                        </div>
                        {customer.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{customer.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCustomerSegmentColor(customer.segment)}>
                      {getCustomerSegmentLabel(customer.segment)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatCurrency(customer.ltv)}
                  </TableCell>
                  <TableCell>
                    {customer.lastOrder ? formatDate(customer.lastOrder) : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    {getHealthBadge(customer)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}