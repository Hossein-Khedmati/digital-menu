import { IconBuildingStore, IconLayoutGrid, IconQrcode, IconToolsKitchen3 } from "@tabler/icons-react";

export const tabs = [
  { key: "profile", label: "پروفایل", icon: IconBuildingStore },
  { key: "categories", label: "دسته‌بندی‌ها", icon: IconLayoutGrid },
  { key: "items", label: "آیتم‌های منو", icon: IconToolsKitchen3 },
  { key: "qrcode", label: "بارکد اختصاصی", icon: IconQrcode },
] as const;
