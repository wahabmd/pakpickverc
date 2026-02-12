import { useState } from 'react';
import { ChevronRight, Filter, ChevronDown } from 'lucide-react';
import ProductGraph from './ProductGraph';

// Mock data generator for graphs
const generateData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        sales: Math.floor(Math.random() * 100) + 10,
    }));
};

const ProductTable = ({ products, onProductSelect, onCompareSelected, isExhibition, source }: {
    products: any[],
    onProductSelect: (id: string | number) => void,
    onCompareSelected: (items: any[]) => void,
    isExhibition?: boolean,
    source?: string
}) => {
    const [range, setRange] = useState('7d');
    const [isFiltering, setIsFiltering] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelection = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        const id = String(product._id || product.id);
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else if (newSelected.size < 4) newSelected.add(id); // Max 4 for comparison
        setSelectedIds(newSelected);
    };

    const handleRangeChange = (val: string) => {
        setIsFiltering(true);
        setRange(val);
        setTimeout(() => setIsFiltering(false), 800);
    };

    const handleCompare = () => {
        const selectedProducts = displayProducts.filter(p => selectedIds.has(String(p._id || p.id)));
        onCompareSelected(selectedProducts);
    };

    const displayProducts = products;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold">Search Results</h2>
                        {isExhibition && (
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">VERIFIED PERFORMANCE</span>
                        )}
                    </div>
                    <p className="text-slate-400">
                        {isExhibition ? (
                            <span className="text-blue-400 font-semibold flex items-center">
                                <ChevronRight className="w-3 h-3 mr-1" /> Deep Market Intelligence Active
                            </span>
                        ) : (
                            `Found ${displayProducts.length} trending products via ${source || 'Search Engine'}`
                        )}
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <select
                            value={range}
                            onChange={(e) => handleRangeChange(e.target.value)}
                            className="appearance-none btn-secondary border border-transparent rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    <button className="flex items-center space-x-2 btn-secondary px-4 py-2 rounded-lg text-sm transition">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className={`space-y-4 relative ${isFiltering ? 'opacity-50 pointer-events-none transition-opacity' : ''}`}>
                {isFiltering && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {displayProducts.length > 0 ? (
                    displayProducts.map((product) => (
                        <div
                            key={product.id || product._id}
                            className={`glass-card p-6 flex flex-col md:flex-row items-center group transition-all cursor-pointer border-l-4 ${selectedIds.has(String(product._id || product.id)) ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-transparent'
                                } hover:border-blue-500/50`}
                            onClick={() => onProductSelect(product._id || product.id)}
                        >
                            {/* Selection Checkbox */}
                            <div
                                onClick={(e) => toggleSelection(e, product)}
                                className={`w-6 h-6 mr-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedIds.has(String(product._id || product.id)) ? 'bg-blue-600 border-blue-600' : 'border-slate-700 hover:border-blue-500'
                                    }`}
                            >
                                {selectedIds.has(String(product._id || product.id)) && (
                                    <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full sm:w-24 h-48 sm:h-24 rounded-xl object-cover"
                                />
                                <div className="w-full sm:max-w-md">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${product.platform === 'Daraz' ? 'bg-orange-500/20 text-orange-400' :
                                            product.platform === 'AI Forecast' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {product.platform}
                                        </span>
                                        {product.is_prediction && (
                                            <span className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter">AI Prediction</span>
                                        )}
                                        <span className="text-slate-500 text-[10px] font-mono ml-auto sm:ml-0">ID: {String(product?._id || product?.id || 'N/A').substring(0, 6)}...</span>
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{product.title}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                        <div className="text-xl font-extrabold text-[#0f172a] dark:text-white">PKR {product.price}</div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {product.pos_score && (
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Comp:</span>
                                                    <span className={`text-sm font-bold ${product.competition_score > 70 ? 'text-green-400' : product.competition_score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{product.competition_score || 'N/A'}%</span>
                                                </div>
                                            )}
                                            {product.profit_estimate && (
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Margin:</span>
                                                    <span className="text-sm font-bold text-green-400">{product.profit_estimate.margin}</span>
                                                </div>
                                            )}
                                            {product.reviews !== undefined && (
                                                <div className="flex items-center space-x-1 sm:border-l border-slate-700 sm:pl-4">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Rev:</span>
                                                    <span className="text-sm font-bold text-blue-400">{product.reviews}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full md:w-auto px-0 md:px-8 mt-4 md:mt-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Growth Forecast</span>
                                    <span className="text-xs text-green-400">{product.growth || '+12.5%'}</span>
                                </div>
                                <ProductGraph data={product.salesTrend || generateData()} color={product.platform === 'Daraz' ? '#f97316' : '#22c55e'} />
                            </div>

                            <div className="mt-4 md:mt-0 md:pl-8 border-t md:border-t-0 md:border-l border-slate-800 flex flex-row md:flex-col items-center justify-center space-x-4 md:space-x-0 md:space-y-3 w-full md:w-auto pt-4 md:pt-0">
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Market Fit</div>
                                    <div className={`text-xs font-bold ${product.sentiment_label === 'High Demand' ? 'text-green-400' :
                                        product.sentiment_label === 'Stable Interest' ? 'text-blue-400' :
                                            'text-slate-300'
                                        }`}>{product.sentiment_label || 'Stable'}</div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onProductSelect(product._id || product.id);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-bold group"
                                >
                                    <span>Analyze</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center glass-card">
                        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-full mb-4">
                            <Filter className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Verified Market Data Found</h3>
                        <p className="text-slate-400 max-w-md">
                            Try adjusting your filters or search for a different niche.
                            Our AI only displays verified high-potential products.
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Compare Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto bg-blue-600 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between md:justify-center md:space-x-8 gap-3 md:gap-0 animate-in slide-in-from-bottom-10 backdrop-blur-sm bg-opacity-95">
                    <div className="text-white text-sm md:text-base text-center md:text-left">
                        <span className="font-bold">{selectedIds.size}</span> Products Selected
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <button
                            onClick={handleCompare}
                            className="flex-1 md:flex-none bg-white text-blue-600 px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-sm font-bold hover:bg-slate-100 transition shadow-lg whitespace-nowrap"
                        >
                            Compare
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 md:px-0 text-blue-100 hover:text-white transition text-sm font-medium"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
