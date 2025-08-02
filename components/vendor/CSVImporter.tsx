import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MapPin,
  Play,
  Clock,
  Eye,
  RefreshCw,
  FileText,
  BarChart3
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface CSVMapping {
  csvColumn: string;
  productField: string;
  required: boolean;
  dataType: 'text' | 'number' | 'boolean' | 'url' | 'email';
}

interface ValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
  severity: 'error' | 'warning';
}

interface ImportJob {
  id: string;
  fileName: string;
  status: 'uploading' | 'mapping' | 'validating' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  successRows: number;
  errorRows: number;
  createdAt: string;
  completedAt?: string;
  errors: ValidationError[];
}

interface CSVImporterProps {
  user: User;
}

// Campos disponibles para mapear
const PRODUCT_FIELDS = [
  { key: 'name', label: 'Nombre del producto', required: true, type: 'text' },
  { key: 'sku', label: 'SKU', required: true, type: 'text' },
  { key: 'description', label: 'Descripción', required: false, type: 'text' },
  { key: 'price', label: 'Precio', required: true, type: 'number' },
  { key: 'compare_price', label: 'Precio original', required: false, type: 'number' },
  { key: 'cost', label: 'Costo', required: false, type: 'number' },
  { key: 'stock', label: 'Stock', required: true, type: 'number' },
  { key: 'category', label: 'Categoría', required: false, type: 'text' },
  { key: 'brand', label: 'Marca', required: false, type: 'text' },
  { key: 'weight', label: 'Peso (kg)', required: false, type: 'number' },
  { key: 'length', label: 'Largo (cm)', required: false, type: 'number' },
  { key: 'width', label: 'Ancho (cm)', required: false, type: 'number' },
  { key: 'height', label: 'Alto (cm)', required: false, type: 'number' },
  { key: 'image_url', label: 'URL imagen principal', required: false, type: 'url' },
  { key: 'image_url_2', label: 'URL imagen 2', required: false, type: 'url' },
  { key: 'image_url_3', label: 'URL imagen 3', required: false, type: 'url' },
  { key: 'tags', label: 'Etiquetas (separadas por coma)', required: false, type: 'text' },
  { key: 'active', label: 'Activo (true/false)', required: false, type: 'boolean' },
  { key: 'featured', label: 'Destacado (true/false)', required: false, type: 'boolean' },
  { key: 'seo_title', label: 'Título SEO', required: false, type: 'text' },
  { key: 'seo_description', label: 'Descripción SEO', required: false, type: 'text' }
];

// Datos mock para el historial de importaciones
const MOCK_IMPORT_HISTORY: ImportJob[] = [
  {
    id: '1',
    fileName: 'productos_enero_2024.csv',
    status: 'completed',
    progress: 100,
    totalRows: 1250,
    processedRows: 1250,
    successRows: 1198,
    errorRows: 52,
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:35:22Z',
    errors: []
  },
  {
    id: '2',
    fileName: 'nuevos_productos.xlsx',
    status: 'processing',
    progress: 65,
    totalRows: 850,
    processedRows: 553,
    successRows: 490,
    errorRows: 63,
    createdAt: '2024-01-16T14:20:00Z',
    errors: []
  },
  {
    id: '3',
    fileName: 'inventario_actualizado.csv',
    status: 'failed',
    progress: 25,
    totalRows: 2100,
    processedRows: 525,
    successRows: 0,
    errorRows: 525,
    createdAt: '2024-01-16T16:45:00Z',
    errors: [
      { row: 1, column: 'price', value: 'gratis', error: 'Debe ser un número válido', severity: 'error' },
      { row: 3, column: 'sku', value: '', error: 'Campo requerido', severity: 'error' }
    ]
  }
];

export function CSVImporter({ user }: CSVImporterProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<CSVMapping[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null);
  const [importHistory, setImportHistory] = useState<ImportJob[]>(MOCK_IMPORT_HISTORY);
  const [dragActive, setDragActive] = useState(false);

  // Manejo de drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Solo se permiten archivos CSV y Excel (.xlsx)');
      return;
    }

    // Validar tamaño (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      alert('El archivo no puede ser mayor a 20MB');
      return;
    }

    setSelectedFile(file);
    
    // Simular lectura del archivo CSV
    setTimeout(() => {
      // Mock CSV data
      const mockCsvData = [
        ['Nombre', 'SKU', 'Precio', 'Stock', 'Categoría', 'Descripción'],
        ['Smartphone Galaxy', 'SGX-001', '799.99', '25', 'Electrónicos', 'Smartphone con cámara triple'],
        ['Auriculares Bluetooth', 'ABT-002', '199.99', '50', 'Electrónicos', 'Auriculares inalámbricos'],
        ['Camiseta Vintage', 'CVT-003', '29.99', '100', 'Moda', 'Camiseta de algodón vintage'],
        ['', 'ERR-004', 'precio_invalido', '-5', 'Categoría inexistente', 'Producto con errores']
      ];
      
      setCsvData(mockCsvData);
      
      // Auto-mapear columnas comunes
      const autoMappings: CSVMapping[] = mockCsvData[0].map((csvColumn, index) => {
        const lowerColumn = csvColumn.toLowerCase();
        let productField = '';
        
        if (lowerColumn.includes('nombre') || lowerColumn.includes('name')) productField = 'name';
        else if (lowerColumn.includes('sku')) productField = 'sku';
        else if (lowerColumn.includes('precio') || lowerColumn.includes('price')) productField = 'price';
        else if (lowerColumn.includes('stock') || lowerColumn.includes('inventario')) productField = 'stock';
        else if (lowerColumn.includes('categoría') || lowerColumn.includes('category')) productField = 'category';
        else if (lowerColumn.includes('descripción') || lowerColumn.includes('description')) productField = 'description';
        
        const field = PRODUCT_FIELDS.find(f => f.key === productField);
        
        return {
          csvColumn,
          productField,
          required: field?.required || false,
          dataType: field?.type as any || 'text'
        };
      });
      
      setMappings(autoMappings);
      setActiveTab('mapping');
    }, 1000);
  };

  const validateData = () => {
    const errors: ValidationError[] = [];
    
    // Validar cada fila (excepto header)
    csvData.slice(1).forEach((row, rowIndex) => {
      mappings.forEach((mapping, colIndex) => {
        if (!mapping.productField) return;
        
        const value = row[colIndex] || '';
        const field = PRODUCT_FIELDS.find(f => f.key === mapping.productField);
        
        // Validar campos requeridos
        if (field?.required && !value.trim()) {
          errors.push({
            row: rowIndex + 2, // +2 porque empezamos en 1 y saltamos header
            column: mapping.csvColumn,
            value,
            error: 'Campo requerido',
            severity: 'error'
          });
        }
        
        // Validar tipos de datos
        if (value.trim()) {
          switch (mapping.dataType) {
            case 'number':
              if (isNaN(Number(value)) || Number(value) < 0) {
                errors.push({
                  row: rowIndex + 2,
                  column: mapping.csvColumn,
                  value,
                  error: 'Debe ser un número válido mayor o igual a 0',
                  severity: 'error'
                });
              }
              break;
            case 'boolean':
              if (!['true', 'false', 'verdadero', 'falso', '1', '0', 'sí', 'si', 'no'].includes(value.toLowerCase())) {
                errors.push({
                  row: rowIndex + 2,
                  column: mapping.csvColumn,
                  value,
                  error: 'Debe ser true/false o sí/no',
                  severity: 'error'
                });
              }
              break;
            case 'url':
              try {
                new URL(value);
              } catch {
                errors.push({
                  row: rowIndex + 2,
                  column: mapping.csvColumn,
                  value,
                  error: 'Debe ser una URL válida',
                  severity: 'warning'
                });
              }
              break;
          }
        }
      });
    });
    
    setValidationErrors(errors);
    setActiveTab('validation');
  };

  const startImport = () => {
    const job: ImportJob = {
      id: Date.now().toString(),
      fileName: selectedFile?.name || 'archivo.csv',
      status: 'processing',
      progress: 0,
      totalRows: csvData.length - 1, // Excluir header
      processedRows: 0,
      successRows: 0,
      errorRows: validationErrors.filter(e => e.severity === 'error').length,
      createdAt: new Date().toISOString(),
      errors: validationErrors
    };
    
    setCurrentJob(job);
    setActiveTab('processing');
    
    // Simular procesamiento asíncrono
    const interval = setInterval(() => {
      setCurrentJob(prev => {
        if (!prev) return null;
        
        const newProgress = Math.min(prev.progress + Math.random() * 15, 100);
        const newProcessedRows = Math.floor((newProgress / 100) * prev.totalRows);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          const finalJob = {
            ...prev,
            status: 'completed' as const,
            progress: 100,
            processedRows: prev.totalRows,
            successRows: prev.totalRows - prev.errorRows,
            completedAt: new Date().toISOString()
          };
          
          setImportHistory(prev => [finalJob, ...prev]);
          return finalJob;
        }
        
        return {
          ...prev,
          progress: newProgress,
          processedRows: newProcessedRows,
          successRows: Math.max(0, newProcessedRows - prev.errorRows)
        };
      });
    }, 500);
  };

  const downloadTemplate = () => {
    const headers = PRODUCT_FIELDS.filter(f => f.required).map(f => f.label);
    const csvContent = headers.join(',') + '\n' + 
      'Smartphone Galaxy Pro,SGP-001,799.99,25\n' +
      'Auriculares Bluetooth,ABT-002,199.99,50';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImporter = () => {
    setSelectedFile(null);
    setCsvData([]);
    setMappings([]);
    setValidationErrors([]);
    setCurrentJob(null);
    setActiveTab('upload');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'uploading': { variant: 'secondary' as const, label: 'Subiendo', icon: Upload },
      'mapping': { variant: 'outline' as const, label: 'Mapeando', icon: MapPin },
      'validating': { variant: 'outline' as const, label: 'Validando', icon: CheckCircle },
      'processing': { variant: 'outline' as const, label: 'Procesando', icon: RefreshCw },
      'completed': { variant: 'default' as const, label: 'Completado', icon: CheckCircle },
      'failed': { variant: 'destructive' as const, label: 'Fallido', icon: XCircle }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.processing;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Importador CSV</h1>
          <p className="text-muted-foreground">
            Importa productos masivamente desde archivos CSV o Excel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Descargar Plantilla
          </Button>
          {selectedFile && (
            <Button variant="outline" onClick={resetImporter}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Nuevo Archivo
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">1. Subir</TabsTrigger>
          <TabsTrigger value="mapping" disabled={!selectedFile}>2. Mapear</TabsTrigger>
          <TabsTrigger value="validation" disabled={mappings.length === 0}>3. Validar</TabsTrigger>
          <TabsTrigger value="processing" disabled={!currentJob}>4. Procesar</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subir archivo CSV/Excel</CardTitle>
              <CardDescription>
                Arrastra y suelta tu archivo o haz clic para seleccionar. Máximo 20MB, hasta 50,000 filas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Badge variant="outline">
                      {selectedFile.type || 'archivo CSV/Excel'}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Formatos soportados: CSV, XLSX
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Vista previa de datos</h4>
                  <div className="text-sm space-y-1">
                    <p>• Filas detectadas: {csvData.length - 1} (excluyendo encabezado)</p>
                    <p>• Columnas detectadas: {csvData[0]?.length || 0}</p>
                    <p>• Encabezados: {csvData[0]?.join(', ') || 'Ninguno'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapeo de columnas</CardTitle>
              <CardDescription>
                Asigna cada columna de tu archivo a un campo de producto. Los campos requeridos están marcados con *.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {csvData[0]?.map((csvColumn, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label className="font-medium">{csvColumn}</Label>
                      <p className="text-sm text-muted-foreground">
                        Ejemplo: {csvData[1]?.[index] || 'Sin datos'}
                      </p>
                    </div>
                    
                    <div className="flex-1">
                      <Select
                        value={mappings[index]?.productField || ''}
                        onValueChange={(value) => {
                          const newMappings = [...mappings];
                          const field = PRODUCT_FIELDS.find(f => f.key === value);
                          newMappings[index] = {
                            csvColumn,
                            productField: value,
                            required: field?.required || false,
                            dataType: field?.type as any || 'text'
                          };
                          setMappings(newMappings);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar campo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sin mapear</SelectItem>
                          {PRODUCT_FIELDS.map(field => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label} {field.required && '*'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-24">
                      {mappings[index]?.required && (
                        <Badge variant="destructive">Requerido</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('upload')}>
                  Anterior
                </Button>
                <Button 
                  onClick={validateData}
                  disabled={!mappings.some(m => m.productField && PRODUCT_FIELDS.find(f => f.key === m.productField)?.required)}
                >
                  Validar Datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validación de datos</CardTitle>
              <CardDescription>
                Revisa los errores y advertencias antes de procesar la importación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationErrors.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">¡Validación exitosa!</h3>
                  <p className="text-muted-foreground">
                    Todos los datos son válidos. Puedes proceder con la importación.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{csvData.length - 1}</p>
                      <p className="text-sm text-muted-foreground">Total filas</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {validationErrors.filter(e => e.severity === 'error').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Errores</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {validationErrors.filter(e => e.severity === 'warning').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Advertencias</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fila</TableHead>
                          <TableHead>Columna</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Error</TableHead>
                          <TableHead>Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationErrors.slice(0, 10).map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{error.column}</TableCell>
                            <TableCell className="max-w-32 truncate">{error.value}</TableCell>
                            <TableCell>{error.error}</TableCell>
                            <TableCell>
                              <Badge variant={error.severity === 'error' ? 'destructive' : 'outline'}>
                                {error.severity === 'error' ? 'Error' : 'Advertencia'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {validationErrors.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ... y {validationErrors.length - 10} errores más
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('mapping')}>
                  Anterior
                </Button>
                <Button 
                  onClick={startImport}
                  disabled={validationErrors.filter(e => e.severity === 'error').length > 0}
                >
                  Iniciar Importación
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {currentJob && (
            <Card>
              <CardHeader>
                <CardTitle>Procesando importación</CardTitle>
                <CardDescription>
                  {currentJob.fileName} - {getStatusBadge(currentJob.status)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso general</span>
                      <span>{Math.round(currentJob.progress)}%</span>
                    </div>
                    <Progress value={currentJob.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{currentJob.totalRows}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{currentJob.processedRows}</p>
                      <p className="text-sm text-muted-foreground">Procesadas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{currentJob.successRows}</p>
                      <p className="text-sm text-muted-foreground">Exitosas</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{currentJob.errorRows}</p>
                      <p className="text-sm text-muted-foreground">Errores</p>
                    </div>
                  </div>

                  {currentJob.status === 'completed' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Importación completada exitosamente. {currentJob.successRows} productos importados.
                        {currentJob.errorRows > 0 && ` ${currentJob.errorRows} filas con errores.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {currentJob.status === 'completed' && (
                    <div className="flex justify-center gap-2">
                      <Button onClick={resetImporter}>
                        Nueva Importación
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Errores
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de importaciones</CardTitle>
              <CardDescription>
                Revisa el estado y resultados de tus importaciones anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importHistory.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{job.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(job.createdAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">{job.totalRows}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exitosas</p>
                        <p className="font-medium text-green-600">{job.successRows}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errores</p>
                        <p className="font-medium text-red-600">{job.errorRows}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progreso</p>
                        <p className="font-medium">{Math.round(job.progress)}%</p>
                      </div>
                    </div>

                    {job.status === 'processing' && (
                      <Progress value={job.progress} className="mt-3 h-1" />
                    )}

                    {job.errors.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Errores
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Descargar Log
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}