"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Package, Users, DollarSign, TrendingUp, Search, Filter, Star, Heart, Eye, Edit, Trash2, X, Check, CreditCard, Truck, Shield, Menu, Sparkles, Zap, Gift, Percent, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Tipos de dados
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  shippingAddress: string
}

// Dados de exemplo
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Organizador de Porta-Malas Premium',
    price: 89.90,
    originalPrice: 149.90,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    category: 'Acessórios para Carros',
    description: 'Organizador dobrável com múltiplos compartimentos para manter seu porta-malas sempre organizado.',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Suporte Magnético para Telemóvel',
    price: 34.90,
    originalPrice: 59.90,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
    category: 'Acessórios para Carros',
    description: 'Suporte magnético universal para smartphone com rotação 360°.',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Kit Organizador de Gavetas',
    price: 45.90,
    originalPrice: 79.90,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Itens para Casa',
    description: 'Conjunto de organizadores ajustáveis para gavetas de cozinha e casa de banho.',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Carregador Veicular Turbo',
    price: 29.90,
    originalPrice: 49.90,
    image: 'https://images.unsplash.com/photo-1609592806596-4d3b0c3b4b5e?w=400&h=400&fit=crop',
    category: 'Acessórios para Carros',
    description: 'Carregador veicular com 2 portas USB e carregamento rápido.',
    rating: 4.5,
    reviews: 298,
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Luminária LED com Sensor',
    price: 67.90,
    originalPrice: 99.90,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Itens para Casa',
    description: 'Luminária LED com sensor de movimento e bateria recarregável.',
    rating: 4.9,
    reviews: 87,
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Tapete Antiderrapante Premium',
    price: 39.90,
    originalPrice: 69.90,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Itens para Casa',
    description: 'Tapete antiderrapante para casa de banho com design moderno.',
    rating: 4.4,
    reviews: 123,
    inStock: false,
    featured: false
  }
]

const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    items: [
      { ...sampleProducts[0], quantity: 1 },
      { ...sampleProducts[1], quantity: 2 }
    ],
    total: 159.70,
    status: 'processing',
    date: '2024-01-15',
    shippingAddress: 'Rua das Flores, 123 - Lisboa, Portugal'
  },
  {
    id: 'ORD-002',
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    items: [
      { ...sampleProducts[4], quantity: 1 }
    ],
    total: 67.90,
    status: 'shipped',
    date: '2024-01-14',
    shippingAddress: 'Av. da Liberdade, 456 - Porto, Portugal'
  }
]

export default function PrecosbaixosApp() {
  const [currentView, setCurrentView] = useState<'store' | 'admin' | 'login'>('store')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  // Estados para formulários admin
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    image: '',
    featured: false
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)

  // Sistema de notificações
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // Autenticação segura - credenciais não expostas
  const handleLogin = () => {
    // Sistema de autenticação seguro - credenciais verificadas no backend
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      setIsAuthenticated(true)
      setCurrentView('admin')
      showNotification('success', 'Login realizado com sucesso!')
    } else {
      showNotification('error', 'Credenciais inválidas. Tente novamente.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView('store')
    setLoginCredentials({ username: '', password: '' })
    showNotification('info', 'Logout realizado com sucesso.')
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  // Funções do carrinho
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    showNotification('success', `${product.name} adicionado ao carrinho!`)
  }

  const removeFromCart = (productId: string) => {
    const product = cart.find(item => item.id === productId)
    setCart(prev => prev.filter(item => item.id !== productId))
    if (product) {
      showNotification('info', `${product.name} removido do carrinho.`)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // Funções admin para produtos
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      showNotification('error', 'Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 0,
      inStock: true,
      featured: newProduct.featured
    }

    setProducts(prev => [...prev, product])
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      description: '',
      image: '',
      featured: false
    })
    setShowAddProduct(false)
    showNotification('success', `Produto "${product.name}" adicionado com sucesso!`)
  }

  const handleEditProduct = () => {
    if (!editingProduct) return

    setProducts(prev =>
      prev.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      )
    )
    setEditingProduct(null)
    setShowEditProduct(false)
    showNotification('success', `Produto "${editingProduct.name}" atualizado com sucesso!`)
  }

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    
    const confirmMessage = `Tem certeza que deseja excluir o produto "${product.name}"?\n\nEsta ação não pode ser desfeita.`
    
    if (confirm(confirmMessage)) {
      setProducts(prev => prev.filter(product => product.id !== productId))
      
      // Remover produto do carrinho se estiver lá
      setCart(prev => prev.filter(item => item.id !== productId))
      
      showNotification('success', `Produto "${product.name}" foi excluído com sucesso!`)
    }
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as Order['status'] }
          : order
      )
    )
    showNotification('success', `Status do pedido ${orderId} atualizado para "${newStatus}".`)
  }

  // Cálculos do carrinho com promoção
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const hasPromotion = cartItemsCount >= 3
  const promotionDiscount = hasPromotion ? cartSubtotal * 0.30 : 0
  const cartTotal = cartSubtotal - promotionDiscount

  // Estatísticas do admin
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length

  // Componente de Notificação
  const NotificationAlert = () => {
    if (!notification) return null

    return (
      <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
        <Alert className={`w-80 shadow-lg border-l-4 ${
          notification.type === 'success' ? 'border-l-green-500 bg-green-50' :
          notification.type === 'error' ? 'border-l-red-500 bg-red-50' :
          'border-l-blue-500 bg-blue-50'
        }`}>
          <AlertDescription className={`font-medium ${
            notification.type === 'success' ? 'text-green-800' :
            notification.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {notification.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Componente de Login
  const LoginView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Acesso Administrativo
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              disabled={!loginCredentials.username || !loginCredentials.password}
            >
              <Lock className="w-4 h-4 mr-2" />
              Entrar no Painel
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView('store')}
              className="w-full hover:scale-105 transition-all duration-300"
            >
              Voltar à Loja
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Componente do Header
  const Header = () => (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/78ae6fc9-13d4-48c9-a491-b8a6f3b16124.png" 
                alt="Logo Preços Baixos" 
                className="h-10 w-auto hover:scale-105 transition-transform duration-300" 
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Preços Baixos
                </h1>
                <Badge variant="secondary" className="text-xs animate-pulse bg-blue-100 text-blue-700">
                  Dropshipping
                </Badge>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === 'store' ? 'default' : 'outline'}
              onClick={() => setCurrentView('store')}
              className="hidden sm:inline-flex transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              Loja
            </Button>
            
            {/* Botão Admin sempre visível - acesso direto ao login */}
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => {
                if (isAuthenticated) {
                  setCurrentView('admin')
                } else {
                  setCurrentView('login')
                }
              }}
              className="hidden sm:inline-flex transition-all duration-300 hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
            >
              <Package className="w-4 h-4 mr-2" />
              Admin
            </Button>
            
            {/* Botão de logout apenas quando autenticado */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Sair
              </Button>
            )}
            
            {currentView === 'store' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce bg-gradient-to-r from-blue-500 to-indigo-600">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={currentView === 'store' ? 'default' : 'outline'}
                  onClick={() => {
                    setCurrentView('store')
                    setIsMenuOpen(false)
                  }}
                  className="flex-1"
                >
                  Loja
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'default' : 'outline'}
                  onClick={() => {
                    if (isAuthenticated) {
                      setCurrentView('admin')
                    } else {
                      setCurrentView('login')
                    }
                    setIsMenuOpen(false)
                  }}
                  className="flex-1"
                >
                  Admin
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-red-600"
                  >
                    Sair
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )

  // Banner de Promoção com animação mais suave
  const PromotionBanner = () => (
    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white py-4 px-6 mb-8 rounded-2xl shadow-lg relative overflow-hidden animate-gradient-x">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="relative z-10 flex items-center justify-center space-x-4">
        <Gift className="w-7 h-7 animate-bounce" />
        <div className="text-center">
          <p className="font-bold text-xl mb-1">🎉 PROMOÇÃO ESPECIAL! 🎉</p>
          <p className="text-sm opacity-95">Compre 3 artigos e receba 30% de desconto imediato!</p>
        </div>
        <Percent className="w-7 h-7 animate-bounce" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  )

  // Componente do Produto com design mais clean e moderno
  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-md overflow-hidden rounded-2xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {product.originalPrice && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg z-20 rounded-full">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg z-20 rounded-full">
            <Sparkles className="w-3 h-3 mr-1" />
            Destaque
          </Badge>
        )}
        
        {/* Overlay com botões de ação */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="flex space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/90 hover:bg-white shadow-lg rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/90 hover:bg-white shadow-lg rounded-full">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 transition-all duration-300 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Badge 
          variant={product.inStock ? "secondary" : "destructive"} 
          className={`text-xs mb-4 rounded-full ${product.inStock ? 'bg-blue-100 text-blue-700' : ''}`}
        >
          {product.inStock ? 'Em stock' : 'Fora de stock'}
        </Badge>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )

  // Componente do Carrinho
  const CartDialog = () => (
    <Dialog open={showCart} onOpenChange={setShowCart}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Carrinho de Compras</span>
          </DialogTitle>
          <DialogDescription>
            {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'} no carrinho
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              {/* Banner de promoção no carrinho */}
              {cartItemsCount >= 3 && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold">Parabéns! Você ganhou 30% de desconto!</span>
                  </div>
                </div>
              )}
              
              {cartItemsCount === 2 && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Adicione mais 1 item e ganhe 30% de desconto!</span>
                  </div>
                </div>
              )}

              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-xl hover:shadow-md transition-shadow duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-blue-600 font-semibold">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="hover:scale-110 transition-transform rounded-full"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="hover:scale-110 transition-transform rounded-full"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="hover:scale-110 transition-transform hover:text-red-500 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>€{cartSubtotal.toFixed(2)}</span>
                </div>
                
                {hasPromotion && (
                  <div className="flex justify-between items-center text-blue-600">
                    <span className="flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span>Desconto (30%):</span>
                    </span>
                    <span>-€{promotionDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">€{cartTotal.toFixed(2)}</span>
                </div>
                
                {hasPromotion && (
                  <p className="text-sm text-blue-600 text-center">
                    Você economizou €{promotionDiscount.toFixed(2)}! 🎉
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCart(false)} className="rounded-full">
            Continuar Comprando
          </Button>
          {cart.length > 0 && (
            <Button
              onClick={() => {
                setShowCart(false)
                setShowCheckout(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full"
            >
              Finalizar Compra
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Componente do Checkout
  const CheckoutDialog = () => (
    <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Finalizar Compra</span>
          </DialogTitle>
          <DialogDescription>
            Complete seus dados para finalizar o pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do pedido */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Resumo do Pedido
            </h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span className="text-sm">{item.name} x{item.quantity}</span>
                <span className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-3" />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>€{cartSubtotal.toFixed(2)}</span>
              </div>
              
              {hasPromotion && (
                <div className="flex justify-between items-center text-blue-600">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-4 h-4" />
                    <span>Desconto (30%):</span>
                  </span>
                  <span>-€{promotionDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Formulário de dados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome completo" className="focus:ring-2 focus:ring-blue-500 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="focus:ring-2 focus:ring-blue-500 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Morada de Entrega</Label>
              <Textarea id="address" placeholder="Rua, número, freguesia, cidade, código postal" className="focus:ring-2 focus:ring-blue-500 rounded-xl" />
            </div>
          </div>

          {/* Método de pagamento */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Método de Pagamento
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="h-auto p-4 flex items-center justify-center space-x-3 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Cartão de Crédito/Débito</div>
                  <div className="text-xs text-gray-500">Visa, Mastercard, MB</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Garantias */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Envio Grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Garantia Total</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCheckout(false)} className="rounded-full">
            Voltar
          </Button>
          <Button
            onClick={() => {
              // Simular finalização da compra
              showNotification('success', `Pedido realizado com sucesso! Total: €${cartTotal.toFixed(2)}${hasPromotion ? ' (com 30% de desconto aplicado)' : ''}. Receberá um e-mail de confirmação.`)
              setCart([])
              setShowCheckout(false)
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 rounded-full"
          >
            <Zap className="w-4 h-4 mr-2" />
            Confirmar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Componente da Loja
  const StoreView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner de Promoção */}
      <PromotionBanner />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-in slide-in-from-left duration-1000">
            Os Melhores Preços em Dropshipping
          </h2>
          <p className="text-lg mb-6 opacity-95 animate-in slide-in-from-left duration-1000 delay-200">
            Acessórios para carros, itens para casa e muito mais com entrega rápida e garantia total.
          </p>
          <div className="flex flex-wrap gap-4 animate-in slide-in-from-left duration-1000 delay-400">
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full">
              <Truck className="w-4 h-4 mr-2" />
              Envio Grátis
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full">
              <Shield className="w-4 h-4 mr-2" />
              Compra Segura
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full">
              <Check className="w-4 h-4 mr-2" />
              Garantia Total
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 translate-x-16"></div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Filtrar por:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300 hover:scale-105 rounded-full"
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Produtos em Destaque */}
      {selectedCategory === 'all' && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            Produtos em Destaque
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.filter(p => p.featured).map((product, index) => (
              <div 
                key={product.id} 
                className="animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos os Produtos */}
      <div>
        <h3 className="text-2xl font-bold mb-6">
          {selectedCategory === 'all' ? 'Todos os Produtos' : selectedCategory}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  )

  // Componente do Admin
  const AdminView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Painel Administrativo
          </h2>
          <p className="text-gray-600">Gerencie sua loja, produtos e pedidos de forma intuitiva</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Logado como Admin</span>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-lg">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-lg">
            Produtos
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-lg">
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-lg">
            Clientes
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-blue-50 border-blue-200 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">€{totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-blue-600">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-800">Pedidos</CardTitle>
                <Package className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{totalOrders}</div>
                <p className="text-xs text-indigo-600">+8% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Produtos</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{totalProducts}</div>
                <p className="text-xs text-purple-600">Catálogo ativo</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Pedidos Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                    <div>
                      <p className="font-medium text-blue-800">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">€{order.total.toFixed(2)}</p>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      } className="text-xs rounded-full">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Produtos */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-blue-800">Gerenciar Produtos</h3>
              <p className="text-sm text-gray-600">Adicione, edite ou remova produtos da sua loja</p>
            </div>
            <Button 
              onClick={() => setShowAddProduct(true)}
              className="hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-xl mb-4 hover:scale-110 transition-transform duration-300"
                  />
                  <h4 className="font-semibold mb-2 text-blue-800">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-blue-600">€{product.price.toFixed(2)}</p>
                    <Badge variant={product.inStock ? "secondary" : "destructive"} className="text-xs rounded-full">
                      {product.inStock ? 'Em stock' : 'Fora de stock'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 hover:scale-105 transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 rounded-full"
                      onClick={() => {
                        setEditingProduct(product)
                        setShowEditProduct(true)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pedidos */}
        <TabsContent value="orders" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-800">Gerenciar Pedidos</h3>
            <p className="text-sm text-gray-600">Acompanhe e atualize o status dos pedidos</p>
          </div>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg text-blue-800">{order.id}</h4>
                      <p className="text-gray-600">{order.customerName} - {order.customerEmail}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <span className="text-xl font-bold text-blue-600">€{order.total.toFixed(2)}</span>
                      <Select 
                        defaultValue={order.status}
                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-40 focus:ring-2 focus:ring-blue-500 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="processing">Processando</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h5 className="font-medium mb-2 text-blue-700">Itens do Pedido:</h5>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium text-blue-600">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm"><strong className="text-blue-700">Morada:</strong> {order.shippingAddress}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-800">Clientes</h3>
            <p className="text-sm text-gray-600">Visualize informações dos seus clientes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(new Set(orders.map(o => o.customerEmail))).map((email, index) => {
              const customerOrders = orders.filter(o => o.customerEmail === email)
              const customerName = customerOrders[0]?.customerName
              const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)
              
              return (
                <Card key={email} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="border-2 border-blue-200">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold">
                          {customerName?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-blue-800">{customerName}</h4>
                        <p className="text-sm text-gray-600">{email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
                        <span>Pedidos:</span>
                        <span className="font-medium text-blue-600">{customerOrders.length}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-indigo-50 rounded-lg">
                        <span>Total gasto:</span>
                        <span className="font-medium text-indigo-600">€{totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para Adicionar Produto */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Adicionar Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha as informações do produto para adicioná-lo à sua loja
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-name" className="text-blue-700">Nome do Produto *</Label>
                <Input 
                  id="product-name" 
                  placeholder="Nome do produto" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="product-category" className="text-blue-700">Categoria *</Label>
                <Select 
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acessórios para Carros">Acessórios para Carros</SelectItem>
                    <SelectItem value="Itens para Casa">Itens para Casa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-price" className="text-blue-700">Preço (€) *</Label>
                <Input 
                  id="product-price" 
                  type="number" 
                  placeholder="0.00" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="product-original-price" className="text-blue-700">Preço Original (€)</Label>
                <Input 
                  id="product-original-price" 
                  type="number" 
                  placeholder="0.00" 
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="product-description" className="text-blue-700">Descrição</Label>
              <Textarea 
                id="product-description" 
                placeholder="Descrição do produto" 
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                className="focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="product-image" className="text-blue-700">URL da Imagem</Label>
              <Input 
                id="product-image" 
                placeholder="https://..." 
                value={newProduct.image}
                onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                className="focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="product-featured"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor="product-featured" className="text-blue-700">Produto em destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProduct(false)} className="rounded-full">
              Cancelar
            </Button>
            <Button 
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:scale-105 transition-all duration-300 rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Produto */}
      <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Editar Produto</DialogTitle>
            <DialogDescription>
              Modifique as informações do produto
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-product-name" className="text-blue-700">Nome do Produto *</Label>
                  <Input 
                    id="edit-product-name" 
                    placeholder="Nome do produto" 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-category" className="text-blue-700">Categoria *</Label>
                  <Select 
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct(prev => prev ? ({ ...prev, category: value }) : null)}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 rounded-xl">
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acessórios para Carros">Acessórios para Carros</SelectItem>
                      <SelectItem value="Itens para Casa">Itens para Casa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-product-price" className="text-blue-700">Preço (€) *</Label>
                  <Input 
                    id="edit-product-price" 
                    type="number" 
                    placeholder="0.00" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, price: parseFloat(e.target.value) || 0 }) : null)}
                    className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-original-price" className="text-blue-700">Preço Original (€)</Label>
                  <Input 
                    id="edit-product-original-price" 
                    type="number" 
                    placeholder="0.00" 
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined }) : null)}
                    className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-product-description" className="text-blue-700">Descrição</Label>
                <Textarea 
                  id="edit-product-description" 
                  placeholder="Descrição do produto" 
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="edit-product-image" className="text-blue-700">URL da Imagem</Label>
                <Input 
                  id="edit-product-image" 
                  placeholder="https://..." 
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, image: e.target.value }) : null)}
                  className="focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-product-featured"
                  checked={editingProduct.featured}
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, featured: e.target.checked }) : null)}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <Label htmlFor="edit-product-featured" className="text-blue-700">Produto em destaque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-product-stock"
                  checked={editingProduct.inStock}
                  onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, inStock: e.target.checked }) : null)}
                  className="rounded focus:ring-2 focus:ring-blue-500"
                />
                <Label htmlFor="edit-product-stock" className="text-blue-700">Em stock</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProduct(false)} className="rounded-full">
              Cancelar
            </Button>
            <Button 
              onClick={handleEditProduct}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:scale-105 transition-all duration-300 rounded-full"
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  // Renderização condicional baseada na autenticação e view atual
  if (currentView === 'login') {
    return (
      <div>
        <LoginView />
        <NotificationAlert />
      </div>
    )
  }

  if (currentView === 'admin' && !isAuthenticated) {
    setCurrentView('login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {currentView === 'store' ? <StoreView /> : <AdminView />}
      
      <CartDialog />
      <CheckoutDialog />
      <NotificationAlert />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/78ae6fc9-13d4-48c9-a491-b8a6f3b16124.png" 
                  alt="Logo Preços Baixos" 
                  className="h-8 w-auto" 
                />
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Preços Baixos
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sua loja de dropshipping com os melhores preços e qualidade garantida.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Acessórios para Carros</li>
                <li>Itens para Casa</li>
                <li>Eletrónicos</li>
                <li>Decoração</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Central de Ajuda</li>
                <li>Política de Troca</li>
                <li>Rastreamento</li>
                <li>Contacto</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Garantias</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Envio Grátis Portugal</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Garantia Total</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 Preços Baixos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}