"use client";

import { useState, FormEvent } from "react";
import { IconSend, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 ml-2">نام و نام خانوادگی</label>
          <input
            type="text"
            required
            disabled={loading || success}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all disabled:opacity-50"
            placeholder="محمد احمدی"
          />
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 ml-2">ایمیل</label>
          <input
            type="email"
            required
            disabled={loading || success}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all disabled:opacity-50 ltr text-left direction-rtl"
            placeholder="name@example.com"
          />
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 ml-2">پیام / توضیحات</label>
        <textarea
          rows={4}
          required
          disabled={loading || success}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all resize-none disabled:opacity-50"
          placeholder="شرح مختصری درباره نیاز خود بنویسید..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || success}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 mt-2",
          success 
            ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default" 
            : "bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 active:translate-y-0"
        )}
      >
        {loading ? (
           <>
             <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             در حال ارسال...
           </>
        ) : success ? (
           <>
             <IconCheck size={20} />
             پیام شما ثبت شد!
           </>
        ) : (
           <>
             ارسال درخواست
             <IconSend size={18} className="-rotate-45" />
           </>
        )}
      </button>
    </form>
  );
}