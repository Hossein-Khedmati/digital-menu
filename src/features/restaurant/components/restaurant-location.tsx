"use client";
import { Button } from "@/components/ui/button";
import { IconMapPin } from "@tabler/icons-react";

type Props = {
  lat: number;
  lng: number;
  name: string;
};

export function RestaurantLocation({ lat, lng, name }: Props) {
  const geoUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
  const fallbackGoogleUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const handleNavigation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (navigator.share) {
      e.preventDefault();
      try {
        await navigator.share({
          title: name,
          text: `مسیریابی به سمت ${name}`,
          url: fallbackGoogleUrl,
        });
      } catch (error) {
        window.open(fallbackGoogleUrl, "_blank");
      }
    } else {
      window.open(fallbackGoogleUrl, "_blank");
    }
  };

  return (
    <div className="flex items-center gap-2 ">
      <Button onClick={handleNavigation} className="max-sm:p-2.5 px-3">
        <IconMapPin />
        <span className="max-sm:hidden text-sm">مسیریابی</span>
      </Button>
    </div>
  );
}
