"use client";
import { Button } from "@/components/ui/button";
import { IconMapPin } from "@tabler/icons-react";

type Props = {
  lat: number;
  lng: number;
  name: string;
};

export function RestaurantLocation({ lat, lng, name }: Props) {
  const openGoogleMaps = () => {
    const query = `${lat},${lng}`;
    const url = `https://www.google.com/maps?q=${query}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={openGoogleMaps} className="max-sm:p-2.5 px-3">
        <IconMapPin size={20} />
        <span className="max-sm:hidden text-sm">مسیریابی</span>
      </Button>
    </div>
  );
}
