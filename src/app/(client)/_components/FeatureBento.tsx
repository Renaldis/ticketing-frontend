import React from 'react';
import { Lock, Zap, QrCode } from 'lucide-react';

export const FeatureBento = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card rounded-2xl p-8 flex flex-col gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#e4e1ed]">Secure Inventory</h3>
          <p className="text-sm text-[#c7c4d7] leading-relaxed">
            Real-time cryptographic verification ensures every ticket is authentic and unique to you.
          </p>
        </div>

        <div className="premium-card rounded-2xl p-8 flex flex-col gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-[#03b5d3]/20 flex items-center justify-center text-[#4cd7f6]">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#e4e1ed]">Fast Checkout</h3>
          <p className="text-sm text-[#c7c4d7] leading-relaxed">
            One-click purchasing with integrated wallets. Skip the queue and secure your spot in seconds.
          </p>
        </div>

        <div className="premium-card rounded-2xl p-8 flex flex-col gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-[#b76dff]/20 flex items-center justify-center text-[#ddb7ff]">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#e4e1ed]">Instant Pass</h3>
          <p className="text-sm text-[#c7c4d7] leading-relaxed">
            Your dynamic QR code is generated instantly and updates live, preventing unauthorized duplication.
          </p>
        </div>
      </div>
    </section>
  );
};
