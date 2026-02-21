import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, ShieldCheck, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

interface ConnectShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (shopData: any) => void;
}

const ConnectShopModal: React.FC<ConnectShopModalProps> = ({ isOpen, onClose, onConnect }) => {
    const [step, setStep] = useState(1);
    const [platform, setPlatform] = useState<'Daraz' | 'Markaz'>('Daraz');
    const [sellerId, setSellerId] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const handleConnect = () => {
        setIsSyncing(true);
        // Simulate API Sync
        setTimeout(() => {
            setIsSyncing(false);
            setStep(3);
        }, 3000);
    };

    const finalize = () => {
        onConnect({
            id: sellerId,
            platform,
            shopName: "Wahab's Premium Store",
            rating: 4.8,
            items: [
                { id: 101, title: "Wireless Earbuds G2", price: 1250, marketPrice: 1100, stock: 12, velocity: 'High' },
                { id: 102, title: "Summer Cooler Fan", price: 3400, marketPrice: 3600, stock: 5, velocity: 'Medium' },
                { id: 103, title: "Cotton Polo Shirt", price: 850, marketPrice: 850, stock: 45, velocity: 'Low' }
            ]
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-400/20 dark:bg-slate-950/80 backdrop-blur-sm"
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="relative w-full max-w-lg glass-card p-8 shadow-2xl overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500">
                        <X className="w-5 h-5" />
                    </button>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Store className="text-blue-500 w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Connect Your Shop</h2>
                                <p className="text-slate-600 dark:text-slate-400">Sync your Daraz store with PakPick AI to get personalized market insights and inventory forecasting.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPlatform('Daraz')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${platform === 'Daraz' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="font-bold text-lg mb-1 text-[#0f172a] dark:text-white">Daraz</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Verified Integration</div>
                                </div>
                                <div
                                    onClick={() => setPlatform('Markaz')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${platform === 'Markaz' ? 'border-green-500 bg-green-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="font-bold text-lg mb-1 text-[#0f172a] dark:text-white">Markaz</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Coming Soon</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Input Seller ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. PK-12345678"
                                    value={sellerId}
                                    onChange={(e) => setSellerId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#0f172a] dark:text-white placeholder:text-slate-400"
                                />
                            </div>

                            <button
                                disabled={!sellerId}
                                onClick={() => setStep(2)}
                                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                Authenticate via Daraz API <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center py-8 space-y-6">
                            {isSyncing ? (
                                <>
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <RefreshCw className="absolute inset-0 m-auto w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Syncing Shop Inventory</h3>
                                        <p className="text-slate-600 dark:text-slate-400 px-8 text-sm">Our AI is fetching your active listings and comparing them with current 2026 market trends.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3 }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono tracking-widest text-left flex justify-between">
                                            <span>FETCHING_ITEMS...</span>
                                            <span>85%</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="text-blue-500 w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Permissions Required</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm px-4">PakPick AI requires read-only access to your seller center to analyze pricing and stock levels.</p>
                                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-left space-y-3">
                                        <div className="flex items-center text-xs text-blue-400 font-bold">
                                            <ShieldCheck className="w-4 h-4 mr-2" /> Data is Encrypted (AES-256)
                                        </div>
                                        <div className="flex items-center text-xs text-blue-400 font-bold">
                                            <ShieldCheck className="w-4 h-4 mr-2" /> No Access to Financial Payouts
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleConnect}
                                        className="w-full btn-primary py-4"
                                    >
                                        Authorize & Sync Data
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6 space-y-6">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-green-400 w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Shop Successfully Synced</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Your store data is now integrated with PakPick Intelligence. We found <span className="text-blue-400 font-bold">4 competitive gaps</span> in your listings.</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center space-x-4">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                    <Store className="text-orange-500 w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-[#0f172a] dark:text-white">Wahab's Premium Store</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Seller ID: {sellerId} • Status: Active</div>
                                </div>
                            </div>
                            <button
                                onClick={finalize}
                                className="w-full btn-primary py-4 bg-green-600 hover:bg-green-500 shadow-green-500/20"
                            >
                                Open Seller Intelligence View
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ConnectShopModal;
