import {
    Box,
    ArrowUpRight,
    Zap,
    ChevronRight,
    DollarSign,
    ShoppingBag,
    Target,
    BarChart3,
    Heart,
    TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SellerDashboardProps {
    shopData: any;
    watchlist?: any[];
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ shopData, watchlist = [] }) => {
    // Mock comparative data
    const marketComparisonData = [
        { name: 'Mon', shop: 4000, market: 3400 },
        { name: 'Tue', shop: 3000, market: 3200 },
        { name: 'Wed', shop: 2000, market: 2800 },
        { name: 'Thu', shop: 2780, market: 3908 },
        { name: 'Fri', shop: 1890, market: 4800 },
        { name: 'Sat', shop: 2390, market: 3800 },
        { name: 'Sun', shop: 3490, market: 4300 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Stats Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-600/5 p-6 rounded-3xl border border-blue-500/10">
                <div>
                    <h2 className="text-3xl font-black title-gradient mb-1">Seller Intelligence View</h2>
                    <p className="text-slate-500 text-sm">Real-time sync: <span className="text-blue-400 font-bold">{shopData.shopName}</span> on {shopData.platform}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 uppercase">Sync Active</span>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/20">
                        Refresh API Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">+12.5%</span>
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Orders (Weekly)</div>
                    <div className="text-2xl font-black">154</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 text-purple-400" />
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-bold">Good</span>
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Ad Spend Return (ROAS)</div>
                    <div className="text-2xl font-black">3.8x</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-orange-400" />
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Market Benchmark Info</div>
                    <div className="text-2xl font-black text-orange-400">-5.2%</div>
                    <div className="text-[9px] text-slate-500 mt-1 italic">Underperforming Market Avg.</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <Heart className="w-5 h-5 text-green-500" />
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold">SAVED</span>
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Watchlist Items</div>
                    <div className="text-2xl font-black">{watchlist.length}</div>
                    <div className="text-[9px] text-slate-500 mt-1 italic">High potential items tracked</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer 1: Performance vs Market */}
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold flex items-center">
                                <BarChart3 className="w-5 h-5 mr-3 text-blue-400" /> Shop vs Market Demand
                            </h3>
                            <p className="text-xs text-slate-500">Daily sales volume compared to category average</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketComparisonData}>
                                <defs>
                                    <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.getAttribute('data-theme') === 'light' ? '#e2e8f0' : '#1e293b'} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                                <YAxis stroke="#64748b" fontSize={10} hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#0f172a',
                                        border: '1px solid #1e293b',
                                        borderRadius: '12px',
                                        color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#ffffff'
                                    }}
                                />
                                <Area type="monotone" dataKey="shop" stroke="#3b82f6" fillOpacity={1} fill="url(#colorShop)" strokeWidth={3} />
                                <Area type="monotone" dataKey="market" stroke="#64748b" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start space-x-3 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                                AI Observation: "Your shop is seeing a decline during peak weekend hours (Fri-Sun) while the market is rising. This suggests a potential pricing or ad-visibility gap during high-traffic periods."
                            </p>
                        </div>
                    </div>
                </div>

                {/* VISUALIZER 2: INVENTORY WATCHLIST */}
                <div className="glass-card p-8 bg-white dark:bg-slate-900/40">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <Box className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" /> Smart Stock Watchlist
                    </h3>
                    <div className="space-y-4">
                        {shopData.items.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 group hover:border-blue-500/30 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500">IMG</div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">{item.title}</h4>
                                        <div className="text-[10px] text-slate-500">Market Price: Rs. {item.marketPrice} • Variance:
                                            <span className={item.price > item.marketPrice ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                                {((item.price - item.marketPrice) / item.marketPrice * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Current Stock</div>
                                        <div className={`font-black text-sm ${item.stock < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{item.stock} Units</div>
                                    </div>
                                    <button className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center border ${item.stock < 10 ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                        item.price > item.marketPrice ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' :
                                            'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                        }`}>
                                        {item.stock < 10 ? 'Urgent Restock' :
                                            item.price > item.marketPrice ? 'Price Fix' : 'Optimized'}
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* VISUALIZER 3: OPPORTUNITY HUNTER (From Watchlist) */}
                {watchlist.length > 0 && (
                    <div className="lg:col-span-2 glass-card p-8 border-t-4 border-t-green-500/30 bg-white dark:bg-slate-900/40">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-3 text-green-500" /> Opportunity Hunter
                                </h3>
                                <p className="text-xs text-slate-500">Tracked products with high market-gap potential (Potential Inventory)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {watchlist.slice(0, 3).map((item, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center group hover:border-green-500/30 transition-all">
                                    <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover mb-4" />
                                    <h4 className="font-bold text-sm text-[#0f172a] dark:text-white line-clamp-1 mb-2">{item.title}</h4>
                                    <div className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1">PKR {item.price}</div>
                                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                                        <span className="text-[8px] font-bold bg-green-500/10 text-green-600 px-2 py-1 rounded-full uppercase tracking-widest">{item.growth}</span>
                                        <span className="text-[8px] font-bold bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full uppercase tracking-widest">Score: {item.pos_score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION CENTER */}
            <div className="glass-card overflow-hidden bg-gradient-to-r from-blue-600/10 to-transparent border-blue-500/20 dark:border-blue-500/20">
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                            <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">AI Growth Playbook</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
                            We've analyzed 2,400+ data points across Daraz categories. Connect your Daraz Advertising token to automate your bids based on real-time market velocity.
                        </p>
                    </div>
                    <button className="w-full md:w-auto btn-primary bg-yellow-500 hover:bg-yellow-400 text-slate-900 border-none px-8 py-4 shadow-xl shadow-yellow-500/20 font-black flex items-center justify-center">
                        Activate AI Ad-Manager <ArrowUpRight className="ml-3 w-5 h-5" />
                    </button>
                </div>
            </div>
        </div >
    );
};

export default SellerDashboard;
