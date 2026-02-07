import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    ArrowLeftRight,
    TrendingUp,
    Users,
    ArrowRight,
    Zap
} from 'lucide-react';

interface ComparisonViewProps {
    products: any[];
    onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ products, onBack }) => {
    if (products.length === 0) return null;

    // Logic: If one is Daraz and one is Markaz, we do a "Price Gap" analysis
    const isInterPlatform = products.length === 2 &&
        ((products[0].platform === 'Daraz' && products[1].platform === 'Markaz') ||
            (products[0].platform === 'Markaz' && products[1].platform === 'Daraz'));

    const calculateProfitGap = () => {
        // Find best and worst prices regardless of platform name (to handle SERP/Web too)
        if (products.length < 2) return null;

        const sorted = [...products].sort((a, b) => {
            const pa = parseInt(String(a.price).replace(/[^0-9]/g, '')) || 0;
            const pb = parseInt(String(b.price).replace(/[^0-9]/g, '')) || 0;
            return pb - pa; // Highest price first
        });

        const high = sorted[0];
        const low = sorted[sorted.length - 1];

        const highPrice = parseInt(String(high.price).replace(/[^0-9]/g, '')) || 0;
        const lowPrice = parseInt(String(low.price).replace(/[^0-9]/g, '')) || 0;

        const gap = highPrice - lowPrice;
        const roi = (gap / lowPrice) * 100;

        return { gap, roi, high, low };
    };

    const profitData = calculateProfitGap();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold flex items-center">
                        <ArrowLeftRight className="mr-3 text-blue-500" /> Keemti Muqabla (Comparison)
                    </h2>
                    <p className="text-slate-400 mt-1">{products.length} products ka munafa check ho raha hai</p>
                </div>
                <button
                    onClick={onBack}
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Arbritrage Opportunity Card */}
            {isInterPlatform && profitData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block">Munafa Alert: Paisa Kamanay ka Mauqa</span>
                            <h3 className="text-2xl font-bold">Bara Profit Gap Mil Gaya!</h3>
                            <p className="text-slate-300 mt-2 max-w-lg text-lg">
                                Aap <strong>{profitData.low.platform}</strong> se sasta khareed kar <strong>{profitData.high.platform}</strong> par bech saktay hain.
                                Har ek item par taqreeban <strong className="text-green-400">PKR {profitData.gap.toLocaleString()}</strong> ka bachat/munafa hoga.
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-4xl font-black text-green-400">+{profitData.roi.toFixed(1)}%</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Har Item pe Munafa (ROI)</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {products.map((p, idx) => (
                    <motion.div
                        key={p._id || p.id}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card overflow-hidden group hover:border-blue-500/50 transition-all border-t-4 border-t-blue-500/30"
                    >
                        <div className="h-48 relative">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${p.platform === 'Daraz' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                                    }`}>
                                    {p.platform} Shop
                                </span>
                                <h4 className="text-xl font-bold text-white mt-2 line-clamp-1">{p.title}</h4>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Abhi ki Keemat (Price)</span>
                                <span className="text-2xl font-black text-white">PKR {p.price}</span>
                            </div>

                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <div className="flex items-center text-slate-500 font-bold uppercase text-[10px]">
                                    <Users className="w-3 h-3 mr-1" /> Log Kitna Pasand Kar Rahein?
                                </div>
                                <span className={`font-bold ${p.sentiment_label === 'High Demand' ? 'text-green-400' : 'text-blue-400'
                                    }`}>
                                    {p.sentiment_label === 'High Demand' ? 'Bohat Zyada Demand' : (p.sentiment_label || 'Achi Demand')}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <div className="flex items-center text-slate-500 font-bold uppercase text-[10px]">
                                    <TrendingUp className="w-3 h-3 mr-1" /> Agay Barhnay ka Chance
                                </div>
                                <span className="text-green-400 font-bold">{p.growth || '+12%'} Tezi se</span>
                            </div>

                            <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <strong>AI Mashwara:</strong> {p.advice || 'Is item ki market stable hai, bechnay ke liye acha option hai.'}
                                </p>
                            </div>

                            <button
                                onClick={() => p.link && window.open(p.link, '_blank')}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2"
                            >
                                <span>Dukan Par Jayein (Store)</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {products.length === 1 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                    <p className="text-slate-500">Add a second product from search results to enable smart arbitrage analysis.</p>
                </div>
            )}
        </div>
    );
};

export default ComparisonView;
