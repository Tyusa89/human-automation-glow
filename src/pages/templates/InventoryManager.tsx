import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Bell,
  Truck,
  Building,
  Calendar,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  XCircle,
  Database,
  Mail,
  Slack
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: Date;
  status: "in_stock" | "low_stock" | "out_of_stock" | "reorder_pending";
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  activeProducts: number;
  lastOrder?: Date;
}

interface Transaction {
  id: string;
  productId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  timestamp: Date;
  userId: string;
  location: string;
}

interface Alert {
  id: string;
  type: "low_stock" | "out_of_stock" | "reorder_needed" | "expiring";
  productId: string;
  productName: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  acknowledged: boolean;
}

export default function InventoryManager() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      category: "Electronics",
      currentStock: 15,
      reorderLevel: 20,
      maxStock: 100,
      unitPrice: 79.99,
      supplier: "TechSupply Co",
      location: "Warehouse A-1",
      lastUpdated: new Date("2024-01-14"),
      status: "low_stock"
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      sku: "EOC-001",
      category: "Furniture",
      currentStock: 8,
      reorderLevel: 10,
      maxStock: 50,
      unitPrice: 249.99,
      supplier: "Office Depot",
      location: "Warehouse B-2",
      lastUpdated: new Date("2024-01-13"),
      status: "low_stock"
    },
    {
      id: "3",
      name: "Stainless Steel Water Bottle",
      sku: "SSWB-001",
      category: "Kitchen",
      currentStock: 45,
      reorderLevel: 25,
      maxStock: 200,
      unitPrice: 24.99,
      supplier: "EcoProducts Ltd",
      location: "Warehouse A-2",
      lastUpdated: new Date("2024-01-15"),
      status: "in_stock"
    },
    {
      id: "4",
      name: "Premium Coffee Beans",
      sku: "PCB-001",
      category: "Food",
      currentStock: 0,
      reorderLevel: 50,
      maxStock: 300,
      unitPrice: 18.99,
      supplier: "Coffee Roasters Inc",
      location: "Warehouse C-1",
      lastUpdated: new Date("2024-01-12"),
      status: "out_of_stock"
    }
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "TechSupply Co",
      contact: "John Smith",
      email: "orders@techsupply.com",
      phone: "+1-555-0123",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      rating: 4.8,
      activeProducts: 15,
      lastOrder: new Date("2024-01-10")
    },
    {
      id: "2",
      name: "Office Depot",
      contact: "Sarah Johnson",
      email: "business@officedepot.com",
      phone: "+1-555-0456",
      address: "456 Business Ave, Corporate City, NY 10001",
      rating: 4.2,
      activeProducts: 8,
      lastOrder: new Date("2024-01-08")
    },
    {
      id: "3",
      name: "EcoProducts Ltd",
      contact: "Mike Green",
      email: "sales@ecoproducts.com",
      phone: "+1-555-0789",
      address: "789 Green Way, Eco Town, OR 97001",
      rating: 4.9,
      activeProducts: 12,
      lastOrder: new Date("2024-01-14")
    }
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      type: "low_stock",
      productId: "1",
      productName: "Wireless Bluetooth Headphones",
      message: "Stock level (15) below reorder point (20)",
      severity: "medium",
      timestamp: new Date("2024-01-15T10:30:00"),
      acknowledged: false
    },
    {
      id: "2",
      type: "out_of_stock",
      productId: "4",
      productName: "Premium Coffee Beans",
      message: "Product is completely out of stock",
      severity: "high",
      timestamp: new Date("2024-01-15T09:15:00"),
      acknowledged: false
    },
    {
      id: "3",
      type: "reorder_needed",
      productId: "2",
      productName: "Ergonomic Office Chair",
      message: "Automatic reorder threshold reached",
      severity: "medium",
      timestamp: new Date("2024-01-14T16:45:00"),
      acknowledged: true
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      productId: "3",
      type: "in",
      quantity: 50,
      reason: "New shipment received",
      timestamp: new Date("2024-01-15T14:20:00"),
      userId: "admin",
      location: "Warehouse A-2"
    },
    {
      id: "2",
      productId: "1",
      type: "out",
      quantity: 5,
      reason: "Customer order fulfillment",
      timestamp: new Date("2024-01-14T11:30:00"),
      userId: "sales",
      location: "Warehouse A-1"
    },
    {
      id: "3",
      productId: "4",
      type: "out",
      quantity: 10,
      reason: "Bulk order shipment",
      timestamp: new Date("2024-01-12T09:45:00"),
      userId: "warehouse",
      location: "Warehouse C-1"
    }
  ]);

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "in_stock": return "text-green-500";
      case "low_stock": return "text-yellow-500";
      case "out_of_stock": return "text-red-500";
      case "reorder_pending": return "text-blue-500";
    }
  };

  const getStatusIcon = (status: Product["status"]) => {
    switch (status) {
      case "in_stock": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "low_stock": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "out_of_stock": return <XCircle className="w-4 h-4 text-red-500" />;
      case "reorder_pending": return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "low": return "border-l-blue-500";
      case "medium": return "border-l-yellow-500";
      case "high": return "border-l-red-500";
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === "low_stock" || p.status === "out_of_stock").length;
  const totalValue = products.reduce((acc, product) => acc + (product.currentStock * product.unitPrice), 0);
  const activeAlerts = alerts.filter(alert => !alert.acknowledged).length;

  const categories = [...new Set(products.map(p => p.category))];

  const handleStockUpdate = (productId: string, newStock: number) => {
    toast({
      title: "Stock Updated",
      description: `Product stock has been updated to ${newStock} units`,
    });
  };

  const handleReorder = (productId: string) => {
    toast({
      title: "Reorder Initiated",
      description: "Purchase order has been created and sent to supplier",
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              OPS
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              EASY
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Inventory Manager</h1>
          <p className="text-slate-400 text-lg">
            Track inventory levels with automated reorder alerts.
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-500 text-white">
              📦 Stock tracking
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              🔔 Low stock alerts
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white">
              🏢 Supplier management
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500 text-white">
              🗄️ Postgres/Supabase
            </Badge>
            <Badge variant="secondary" className="bg-orange-500 text-white">
              📧 Email/Slack for alerts
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-green-400">+3 new this month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{lowStockProducts}</div>
                  <p className="text-xs text-red-400">Requires attention</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{activeAlerts}</div>
                  <p className="text-xs text-slate-400">Needs acknowledgment</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest inventory alerts requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className={`p-3 border-l-4 ${getAlertSeverityColor(alert.severity)} bg-slate-700/50 rounded-r-lg`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{alert.productName}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "secondary" : "default"}>
                              {alert.severity}
                            </Badge>
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{alert.message}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest stock movements and adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => {
                      const product = products.find(p => p.id === transaction.productId);
                      return (
                        <div key={transaction.id} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{product?.name}</div>
                            <div className="flex items-center gap-2">
                              {transaction.type === "in" ? 
                                <TrendingUp className="w-4 h-4 text-green-500" /> :
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              }
                              <span className={transaction.type === "in" ? "text-green-500" : "text-red-500"}>
                                {transaction.type === "in" ? "+" : "-"}{transaction.quantity}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400">{transaction.reason}</p>
                          <div className="text-xs text-slate-500 mt-1">
                            {transaction.timestamp.toLocaleString()} • {transaction.location}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Inventory</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(product.status)}
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-slate-400">SKU: {product.sku} • {product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(product.status)}>
                          {product.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      <div>
                        <div className="text-slate-400 text-sm">Current Stock</div>
                        <div className="font-bold text-lg">{product.currentStock}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Reorder Level</div>
                        <div className="font-bold">{product.reorderLevel}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Unit Price</div>
                        <div className="font-bold">${product.unitPrice}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Supplier</div>
                        <div className="font-bold">{product.supplier}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Location</div>
                        <div className="font-bold">{product.location}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Total Value</div>
                        <div className="font-bold">${(product.currentStock * product.unitPrice).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>{product.currentStock} / {product.maxStock}</span>
                      </div>
                      <Progress 
                        value={(product.currentStock / product.maxStock) * 100} 
                        className={`h-2 ${product.currentStock <= product.reorderLevel ? "text-red-500" : "text-green-500"}`}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStockUpdate(product.id, product.currentStock + 10)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stock
                      </Button>
                      {product.status === "low_stock" || product.status === "out_of_stock" ? (
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleReorder(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Supplier Management</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < Math.floor(supplier.rating) ? "bg-yellow-500" : "bg-slate-600"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-slate-400">({supplier.rating})</span>
                      </div>
                    </div>
                    <CardDescription>{supplier.contact}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {supplier.address}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700">
                        <div>
                          <div className="text-slate-400 text-xs">Active Products</div>
                          <div className="font-bold">{supplier.activeProducts}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Last Order</div>
                          <div className="font-bold text-sm">
                            {supplier.lastOrder ? supplier.lastOrder.toLocaleDateString() : "Never"}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory Alerts</h2>
              <Button variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className={`bg-slate-800/50 border-slate-700 ${!alert.acknowledged ? "border-l-4 " + getAlertSeverityColor(alert.severity) : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${alert.severity === "high" ? "bg-red-500/20" : alert.severity === "medium" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}>
                          <AlertTriangle className={`w-4 h-4 ${alert.severity === "high" ? "text-red-500" : alert.severity === "medium" ? "text-yellow-500" : "text-blue-500"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{alert.productName}</h3>
                          <p className="text-slate-400 text-sm">{alert.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "secondary" : "default"}>
                          {alert.type.replace("_", " ").toUpperCase()}
                        </Badge>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {alert.timestamp.toLocaleString()}
                      {alert.acknowledged && <span className="ml-2 text-green-500">• Acknowledged</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>Configure when and how you receive inventory alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="low-stock-threshold">Default Low Stock Threshold</Label>
                    <Input
                      id="low-stock-threshold"
                      type="number"
                      defaultValue="5"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alert-email">Alert Email</Label>
                    <Input
                      id="alert-email"
                      type="email"
                      defaultValue="ops@econest.ai"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-slate-400">Receive alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Slack Notifications</Label>
                      <p className="text-sm text-slate-400">Send alerts to Slack channel</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-reorder</Label>
                      <p className="text-sm text-slate-400">Automatically create purchase orders</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Database Integration</CardTitle>
                  <CardDescription>Connect to your Supabase database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Database Provider</Label>
                    <Select defaultValue="supabase">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supabase">Supabase</SelectItem>
                        <SelectItem value="postgres">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="connection-string">Connection String</Label>
                    <Input
                      id="connection-string"
                      type="password"
                      placeholder="postgresql://..."
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync</Label>
                      <p className="text-sm text-slate-400">Sync with external systems</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Database className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}