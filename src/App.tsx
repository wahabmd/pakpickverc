import React, { useState, useEffect } from 'react';
import { Search, ClipboardList, TrendingUp, ChevronRight, ChevronLeft, Sun, Moon, RefreshCw, Database, WifiOff, Heart, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ProductTable from './components/ProductTable';
import SurveyFlow from './components/SurveyFlow';
import ProductDetail from './components/ProductDetail';
import ComparisonView from './components/ComparisonView';
import ConnectShopModal from './components/ConnectShopModal';
import SellerDashboard from './components/SellerDashboard';
import { api } from './services/api';

// Types
type ViewState = 'landing' | 'keyword' | 'survey' | 'results' | 'detail' | 'comparison' | 'trends' | 'seller_dashboard' | 'watchlist';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<ViewState>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | number | null>(null);
  const [selectedCompareProducts, setSelectedCompareProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState('Live Scraping Engine');
  const [isExhibition, setIsExhibition] = useState(false);
  const [marketStats, setMarketStats] = useState<any>(null);
  const [trendingKeywords, setTrendingKeywords] = useState<any[]>([]);

  // Shop Connection State
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [connectedShopData, setConnectedShopData] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.getStats();
        setMarketStats(stats);
      } catch (e) {
        // console.error("Stats connect pending...", e);
      }
    };

    // Initial fetch
    fetchStats();
    fetchWatchlist();

    // Poll every 5 seconds to keep connection status live
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchWatchlist = async () => {
    try {
      const data = await api.getWatchlist();
      setWatchlist(data.results || []);
      setWatchlistIds(new Set((data.results || []).map((p: any) => String(p._id || p.id))));
    } catch (e) {
      console.error("Watchlist fetch error:", e);
    }
  };

  const handleToggleWatch = async (product: any) => {
    const id = String(product._id || product.id);
    try {
      if (watchlistIds.has(id)) {
        await api.removeFromWatchlist(id);
      } else {
        await api.addToWatchlist(product);
      }
      // Refresh local state
      fetchWatchlist();
    } catch (e) {
      console.error("Watchlist toggle error:", e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setView('results');
    try {
      const data = await api.search(searchQuery);
      setProducts(Array.isArray(data?.results) ? data.results : []);
      setDataSource(data.source || 'Live Scraping Engine');
      setIsExhibition(!!data.is_exhibition);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [trendType, setTrendType] = useState<'daily' | 'seasonal'>('daily');

  // ... (previous state declarations)

  const handleShowTrends = async (type: 'daily' | 'seasonal' = 'daily') => {
    setIsLoading(true);
    setView('trends');
    setTrendType(type);
    try {
      const data = await api.getTrends(type);
      setProducts(Array.isArray(data?.results) ? data.results : []);
      if (data.is_refreshing) setIsRefreshing(true);

      // Also fetch keywords for the dashboard
      const kwData = await api.getKeywords();
      setTrendingKeywords(kwData.keywords || []);
    } catch (error) {
      console.error("Trends error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshTrends = async () => {
    setIsRefreshing(true);
    try {
      await api.refreshTrends();

      // Setup interval to poll every 3 seconds for updates
      const pollInterval = setInterval(async () => {
        try {
          const data = await api.getTrends();
          if (Array.isArray(data?.results) && data.results.length > 0) {
            setProducts(data.results);
          }

          if (!data.is_refreshing) {
            setIsRefreshing(false);
            clearInterval(pollInterval);
          }
        } catch (pollError) {
          console.error("Polling error:", pollError);
          clearInterval(pollInterval);
          setIsRefreshing(false);
        }
      }, 3000);

      // Safety: clear interval after 2 minutes anyway
      setTimeout(() => clearInterval(pollInterval), 120000);

    } catch (error) {
      console.error("Initial refresh call error:", error);
      setIsRefreshing(false);
    }
  };

  const handleSurveyComplete = async (answers: any) => {
    setIsLoading(true);
    setView('results');
    try {
      // Map survey numeric keys to descriptive parameters
      const budget = answers[0] || 'medium';
      const category = answers[1] || 'electronics';
      const risk = answers[2] || 'med_risk';

      const data = await api.getRecommendations(budget, category, risk);
      setProducts(Array.isArray(data?.results) ? data.results : []);
      setDataSource(data.source || 'AI Recommendation Engine');
      setIsExhibition(!!data.is_personalized);
    } catch (error) {
      console.error("Survey error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSurveyCompleteWrapper = (answers: any) => {
    handleSurveyComplete(answers);
  };

  const handleCompareSelected = (items: any[]) => {
    setSelectedCompareProducts(items);
    setView('comparison');
  };

  const handleProductSelect = (id: string | number) => {
    setSelectedProductId(id);
    setView('detail');
  };

  const handleShowWatchlist = () => {
    fetchWatchlist();
    setView('watchlist');
  };

  const renderLanding = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* 1. Background Visuals (Mesh & Map) */}
      <div className="mesh-gradient">
        <div className="mesh-blob w-[600px] h-[600px] bg-blue-600/20 -top-20 -left-20 animate-blob-move" />
        <div className="mesh-blob w-[500px] h-[500px] bg-purple-600/10 top-1/2 -right-20 animate-blob-move [animation-delay:2s]" />
      </div>

      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 100 }}
        className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none pak-map-container"
      >
        <svg viewBox="280 340 120 160" className="w-[600px] md:w-[800px] pak-map-svg">
          <path
            className="pak-map-path"
            d="M339.7,351.4l-1.5,0.4l-3,4.4l-4,0.4l-0.7,0.7l1.5,5.2l-0.4,1.9l-2.6,3.3l-5.6,4.4l-2.6-0.4l-1.5,0.7l0,3l-3.3,4.1l-3.3,1.9l-5.2-1.5l-6.3-4.8l-1.5,1.1l-0.7,5.9l1.1,5.2l4.1,2.6l4.4,0.7l5.2-0.4l0.4,1.1l-0.4,11.1l-6.3,9.3l-5.6,0.7l-4.1,3.3l-1.5,3.7l0,4.4l3.3,3.7l5.2,1.5l3.3-1.1l1.1,1.5l-0.4,6.7l2.2,2.2l-0.4,3.7l-3.7,1.5l-2.6,4.4l-0.7,5.6l2.2,4.8l-0.7,4.4l2.6,1.5l0.4,2.2l-1.1,4.1l-3.7,3.3l-0.7,5.9l8.2,12.6l1.9-0.4l7,6.3l2.6-1.1l3,1.9l4.1-1.1l1.1,1.9l10,2.6l3.3,3.3l4.8-1.9l5.9,4.1l11.1-12.2l2.6,1.5l5.2-4.1l6.7,3.3l0.7,2.2l12.2-7.8l5.2-1.1l4.1,3.3h5.9l2.2-4.1l1.5,0.4l5.6-2.6l1.5,3.3l11.5-3.3l0.4-3.3l5.6-1.5l3.7,1.5l5.2-1.5l-0.7-3l2.2-0.7l3.3,1.1l4.1-4.1l-0.4-3.7l4.4-4.8l-0.7-3.7l1.5-0.7l-1.1-5.6l3-1.5l-1.5-6.7l-4.1-3l-0.4-1.9l1.9-3.3l4.4-1.1l-0.7-5.9l1.5-0.4l0-3.3l4.1-1.1l5.2,5.2l2.6-11.5l-0.7-4.4l3.7-10.4l1.1-12.2l4.8-10l12.6-9.6l3.7-5.6V354l-5.6-7.8l-1.9,1.1l-10-8.9l-4.8-8.2l-7.4-4.8l-6.7-1.1l-7.4,1.5L339.7,351.4z"
          />
        </svg>
      </motion.div>

      {/* 2. Hero Content */}
      <div className="relative z-10 text-center max-w-4xl pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
        >
          <div className="pulse-scan" />
          <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Live Market Intelligence 2.0</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="title-gradient">Hunt the Next</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Winning Product</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          PakPick AI analyzes millions of data points across Daraz and Markaz to reveal
          the highest-margin opportunities for Pakistani sellers.
        </motion.p>

        {/* 3. Action Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 w-full">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card-premium p-8 cursor-pointer group rounded-3xl"
            onClick={() => setView('keyword')}
          >
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Keyword Ingestion</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Deep-scrape specific niches to reveal hidden competitors and price gaps.
            </p>
            <div className="flex items-center text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
              Ingest Marketplace <ChevronRight className="ml-2 w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card-premium p-8 cursor-pointer group rounded-3xl border-purple-500/30"
            onClick={() => setView('survey')}
          >
            <div className="absolute top-4 right-4 bg-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-purple-600/40">
              Pro Choice
            </div>
            <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Smart Discovery</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI-driven survey to match products with your specific budget and scale.
            </p>
            <div className="flex items-center text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
              Launch AI Survey <ChevronRight className="ml-2 w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Market Pulse Ticker (Infinite Scroll) */}
      <div className="absolute bottom-0 w-full ticker-wrap">
        <div className="ticker">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="ticker-item flex items-center">
              <TrendingUp className="w-3 h-3 mr-2 text-green-500" />
              <span>{trendingKeywords[i % (trendingKeywords.length || 1)]?.keyword || "ELECTRONICS"}</span>
              <span className="ml-2 text-green-400 font-bold">+{Math.floor(Math.random() * 50)}%</span>
              <span className="mx-6 text-slate-700">|</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation Header */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => { setView('landing'); setProducts([]); }}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="nav-logo-text">PakPick AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="nav-link" onClick={() => setView('landing')}>Dashboard</a>
            <a href="#" className="nav-link" onClick={() => handleShowTrends('daily')}>Trends</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 nav-action-btn rounded-xl"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={handleShowWatchlist}
              className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${view === 'watchlist' ? 'bg-red-500/10 text-red-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title="My Watchlist"
            >
              <Heart className={`w-5 h-5 ${view === 'watchlist' ? 'fill-current' : ''}`} />
              <span className="hidden md:inline font-bold text-xs uppercase">Watchlist</span>
              {watchlist.length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {watchlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (connectedShopData) {
                  setView('seller_dashboard');
                } else {
                  setIsShopModalOpen(true);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
            >
              <Database className="w-4 h-4" />
              <span>{connectedShopData ? "Seller Dashboard" : "Connect Shop"}</span>
            </button>
          </div>
        </div>
      </nav>

      <ConnectShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        onConnect={(data) => {
          setConnectedShopData(data);
          setView('seller_dashboard');
        }}
      />

      <main className="pb-20 flex-1">
        <AnimatePresence mode="wait">
          {view === 'landing' && renderLanding()}
          {view === 'keyword' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto px-4 pt-20"
            >
              <button onClick={() => setView('landing')} className="mb-8 text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h2 className="text-3xl font-bold mb-8">Enter Keyword</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  className="input-styled"
                  placeholder="e.g. Wireless Earbuds, Kitchen Gadgets..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn-primary px-8"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </motion.div>
          )}
          {view === 'survey' && (
            <SurveyFlow onComplete={onSurveyCompleteWrapper} />
          )}
          {view === 'results' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 pt-24"
            >
              <button
                onClick={() => { setView('landing'); setProducts([]); }}
                className="mb-8 text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
              </button>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium">Scraping Agents are fetching live data...</p>
                </div>
              ) : (
                <ProductTable
                  products={products}
                  onProductSelect={handleProductSelect}
                  onCompareSelected={handleCompareSelected}
                  isExhibition={isExhibition}
                  source={dataSource}
                  watchlistIds={watchlistIds}
                  onToggleWatch={handleToggleWatch}
                />
              )}
            </motion.div>
          )}
          {view === 'detail' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto px-4 pt-24 pb-20"
            >
              <button onClick={() => setView('results')} className="mb-8 text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Results
              </button>
              {selectedProductId && <ProductDetail productId={selectedProductId} />}
            </motion.div>
          )}
          {view === 'comparison' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 pt-24 pb-20"
            >
              <ComparisonView
                products={selectedCompareProducts}
                onBack={() => setView('results')}
              />
            </motion.div>
          )}
          {view === 'seller_dashboard' && connectedShopData && (
            <div className="max-w-7xl mx-auto px-4 pt-12">
              <button
                onClick={() => setView('landing')}
                className="mb-8 text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
              </button>
              <SellerDashboard shopData={connectedShopData} watchlist={watchlist} />
            </div>
          )}
          {view === 'trends' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 pt-24"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setView('landing')}
                  className="text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
                <div className="text-right">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse mr-2">LIVE TRENDS</span>
                  <span className="text-sm text-slate-400">Deep Knowledge Base Analysis</span>
                </div>
              </div>

              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-bold title-gradient mb-2">Emerging Market Trends</h2>
                  <p className="text-slate-400 mb-6">Discovery Engine: Identify high-velocity products before they saturate.</p>

                  {/* Trend Type Toggle */}
                  <div className="inline-flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => handleShowTrends('daily')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${trendType === 'daily'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      🔥 Daily Viral
                    </button>
                    <button
                      onClick={() => handleShowTrends('seasonal')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${trendType === 'seasonal'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      🗓️ Seasonal Winners
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleRefreshTrends}
                  disabled={isRefreshing}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all h-fit ${isRefreshing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/30'
                    }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Deep Scan...' : 'Refresh Intelligence'}</span>
                </button>
              </div>

              {/* NEW: TRENDING KEYWORDS CLOUD */}
              {trendingKeywords.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-2" /> Top Search Keywords (Daraz Analytics)
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {trendingKeywords.map((kw, i) => (
                      <div key={i} className="glass-card px-4 py-3 flex items-center space-x-3 hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => { setSearchQuery(kw.keyword); handleSearch(); }}>
                        <div className="text-sm font-bold">{kw.keyword}</div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase">Growth</span>
                          <span className="text-[10px] text-green-400 font-bold">{kw.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium">AI is analyzing knowledge base for emerging trends...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-32 glass-card border-dashed">
                  {isRefreshing ? (
                    <>
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <h3 className="text-2xl font-bold mb-2">Agents are Scanning...</h3>
                      <p className="text-slate-400 max-w-md mx-auto">
                        We are currently probing Daraz and Markaz for newly trending products.
                        Results will appear here automatically in a few moments.
                      </p>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-2">Knowledge Base is Empty</h3>
                      <p className="text-slate-400 max-w-md mx-auto mb-8">
                        Our AI needs to ingest live market data to detect emerging trends. Click the button above to start the deep scan.
                      </p>
                      <button
                        onClick={handleRefreshTrends}
                        className="btn-primary"
                      >
                        Initialize Market Intelligence
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <ProductTable
                  products={products}
                  onProductSelect={handleProductSelect}
                  onCompareSelected={handleCompareSelected}
                  watchlistIds={watchlistIds}
                  onToggleWatch={handleToggleWatch}
                />
              )}
            </motion.div>
          )}
          {view === 'watchlist' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 pt-12"
            >
              <button
                onClick={() => setView('landing')}
                className="mb-8 text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
              </button>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center">
                  <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" /> My Smart Watchlist
                </h2>
                <p className="text-slate-500 font-medium">Tracking {watchlist.length} High-Potential Products</p>
              </div>

              {watchlist.length === 0 ? (
                <div className="text-center py-32 glass-card">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Watchlist is Empty</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Start following products from Search or Trends to track their performance here.
                  </p>
                  <button onClick={() => setView('landing')} className="btn-primary">Explore Products</button>
                </div>
              ) : (
                <ProductTable
                  products={watchlist}
                  onProductSelect={handleProductSelect}
                  onCompareSelected={handleCompareSelected}
                  watchlistIds={watchlistIds}
                  onToggleWatch={handleToggleWatch}
                  source="Personal Watchlist"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SYSTEM STATUS FOOTER */}
      <footer className="fixed bottom-0 w-full bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1.5 px-4 flex justify-between items-center text-[10px] md:text-xs z-40 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <Database className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400 font-medium hidden md:inline">Connection:</span>
            <span className={`font-bold flex items-center ${!marketStats ? 'text-red-500' :
              (marketStats.db_mode || '').includes('Cloud') ? 'text-green-500' :
                (marketStats.db_mode || '').includes('Local') ? 'text-blue-500' :
                  'text-red-500'
              }`}>
              {!marketStats ? (
                <WifiOff className="w-3 h-3 mr-1" />
              ) : (marketStats.db_mode || '').includes('Cloud') ? (
                <Database className="w-3 h-3 mr-1" />
              ) : (marketStats.db_mode || '').includes('Local') ? (
                <Database className="w-3 h-3 mr-1" />
              ) : (
                <WifiOff className="w-3 h-3 mr-1" />
              )}

              {!marketStats ? 'System Offline' :
                (marketStats.db_mode || '').includes('Cloud') ? 'Cloud Connected' :
                  (marketStats.db_mode || '').includes('Local') ? 'Local Database' :
                    marketStats.db_mode || 'Disconnected'}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 hidden md:block"></div>
          {marketStats?.last_sync && (
            <div className="hidden lg:flex items-center space-x-1.5 text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Last Sync: {new Date(marketStats.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${marketStats.sync_status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {marketStats.sync_status}
              </span>
            </div>
          )}
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 hidden lg:block"></div>
          <div className="hidden md:flex items-center space-x-1.5 text-slate-500">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Latency: 24ms</span>
          </div>
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-mono">
          PakPick AI v2.1 • <span className="hidden md:inline">FYP Project</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
