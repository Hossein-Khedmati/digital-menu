import type { Metadata } from "next";
import LoginPage from "@/features/auth";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت",
  description: "ورود به پنل مدیریت منوی دیجیتال",
};

export default function Page() {
  return <LoginPage />;
}
