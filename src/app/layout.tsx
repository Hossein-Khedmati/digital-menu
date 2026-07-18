import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | منوی دیجیتال",
    default: "منوی دیجیتال رستوران",
  },
  description: "پلتفرم منوی دیجیتال هوشمند برای رستوران‌ها",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 16,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-vazir), system-ui",
              direction: "rtl",
              borderRadius: "16px",
              padding: "12px 16px",
              fontSize: "14px",
              maxWidth: "380px",
              border: "1px solid var(--ui-border)",
              background: "var(--ui-surface)",
              color: "var(--ui-text)",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            },

            success: {
              duration: 3000,
              style: {
                background: "var(--ui-surface)",
                border: "1px solid #bbf7d0",
                color: "var(--ui-text)",
              },
              iconTheme: {
                primary: "#16a34a",
                secondary: "#f0fdf4",
              },
            },

            error: {
              duration: 5000,
              style: {
                background: "var(--ui-surface)",
                border: "1px solid #fecaca",
                color: "var(--ui-text)",
              },
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fef2f2",
              },
            },

            loading: {
              style: {
                background: "var(--ui-surface)",
                border: "1px solid var(--ui-border)",
                color: "var(--ui-text)",
              },
              iconTheme: {
                primary: "var(--brand-color)",
                secondary: "var(--brand-color-subtle)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
