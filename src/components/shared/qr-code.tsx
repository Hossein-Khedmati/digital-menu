"use client";
import { QRCodeSVG as QrCode } from "qrcode.react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  value: string;
};

export function QRCodeCanvas({ value }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = async () => {
    if (qrRef.current) {
      try {
        const canvas = await html2canvas(qrRef.current);
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error downloading QR code:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="p-7 max-w-70 bg-brand rounded-3xl flex items-center justify-center flex-col gap-5"
        ref={qrRef}
      >
        <QrCode value={value} size={200} level={"H"} />
        <p className="text-center text-white">
          برای مشاهده منو و محصولات ما اسکن کنید.
        </p>
      </div>
      <Link
        href={value}
        className="text-ui-text-soft underline hover:scale-110 transition-all duration-200"
        target="_blank"
      >
        {value}
      </Link>
      <Button onClick={downloadQR} variant="default">
        دانلود QR
      </Button>
    </div>
  );
}
