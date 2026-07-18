"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  IconMapPin,
  IconSearch,
  IconCurrentLocation,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";

type Coords = { lat: number; lng: number };

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (coords: Coords) => void;
  initialCoords?: Coords | null;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

// ── تهران به عنوان مرکز پیش‌فرض ──
const DEFAULT_CENTER: Coords = { lat: 35.6892, lng: 51.389 };

export function MapPickerModal({
  open,
  onClose,
  onConfirm,
  initialCoords,
}: Props) {
  const [coords, setCoords] = useState<Coords>(initialCoords ?? DEFAULT_CENTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── load leaflet dynamically (SSR safe) ──
  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css" as any),
    ]).then(([L]) => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      // fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center = initialCoords ?? DEFAULT_CENTER;

      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // update coords when map moves
      map.on("moveend", () => {
        const c = map.getCenter();
        setCoords({ lat: +c.lat.toFixed(7), lng: +c.lng.toFixed(7) });
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, [open]);

  // ── cleanup on close ──
  useEffect(() => {
    if (!open && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open]);

  // ── fly to when initialCoords changes ──
  useEffect(() => {
    if (mapInstanceRef.current && initialCoords) {
      mapInstanceRef.current.flyTo([initialCoords.lat, initialCoords.lng], 15, {
        duration: 1,
      });
    }
  }, [initialCoords]);

  // ── search with debounce ──
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    searchTimeout.current && clearTimeout(searchTimeout.current);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=fa`,
          { headers: { "Accept-Language": "fa" } },
        );
        const data: NominatimResult[] = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  }, []);

  // ── fly to search result ──
  const flyTo = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1 });
    setSearchResults([]);
    setSearchQuery("");
  };

  // ── get user location ──
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        flyTo(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { timeout: 8000 },
    );
  };

  const handleConfirm = () => {
    onConfirm(coords);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <IconMapPin size={18} stroke={2} className="text-brand" />
            انتخاب موقعیت روی نقشه
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="p-0 space-y-0">
          {/* ── search bar ── */}
          <div className="px-5 py-3 border-b border-ui-border space-y-2">
            <div className="flex gap-2">
              {/* search input */}
              <div className="relative flex-1">
                <IconSearch
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-ui-text-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="جستجوی آدرس... مثال: تهران، ولیعصر"
                  className={cn(
                    "w-full h-9 pr-9 pl-3 rounded-xl",
                    "border border-ui-border bg-ui-surface",
                    "text-sm text-ui-text placeholder:text-ui-text-muted",
                    "focus:outline-none focus:ring-2 focus:ring-brand",
                    "focus:border-transparent transition-all duration-150",
                  )}
                />
                {isSearching && (
                  <IconLoader2
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2
                               text-ui-text-muted animate-spin"
                  />
                )}
              </div>

              {/* locate me */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLocateMe}
                loading={isLocating}
                className="shrink-0 h-9 px-3"
                title="موقعیت من"
              >
                <IconCurrentLocation size={15} stroke={2} />
                <span className="hidden sm:inline">موقعیت من</span>
              </Button>
            </div>

            {/* search results dropdown */}
            {searchResults.length > 0 && (
              <div
                className={cn(
                  "rounded-xl border border-ui-border",
                  "bg-ui-surface shadow-lg",
                  "overflow-hidden",
                )}
              >
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      flyTo(parseFloat(result.lat), parseFloat(result.lon))
                    }
                    className={cn(
                      "w-full text-right px-3 py-2.5",
                      "text-xs text-ui-text",
                      "hover:bg-ui-bg-muted transition-colors",
                      "flex items-start gap-2",
                      i !== 0 && "border-t border-ui-border",
                    )}
                  >
                    <IconMapPin
                      size={12}
                      className="text-brand shrink-0 mt-0.5"
                    />
                    <span className="truncate">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── map container ── */}
          <div className="relative">
            {/* map */}
            <div ref={mapRef} className="w-full" style={{ height: "360px" }} />

            {/* center pin — always in center of map */}
            <div
              className="absolute inset-0 flex items-center justify-center
                           pointer-events-none z-1000"
            >
              <div className="relative -mt-6">
                {/* pin */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center",
                    "rounded-full bg-brand shadow-lg shadow-brand/40",
                    "border-4 border-white dark:border-ui-surface",
                    "transition-transform duration-150",
                    mapReady && "animate-bounce-once",
                  )}
                >
                  <IconMapPin size={18} stroke={2.5} className="text-white" />
                </div>
                {/* shadow dot */}
                <div
                  className="mx-auto mt-1 h-1.5 w-4 rounded-full
                               bg-black/20 dark:bg-black/40 blur-sm"
                />
              </div>
            </div>

            {/* loading overlay */}
            {!mapReady && (
              <div
                className="absolute inset-0 flex items-center justify-center
                             bg-ui-bg-muted z-1001"
              >
                <div className="flex flex-col items-center gap-3">
                  <IconLoader2 size={28} className="animate-spin text-brand" />
                  <p className="text-sm text-ui-text-muted">
                    در حال بارگذاری نقشه...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── coords display ── */}
          <div
            className={cn(
              "flex items-center justify-between",
              "px-5 py-3 border-t border-ui-border",
              "bg-ui-bg-muted",
            )}
          >
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-ui-text-muted">
                عرض جغرافیایی:{" "}
                <span className="text-ui-text font-semibold">
                  {coords.lat.toFixed(5)}
                </span>
              </span>
              <span className="text-ui-text-muted">
                طول جغرافیایی:{" "}
                <span className="text-ui-text font-semibold">
                  {coords.lng.toFixed(5)}
                </span>
              </span>
            </div>
            <div
              className="h-2 w-2 rounded-full bg-green-500
                           animate-pulse shrink-0"
            />
          </div>
        </DialogBody>

        <DialogFooter className="px-5 pb-5 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!mapReady}>
            <IconCheck size={15} stroke={2} />
            تأیید موقعیت
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
