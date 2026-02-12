import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    ShoppingCart,
    CheckCircle2,
    Info,
    DollarSign,
    Globe,
    Truck
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';

import BusinessReportModal from './BusinessReportModal';

interface ProductDetailProps {
    productId: string | number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.getDetails(productId);
                setData(response);
            } catch (error) {
                console.error("Detail fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [productId]);

    const [customCost, setCustomCost] = useState<number>(0);
    const [calculatedProfit, setCalculatedProfit] = useState<any>(null);

    useEffect(() => {
        if (data?.analysis?.profit_estimate) {
            setCustomCost(data.analysis.profit_estimate.sourcing_cost);
            setCalculatedProfit(data.analysis.profit_estimate);
        }
    }, [data]);

    const handleCostChange = (val: string) => {
        const cost = parseFloat(val) || 0;
        setCustomCost(cost);

        // Dynamic Calculation logic (mirrors backend)
        const price = product?.price || 0;
        const commission = price * 0.12;
        const payment = price * 0.0125;
        const packaging = 30;
        const totalFees = commission + payment + packaging;
        const profit = price - cost - totalFees;
        const margin = (profit / price) * 100;

        setCalculatedProfit({
            fees: totalFees,
            profit: profit,
            margin: `${margin.toFixed(1)}%`,
            is_profitable: profit > 0
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Running Deep Analysis Models...</p>
            </div>
        );
    }

    const product = data?.product;
    const analysis = data?.analysis;

    if (!product || !analysis) {
        return <div className="text-center py-20 text-slate-500">Analysis data incomplete or unavailable for this item.</div>;
    }

    return (
        <div className="space-y-8">
            <BusinessReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                product={product}
                analysis={analysis}
            />

// Header Info
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3">
                    <img
                        src={product.image}
                        className="w-full aspect-square rounded-3xl object-cover glass-card shadow-lg"
                        alt="Product"
                    />
                </div>
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Top Seller</span>
                                <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">High Margin</span>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                                <button
                                    onClick={() => setShowReport(true)}
                                    className="flex-1 md:flex-none justify-center bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center transition shadow-lg whitespace-nowrap"
                                >
                                    <Globe className="w-3 h-3 mr-2" /> Business Case
                                </button>
                                {product.link && (
                                    <button
                                        onClick={() => window.open(product.link, '_blank')}
                                        className="flex-1 md:flex-none justify-center bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center transition shadow-lg whitespace-nowrap"
                                    >
                                        <ShoppingCart className="w-3 h-3 mr-2" /> Visit Store
                                    </button>
                                )}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 title-gradient transition-colors leading-tight">{product.title}</h1>
                        <p className="text-slate-500 dark:text-slate-300 text-base md:text-lg transition-colors">Market potential and demand analysis</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="glass-card p-4">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center">
                                <ShoppingCart className="w-3 h-3 mr-1" /> Est. Monthly Sales
                            </div>
                            <div className="text-2xl font-bold text-blue-400">{product.estimated_monthly_sales || '1,240'}+</div>
                            <div className="text-[10px] text-slate-500 mt-1">Based on {product.reviews || 0} reviews (Velocity Method)</div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center">
                                <Users className="w-3 h-3 mr-1" /> Market Fit
                            </div>
                            <div className="text-2xl font-bold text-orange-400">{analysis?.sentiment?.label || 'Stable'}</div>
                        </div>
                        <div className="glass-card p-4">
                            <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" /> Growth
                            </div>
                            <div className="text-2xl font-bold text-green-400">{analysis.forecast.monthly_growth_prediction}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                            <h4 className="flex items-center text-blue-400 font-bold mb-2">
                                <Info className="w-4 h-4 mr-2" /> AI Forecasting Insight
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Our ML models detect a <strong>{analysis.forecast?.confidence_score || '85%'}</strong> confidence
                                on the current consumer demand trend.
                                We recommend sourcing this for {product.platform} SEO strategies.
                            </p>
                        </div>
                        <div className={`p-6 border rounded-2xl ${analysis.sentiment?.label === 'High Demand' ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-500/5 border-slate-500/20'}`}>
                            <h4 className={`flex items-center font-bold mb-2 ${analysis.sentiment?.label === 'High Demand' ? 'text-green-400' : 'text-slate-400'}`}>
                                <Users className="w-4 h-4 mr-2" /> {analysis.sentiment?.label || 'Neutral'}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {analysis.sentiment?.advice || 'Market analysis in progress.'}
                            </p>
                        </div>
                    </div>

                    {/* NEW: DYNAMIC PROFIT CALCULATOR */}
                    <div className="glass-card overflow-hidden border-blue-500/30">
                        <div className="bg-blue-600/10 px-6 py-3 border-b border-blue-500/30 flex justify-between items-center">
                            <h3 className="font-bold flex items-center text-slate-900 dark:text-white">
                                <DollarSign className="w-4 h-4 mr-2 text-blue-400" /> Interactive Profit Calculator
                            </h3>
                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded font-bold">DARAZ FEES INCLUDED</span>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Your Sourcing Cost (Rs.)</label>
                                    <input
                                        type="number"
                                        value={customCost}
                                        onChange={(e) => handleCostChange(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Selling Price (Fixed)</label>
                                    <div className="text-lg font-bold py-1">Rs. {product.price}</div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-800 my-2"></div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Platform Fees</div>
                                    <div className="text-lg font-bold text-slate-400">Rs. {calculatedProfit?.fees || 0}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Net Profit</div>
                                    <div className={`text-lg font-bold ${calculatedProfit?.is_profitable ? 'text-green-400' : 'text-red-400'}`}>Rs. {calculatedProfit?.profit || 0}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">ROI / Margin</div>
                                    <div className={`text-xl font-black ${calculatedProfit?.is_profitable ? 'text-blue-400' : 'text-red-400'}`}>{calculatedProfit?.margin || '0%'}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Entry Risk</div>
                                    <div className="text-sm font-bold mt-1">
                                        <span className={`px-2 py-0.5 rounded ${product.competition_score > 70 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.competition_score > 70 ? 'Low Risk' : 'High Competition'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Market Demand (Past 20 Days + 7 Day Forecast)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analysis.sales_history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.2}
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 bg-slate-900/50">
                    <h3 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                        <Truck className="w-5 h-5 mr-3 text-purple-400" /> Sourcing Strategy Advisor
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4 p-4 rounded-xl btn-secondary border border-transparent">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-bold text-sm mb-1">Procurement Method: {analysis.sourcing?.type || 'N/A'}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{analysis.sourcing?.strategy || 'Analyzing best sourcing roadmap...'}</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Market Fit Checklist</h4>
                            {(analysis?.checklist || []).map((item: string, i: number) => (
                                <div key={i} className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
