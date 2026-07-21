export type Tab = "profile" | "categories" | "items" |"qrcode";
export interface DashboardTabsProps {
  currentTab: Tab;
  children: React.ReactNode;
}