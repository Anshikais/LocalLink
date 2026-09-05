import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, X, Smartphone, Banknote } from 'lucide-react';

export default function PaymentModal({
  isOpen,
  bookingData,
  onPaymentSuccess,
  onClose
}) {
  const [method, setMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !bookingData) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        {completed ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-500">Your booking has been submitted to the provider.</p>
          </div>
        ) : (
          <>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                Checkout Simulation
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Confirm Booking Payment</h3>
              <p className="text-xs text-slate-500 mt-0.5">Service: {bookingData.serviceName}</p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Service Base Price</span>
                <span className="font-semibold text-slate-800">₹{bookingData.price}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Platform Guarantee</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-sky-700">₹{bookingData.price}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Select Payment Option</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    method === 'upi' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-sky-600" />
                  <span>UPI / GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    method === 'card' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('cash')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    method === 'cash' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-sky-600" />
                  <span>Pay After Work</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Encrypted mock transaction. No real money will be charged.</span>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Processing Payment...</span>
              ) : (
                <span>Pay ₹{bookingData.price} & Complete Request</span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
