import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, LogOut, Menu, X, Plus, Minus, Trash2, 
  Heart, Star, Search, ArrowRight, CheckCircle, User, Mail, Edit2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
  updateProfile: (name: string, email: string) => void;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const AuthContext = createContext<AuthContextType | null>(null);
const CartContext = createContext<CartContextType | null>(null);

const products: Product[] = [
  {
    id: 1,
    name: "NeonForge Gaming PC",
    category: "Gaming PC",
    price: 1299,
    description: "High-performance RGB gaming rig with RTX 4070, i7 processor, and liquid cooling.",
    image: "https://picsum.photos/id/1015/400/300",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    category: "Headphones",
    price: 398,
    description: "Industry-leading noise cancelling wireless headphones with 30hr battery life.",
    image: "https://picsum.photos/id/106/400/300",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 3,
    name: "Razer BlackWidow V4",
    category: "Keyboard",
    price: 189,
    description: "Mechanical gaming keyboard with tactile switches and per-key RGB lighting.",
    image: "https://picsum.photos/id/160/400/300",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 4,
    name: "Logitech G Pro X Superlight",
    category: "Mouse",
    price: 129,
    description: "Ultra-lightweight wireless gaming mouse used by esports professionals.",
    image: "https://picsum.photos/id/201/400/300",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 5,
    name: "Samsung Odyssey G9",
    category: "Monitor",
    price: 899,
    description: "49-inch ultra-wide curved 240Hz gaming monitor with quantum mini-LED.",
    image: "https://picsum.photos/id/29/400/300",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 6,
    name: "MacBook Pro M3 Max",
    category: "Laptop",
    price: 2499,
    description: "16-inch powerhouse laptop with M3 Max chip, 48GB RAM and stunning display.",
    image: "https://picsum.photos/id/180/400/300",
    rating: 5.0,
    inStock: true,
  },
  {
    id: 7,
    name: "Anker 737 Power Bank",
    category: "Charger",
    price: 129,
    description: "Premium 24,000mAh power bank with 140W USB-C output for laptops.",
    image: "https://picsum.photos/id/48/400/300",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 8,
    name: "Bose QuietComfort Ultra",
    category: "Headphones",
    price: 429,
    description: "Premium over-ear headphones with immersive audio and spatial sound.",
    image: "https://picsum.photos/id/133/400/300",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 9,
    name: "Keychron Q1 Pro",
    category: "Keyboard",
    price: 179,
    description: "Wireless mechanical keyboard with QMK/VIA support and aluminum frame.",
    image: "https://picsum.photos/id/211/400/300",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 10,
    name: "LG UltraGear 27GP950",
    category: "Monitor",
    price: 649,
    description: "27-inch 4K Nano IPS gaming monitor with 160Hz refresh rate and 1ms response.",
    image: "https://picsum.photos/id/60/400/300",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 11,
    name: "DJI Mini 4 Pro Drone",
    category: "Accessories",
    price: 759,
    description: "Lightweight 4K HDR drone with omnidirectional obstacle sensing.",
    image: "https://picsum.photos/id/251/400/300",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 12,
    name: "Logitech G733 Lightspeed",
    category: "Headphones",
    price: 139,
    description: "Wireless RGB gaming headset with superior comfort and 20hr battery.",
    image: "https://picsum.photos/id/29/400/300",
    rating: 4.4,
    inStock: true,
  },
];

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'demo@gmail.com' && password === '123456') {
      const userData = { name: 'Alex Rivera', email };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, _password: string): boolean => {
    const userData = { name, email };
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const updateProfile = (name: string, email: string) => {
    const updatedUser = { name, email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('orders');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signup, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/orders', label: 'Orders' },
    { path: '/profile', label: 'Profile' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl tracking-tighter">TS</span>
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tighter text-white">TECH</span>
                <span className="font-bold text-2xl tracking-tighter text-cyan-400">SPHERE</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-cyan-400 ${location.pathname === item.path ? 'text-cyan-400' : 'text-zinc-400'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center w-10 h-10 hover:bg-zinc-900 rounded-xl transition-all group"
            >
              <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              {getTotalItems() > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {getTotalItems()}
                </motion.div>
              )}
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800 cursor-pointer hover:bg-zinc-900/50 rounded-xl px-3 py-2 transition-all" onClick={() => navigate('/profile')}>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="text-[10px] text-emerald-400 -mt-0.5">Online</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-xs font-bold ring-2 ring-offset-2 ring-offset-zinc-950 ring-violet-400">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              LOGOUT
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-t border-zinc-800"
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-sm">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 hover:bg-zinc-900 rounded-2xl text-zinc-300"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 hover:bg-zinc-900 rounded-2xl text-zinc-300 flex items-center gap-3"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
              </Link>
              <button
                onClick={handleLogout}
                className="py-3 px-4 hover:bg-zinc-900 rounded-2xl text-rose-400 flex items-center gap-3 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      let success = false;
      
      if (isLogin) {
        success = login(email, password);
        if (!success) {
          setError('Invalid credentials. Use demo@gmail.com / 123456');
        }
      } else {
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        success = signup(name, email, password);
      }

      setLoading(false);
      
      if (success) {
        navigate('/welcome');
      }
    }, 650);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 rounded-3xl mb-6 shadow-2xl shadow-violet-500/30">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-2">TECHSPHERE</h1>
          <p className="text-zinc-500">Premium technology marketplace</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex border-b border-zinc-800 mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${isLogin ? 'border-b-2 border-cyan-400 text-white' : 'text-zinc-400'}`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${!isLogin ? 'border-b-2 border-cyan-400 text-white' : 'text-zinc-400'}`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all"
                  placeholder="Alex Rivera"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all"
                placeholder="demo@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-1.5">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
              {isLogin && (
                <p className="mt-2 text-[10px] text-zinc-500">Demo: demo@gmail.com / 123456</p>
              )}
            </div>

            {error && (
              <div className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-zinc-950 hover:bg-white/90 disabled:opacity-70 font-semibold rounded-2xl text-sm tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.985]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  {isLogin ? 'SIGN IN SECURELY' : 'CREATE ACCOUNT'} 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

        </motion.div>

      </div>
    </div>
  );
};

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="text-center z-10"
      >
        <div className="mb-8 flex justify-center">
          <div className="px-8 py-2.5 rounded-3xl bg-white/5 border border-white/10 text-cyan-400 text-sm font-mono tracking-[3px]">WELCOME TO THE FUTURE</div>
        </div>
        
        <h1 className="text-[92px] font-black tracking-[-6px] text-white leading-none mb-2">
          HELLO,<br />{user?.name?.toUpperCase().split(' ')[0]}
        </h1>
        
        <p className="max-w-xs mx-auto text-xl text-zinc-400 mb-16">Your premium tech destination is ready</p>
        
        <div className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
          <div className="h-px w-12 bg-zinc-700"></div>
          REDIRECTING YOU
          <div className="h-px w-12 bg-zinc-700"></div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          rotate: [0, 360],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute bottom-12 right-12 text-[180px] opacity-10 pointer-events-none"
      >
        🌀
      </motion.div>
    </div>
  );
};

const CategoryFilter: React.FC<{
  selectedCategory: string;
  onSelect: (category: string) => void;
}> = ({ selectedCategory, onSelect }) => {
  const categories = ['All', 'Gaming PC', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Laptop', 'Charger', 'Accessories'];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-5 py-2 text-xs font-medium rounded-3xl transition-all whitespace-nowrap ${
            selectedCategory === cat 
              ? 'bg-white text-zinc-950 shadow-lg shadow-white/20' 
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}> = ({ product, onAddToCart, onQuickView }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition-all duration-300"
    >
      <div className="relative h-56 bg-black flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => onQuickView(product)}
            className="bg-black/70 hover:bg-black text-white p-2 rounded-2xl backdrop-blur-md transition-all"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black/70 text-[10px] px-3 py-1 rounded-3xl font-mono tracking-widest text-emerald-400">
          IN STOCK
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="font-semibold text-lg leading-none text-white">{product.name}</div>
            <div className="text-xs text-zinc-500 mt-1">{product.category}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-white">${product.price}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mt-3 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} 
            />
          ))}
          <span className="text-xs text-zinc-500 ml-1.5">{product.rating}</span>
        </div>
        
        <p className="text-xs text-zinc-400 line-clamp-2 mb-6 h-10">{product.description}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              addToCart(product);
              onAddToCart(product);
            }}
            className="flex-1 bg-white text-black hover:bg-amber-200 active:bg-white font-semibold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
          >
            ADD TO CART
          </button>
          
<button 
  onClick={() => onQuickView(product)}
  className="px-6 border border-zinc-700 hover:border-white text-white text-xs font-medium rounded-2xl transition-colors"
>
  VIEW
</button>        </div>
      </div>
    </motion.div>
  );
};

const ProductModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product || !isOpen) return null;

  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", bounce: 0.02, duration: 0.4 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
          >
            <div 
              className="bg-zinc-900 max-w-2xl w-full rounded-3xl overflow-hidden pointer-events-auto border border-zinc-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-5/12 bg-black p-8 relative">
                  <img 
                    src={product.image.replace('300', '600')} 
                    alt={product.name} 
                    className="w-full rounded-2xl shadow-2xl" 
                  />
                  <div className="absolute top-8 right-8 bg-emerald-400/90 text-emerald-950 text-xs font-bold px-4 py-1 rounded-3xl">IN STOCK</div>
                </div>
                
                <div className="md:w-7/12 p-8 flex flex-col">
                  <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
                    <X size={24} />
                  </button>
                  
                  <div className="uppercase text-xs tracking-[2px] text-cyan-400 mb-1">{product.category}</div>
                  <h2 className="text-3xl font-semibold text-white leading-none mb-2">{product.name}</h2>
                  
                  <div className="flex items-center gap-4 mt-2 mb-6">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="text-amber-400 w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-zinc-400">{product.rating} • 241 reviews</div>
                  </div>
                  
                  <div className="text-5xl font-semibold text-white mb-8">${product.price}</div>
                  
                  <p className="text-zinc-400 leading-relaxed text-[15px] mb-8 flex-1">
                    {product.description} This product has been carefully selected from the world's best manufacturers. 2-year international warranty included.
                  </p>
                  
                  <div className="flex gap-4 pt-6 border-t border-zinc-800">
                    <button 
                      onClick={() => {
                        addToCart(product);
                        onAddToCart(product);
                        setTimeout(onClose, 700);
                      }}
                      className="flex-1 py-4 bg-white text-black font-semibold rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> ADD TO CART
                    </button>
                    <button 
                      onClick={onClose}
                      className="flex-1 py-4 border border-zinc-700 text-white font-medium rounded-2xl"
                    >
                      MAYBE LATER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState('');
  const navigate = useNavigate();

  const featured = products.slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setToastProduct(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* HERO */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1016/2000/1200')] bg-cover opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
<div className="inline px-6 py-2 bg-white/10 text-white text-xs tracking-[4px] mb-6 rounded-3xl border border-white/20">
  NEW ARRIVALS • LIMITED STOCK
</div>          
          <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
            FUTURE.<br />DELIVERED.
          </h1>
          <p className="max-w-md mx-auto text-2xl text-zinc-400">Discover the latest in cutting-edge technology and gaming gear.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <motion.button 
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate('/shop')}
              className="px-10 py-6 bg-white text-xl font-semibold text-zinc-900 rounded-3xl flex items-center gap-3 group"
            >
              SHOP COLLECTION
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate('/about')}
              className="px-10 py-6 border border-white/40 hover:bg-white/5 text-white text-xl font-medium rounded-3xl"
            >
              LEARN MORE
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 flex flex-col items-center">
          <div className="text-[10px] tracking-widest text-white/40 mb-3">SCROLL TO EXPLORE</div>
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-px h-12 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <div className="uppercase text-xs tracking-widest text-cyan-400">EXPLORE BY CATEGORY</div>
            <h2 className="text-5xl font-semibold text-white tracking-tight">Popular Categories</h2>
          </div>
          <button onClick={() => navigate('/shop')} className="text-sm flex items-center gap-2 text-zinc-400 hover:text-white">
            BROWSE ALL <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Gaming PC', 'Headphones', 'Keyboard', 'Monitor'].map((cat, index) => (
            <motion.div
              key={cat}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/shop')}
              className="group bg-zinc-900 border border-zinc-800 hover:border-cyan-400 h-72 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
            >
              <div className="text-7xl mb-6 transition-all group-hover:scale-125">{['🖥️','🎧','⌨️','🖥️'][index]}</div>
              <div className="text-2xl font-medium text-white z-10">{cat}</div>
              <div className="text-xs text-zinc-500 mt-1">23 products</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-cyan-400 text-sm font-medium tracking-widest">THIS WEEK'S FAVORITES</div>
            <h3 className="text-5xl tracking-tighter font-semibold text-white">Featured Gear</h3>
          </div>
          <Link to="/shop" className="text-sm border-b border-white/40 pb-1 hover:border-white text-white flex items-center gap-2">
            VIEW ENTIRE COLLECTION →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
              onQuickView={() => {}} 
            />
          ))}
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="bg-zinc-900 py-8 border-t border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-16 gap-y-6 opacity-75 text-sm">
          <div className="flex items-center gap-4">
            <div className="text-emerald-400">✓</div>
            <div>2 YEAR WARRANTY</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-emerald-400">✓</div>
            <div>FREE SHIPPING OVER $150</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-emerald-400">✓</div>
            <div>30 DAY RETURNS</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-emerald-400">✓</div>
            <div>SECURE CHECKOUT</div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 right-6 bg-zinc-800 border border-emerald-400 text-emerald-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200]"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{toastProduct} added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProductName, setToastProductName] = useState('');
  
  const { addToCart } = useCart();
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCartWithToast = (product: Product) => {
    addToCart(product);
    setToastProductName(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <div className="bg-zinc-950 pt-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="font-mono uppercase text-xs text-teal-400 tracking-widest">MARKETPLACE</div>
            <h1 className="text-6xl font-bold text-white tracking-tighter">All Products</h1>
          </div>
          
          <div className="mt-6 md:mt-0 relative w-full md:w-80">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search headphones, mice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 pl-12 py-4 rounded-3xl text-sm focus:outline-none focus:border-cyan-400 placeholder:text-zinc-500"
            />
          </div>
        </div>

        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCartWithToast}
              onQuickView={handleQuickView} 
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            No products found matching your criteria.
          </div>
        )}
      </div>

      <ProductModal 
        product={selectedProduct} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onAddToCart={handleAddToCartWithToast}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed bottom-8 right-8 bg-emerald-600 text-white text-sm px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50"
          >
            <CheckCircle /> {toastProductName} added successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const completeOrder = () => {
    if (!formData.address || !formData.city) {
      alert("Please fill delivery information");
      return;
    }
    
    const newOrder: Order = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      items: [...cart],
      total: getTotalPrice(),
      status: 'Processing'
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
    
    setOrderSuccess(true);
    
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      setOrderSuccess(false);
      navigate('/orders');
    }, 1650);
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center max-w-xs">
          <div className="mx-auto w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8">
            🛍️
          </div>
          <h3 className="text-3xl font-medium mb-4 text-white">Your cart is empty</h3>
          <p className="text-zinc-400 mb-8">Looks like you haven't added any amazing tech to your cart yet.</p>
          <Link 
            to="/shop" 
            className="inline-block bg-white text-black px-10 py-4 rounded-3xl font-semibold"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-white">Your Cart</h1>
            <p className="text-zinc-400 mt-1">{cart.length} items • Ready for checkout</p>
          </div>
          <button onClick={() => navigate('/shop')} className="text-sm text-zinc-400 flex items-center gap-2 hover:text-white">
            ← CONTINUE SHOPPING
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-zinc-900 rounded-3xl p-6 flex gap-6 border border-zinc-800">
                <div className="w-28 h-28 bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div className="font-medium text-xl text-white pr-6">{item.name}</div>
                    <div className="font-mono text-right text-lg whitespace-nowrap"> ${(item.price * item.quantity).toFixed(0)}</div>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{item.category}</div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-zinc-700 rounded-2xl">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-800 rounded-l-2xl"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="px-6 font-mono text-sm tabular-nums">{item.quantity}</div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white active:bg-zinc-800 rounded-r-2xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
              <div className="text-sm font-medium tracking-wider text-zinc-400 mb-6">ORDER SUMMARY</div>
              
              <div className="flex justify-between text-sm mb-3">
                <span className="text-zinc-400">Subtotal</span>
                <span className="font-medium">${getTotalPrice()}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-sm mb-8 border-t border-zinc-700 pt-6">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-3xl">${getTotalPrice()}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full py-5 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-2xl text-sm tracking-widest hover:brightness-110 active:scale-[0.985] transition-all"
              >
                PROCEED TO CHECKOUT
              </button>
              
              <div className="text-[10px] text-center text-zinc-500 mt-8">SECURE CHECKOUT POWERED BY STRIPE</div>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4">
            <motion.div 
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              className="bg-zinc-900 w-full max-w-lg rounded-3xl overflow-hidden"
            >
              {!orderSuccess ? (
                <>
                  <div className="px-8 pt-8 pb-4">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-semibold text-3xl">Checkout</h3>
                      <button onClick={() => setShowCheckout(false)} className="text-zinc-400">
                        <X />
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-3">DELIVERY ADDRESS</label>
                        <input 
                          type="text" 
                          placeholder="123 Future Lane" 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="bg-black border border-zinc-700 w-full rounded-2xl px-6 py-4 text-white placeholder:text-zinc-600"
                        />
                        <input 
                          type="text" 
                          placeholder="San Francisco, CA" 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="mt-3 bg-black border border-zinc-700 w-full rounded-2xl px-6 py-4 text-white placeholder:text-zinc-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-zinc-400 mb-3">PAYMENT INFORMATION</label>
                        <div className="bg-black border border-zinc-700 rounded-2xl p-6 space-y-4">
                          <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242" 
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                            className="bg-transparent w-full outline-none text-white placeholder:text-zinc-600 text-lg font-light"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              type="text" 
                              placeholder="05 / 28" 
                              value={formData.expiry}
                              onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                              className="bg-transparent w-full outline-none text-white placeholder:text-zinc-600"
                            />
                            <input 
                              type="text" 
                              placeholder="424" 
                              value={formData.cvv}
                              onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                              className="bg-transparent w-full outline-none text-white placeholder:text-zinc-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black px-8 py-6 flex items-center justify-between border-t border-zinc-800">
                    <div>
                      <div className="text-xs text-zinc-400">TOTAL DUE TODAY</div>
                      <div className="text-3xl font-semibold text-white">${getTotalPrice()}</div>
                    </div>
                    <button 
                      onClick={completeOrder}
                      className="px-14 py-4 bg-white text-black font-semibold rounded-2xl"
                    >
                      PAY SECURELY
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-12 py-16 text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.6 }}
                    className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8"
                  >
                    <CheckCircle className="w-12 h-12 text-black" />
                  </motion.div>
                  <div className="text-4xl font-medium text-white mb-3">Order Confirmed!</div>
                  <p className="text-zinc-400">Thank you {user?.name}. Your gear is on the way.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold tracking-tighter text-white mb-2">Order History</h1>
        <p className="text-zinc-400 mb-12">Track the status of all your purchases</p>
        
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                  <div>
                    <div className="font-mono text-xs text-cyan-400">ORDER #{order.id}</div>
                    <div className="text-white text-xl mt-1">{new Date(order.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</div>
                  </div>
                  
                  <div className={`px-6 py-1.5 text-xs font-medium rounded-3xl mt-4 md:mt-0 inline-block self-start
                    ${order.status === 'Delivered' ? 'bg-emerald-400 text-black' : 
                      order.status === 'Shipped' ? 'bg-amber-400 text-black' : 'bg-blue-400 text-black'}`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-black/40 rounded-2xl p-4">
                      <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl" />
                      <div className="text-sm">
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-zinc-400 text-xs">Qty: {item.quantity}</div>
                        <div className="text-emerald-400 mt-3">${item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-between items-center text-sm">
                  <div className="text-zinc-400">TOTAL PAID</div>
                  <div className="text-4xl font-semibold text-white">${order.total}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-3xl py-20 text-center">
            <div className="text-6xl mb-6 opacity-40">📦</div>
            <div className="text-2xl text-white mb-2">No orders yet</div>
            <p className="text-zinc-500 max-w-xs mx-auto">When you complete your first purchase, it will show up here.</p>
<Link 
  to="/shop" 
  className="inline-block mt-8 text-sm text-white border border-zinc-700 px-7 py-3.5 rounded-3xl hover:bg-white hover:text-black transition-colors"
>
  BROWSE PRODUCTS
</Link>          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => (
  <div className="bg-zinc-950 text-white min-h-screen py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <div className="font-mono text-xs text-violet-400 mb-4">EST 2021 • EARTH</div>
          <h1 className="text-7xl font-black tracking-tighter leading-none">We are obsessed with the future of technology.</h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
        >
          <div className="text-cyan-400 text-sm font-medium tracking-widest mb-4">OUR MISSION</div>
          <p className="text-zinc-300 text-lg leading-relaxed mb-6">
            Bringing cutting-edge technology to enthusiasts and professionals worldwide. We believe everyone deserves access to premium tech that enhances their digital experience.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">2021</div>
              <div className="text-xs text-zinc-500 mt-1">Founded</div>
            </div>
            <div className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-xs text-zinc-500 mt-1">Countries</div>
            </div>
            <div className="flex-1 bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-xs text-zinc-500 mt-1">Tech Brands</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="prose prose-invert mt-16 max-w-none text-lg">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
          <div>
            <div className="text-cyan-400 text-sm mb-6 tracking-widest">OUR PROMISE</div>
            <ul className="space-y-8 text-lg">
              <li className="flex gap-4">🌍 Curated selection from the world's most innovative brands</li>
              <li className="flex gap-4">🔬 Tested and reviewed by industry experts</li>
              <li className="flex gap-4">🚀 Lightning fast worldwide shipping</li>
            </ul>
          </div>
          <div className="text-zinc-400 leading-relaxed">
            From the bleeding edge gaming PCs to audiophile headphones and productivity tools, we bring you the best of modern technology. 
            Our team of engineers and product experts test every device before it makes it to our catalog.
          </div>
        </div>
      </div>
      
      {/* Featured Stats Section */}
      <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl font-black text-cyan-400 mb-2">50K+</div>
          <div className="text-zinc-400 text-sm">Happy Customers</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl font-black text-violet-400 mb-2">500+</div>
          <div className="text-zinc-400 text-sm">Premium Products</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl font-black text-fuchsia-400 mb-2">24/7</div>
          <div className="text-zinc-400 text-sm">Expert Support</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center"
        >
          <div className="text-5xl font-black text-emerald-400 mb-2">99%</div>
          <div className="text-zinc-400 text-sm">Satisfaction Rate</div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-32">
        <div className="text-center mb-16">
          <div className="text-cyan-400 text-sm font-medium tracking-widest mb-3">WHY TECHSPHERE</div>
          <h2 className="text-5xl font-bold tracking-tighter">Why Customers Choose Us</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bg-zinc-900 border border-zinc-800 hover:border-cyan-400/30 rounded-3xl p-8 transition-all duration-300"
          >
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Quality Guaranteed</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every product undergoes rigorous quality testing. We partner only with certified manufacturers and provide comprehensive warranties on all items.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-zinc-900 border border-zinc-800 hover:border-violet-400/30 rounded-3xl p-8 transition-all duration-300"
          >
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Fast Delivery</h3>
            <p className="text-zinc-400 leading-relaxed">
              Express shipping worldwide with real-time tracking. Most orders ship within 24 hours. Free delivery on orders over $150.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-zinc-900 border border-zinc-800 hover:border-fuchsia-400/30 rounded-3xl p-8 transition-all duration-300"
          >
            <div className="text-5xl mb-6">💎</div>
            <h3 className="text-2xl font-semibold text-white mb-4">Premium Selection</h3>
            <p className="text-zinc-400 leading-relaxed">
              Hand-picked products from top brands like Sony, Razer, Logitech, Apple, and Samsung. Only the best makes it to our store.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Brands We Carry */}
      <div className="mt-32">
        <div className="text-center mb-12">
          <div className="text-violet-400 text-sm font-medium tracking-widest mb-3">TRUSTED BRANDS</div>
          <h2 className="text-4xl font-bold tracking-tighter mb-8">Brands We Carry</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8 opacity-60">
          {['SONY', 'RAZER', 'LOGITECH', 'APPLE', 'SAMSUNG', 'BOSE', 'NVIDIA', 'AMD'].map((brand, index) => (
            <motion.div
              key={brand}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl text-zinc-400 font-semibold tracking-wider"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="h-px bg-white/10 my-20"></div>
      
      <div className="flex justify-center">
      </div>
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-20 text-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-cyan-400 font-medium">HAVE QUESTIONS?</div>
          <h2 className="text-6xl font-bold tracking-tighter mt-3">Get in touch with us</h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <input type="text" placeholder="First name" className="bg-zinc-900 border border-zinc-700 w-full py-5 px-7 rounded-3xl" required />
              </div>
              <div>
                <input type="text" placeholder="Last name" className="bg-zinc-900 border border-zinc-700 w-full py-5 px-7 rounded-3xl" required />
              </div>
            </div>
            
            <input type="email" placeholder="you@domain.com" className="bg-zinc-900 border border-zinc-700 w-full py-5 px-7 rounded-3xl" required />
            
            <textarea 
              placeholder="How can we help you today?" 
              rows={7}
              className="bg-zinc-900 border border-zinc-700 w-full py-5 px-7 rounded-3xl resize-y"
              required
            ></textarea>
            
            <button 
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-white text-zinc-900 rounded-3xl active:bg-amber-100"
            >
              SEND MESSAGE
            </button>
          </form>
        ) : (
          <div className="bg-emerald-900/30 border border-emerald-400 h-80 rounded-3xl flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-6">✉️</div>
              <div className="text-3xl font-medium">Thank you.</div>
              <div className="text-emerald-300 mt-3">We will get back to you shortly.</div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-center mt-16 text-zinc-500">Or email us directly at hello@techsphere.store</div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      alert('Name and email are required');
      return;
    }
    updateProfile(name, email);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="font-mono uppercase text-xs text-cyan-400 tracking-widest mb-2">ACCOUNT SETTINGS</div>
          <h1 className="text-6xl font-bold tracking-tighter text-white">Your Profile</h1>
          <p className="text-zinc-400 mt-3 text-lg">Manage your personal information and account details</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center sticky top-24">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full flex items-center justify-center text-5xl font-bold text-white mb-6 ring-4 ring-offset-4 ring-offset-zinc-950 ring-violet-400/50">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">{user?.name}</h2>
              <p className="text-zinc-400 text-sm mb-6">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Account Active
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-zinc-800">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Personal Information</h3>
                  <p className="text-zinc-400 text-sm mt-1">Update your personal details</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-white/90 font-semibold rounded-2xl text-sm transition-all active:scale-[0.985]"
                  >
                    <Edit2 className="w-4 h-4" />
                    EDIT
                  </button>
                )}
              </div>

              <div className="p-8 space-y-8">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 mb-3">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 outline-none transition-all text-lg"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-lg">
                      {user?.name}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 mb-3">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 outline-none transition-all text-lg"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-lg">
                      {user?.email}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 pt-4"
                  >
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-violet-500 text-zinc-950 font-semibold rounded-2xl text-sm tracking-widest hover:brightness-110 active:scale-[0.985] transition-all"
                    >
                      <Save className="w-4 h-4" />
                      SAVE CHANGES
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-8 py-4 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 font-medium rounded-2xl text-sm transition-all"
                    >
                      CANCEL
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                  <div className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Total Orders</div>
                  <div className="text-3xl font-bold text-white">0</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                  <div className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Cart Items</div>
                  <div className="text-3xl font-bold text-cyan-400">0</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 col-span-2 md:col-span-1">
                  <div className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Member Since</div>
                  <div className="text-lg font-semibold text-violet-400">Today</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 right-6 bg-zinc-800 border border-emerald-400 text-emerald-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200]"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/welcome" element={isLoggedIn ? <WelcomePage /> : <Navigate to="/login" />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/shop" element={isLoggedIn ? <ShopPage /> : <Navigate to="/login" />} />
        <Route path="/cart" element={isLoggedIn ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/about" element={isLoggedIn ? <AboutPage /> : <Navigate to="/login" />} />
        <Route path="/contact" element={isLoggedIn ? <ContactPage /> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
