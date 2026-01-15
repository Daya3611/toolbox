"use client";

import React, { useState, useEffect } from "react";
import {
    Download,
    Copy,
    QrCode,
    Globe,
    Mail,
    Phone,
    MessageSquare,
    User,
    MapPin,
    Calendar,
    Settings,
} from "lucide-react";

const qrTypes = {
    text: { label: "Text", icon: MessageSquare },
    url: { label: "Website URL", icon: Globe },
    email: { label: "Email", icon: Mail },
    phone: { label: "Phone", icon: Phone },
    vcard: { label: "Contact", icon: User },
    location: { label: "Location", icon: MapPin },
    event: { label: "Event", icon: Calendar },
};

export default function QRCodeGenerator() {
    const [text, setText] = useState("");
    const [qrType, setQrType] = useState<keyof typeof qrTypes>("text");
    const [qrSize, setQrSize] = useState(256);
    const [errorLevel, setErrorLevel] = useState("M");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fgColor, setFgColor] = useState("#000000");
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const TypeIcon = qrTypes[qrType].icon;

    const formatText = () => {
        switch (qrType) {
            case "email":
                return `mailto:${text}`;
            case "phone":
                return `tel:${text}`;
            case "location": {
                const [lat, lng] = text.split(",");
                return `geo:${lat},${lng}`;
            }
            case "vcard":
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nEND:VCARD`;
            case "event":
                return `BEGIN:VEVENT\nSUMMARY:${text}\nEND:VEVENT`;
            default:
                return text;
        }
    };

    useEffect(() => {
        if (!text.trim()) {
            setQrCodeUrl("");
            return;
        }

        const t = setTimeout(() => {
            const data = encodeURIComponent(formatText());
            setQrCodeUrl(
                `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${data}&ecc=${errorLevel}&bgcolor=${bgColor.slice(
                    1
                )}&color=${fgColor.slice(1)}`
            );
        }, 400);

        return () => clearTimeout(t);
    }, [text, qrType, qrSize, errorLevel, bgColor, fgColor]);

    const downloadQRCode = async () => {
        if (!qrCodeUrl) return;

        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `qrcode_${qrType}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("QR download failed", err);
        }
    };


    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <QrCode className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">QR Code Generator</h2>
                    <p className="text-sm text-muted-foreground">
                        Generate QR codes for text, links, contacts, and more
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Controls */}
                <div className="rounded-lg border bg-background p-4 space-y-4">
                    {/* Type */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            QR Code Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(qrTypes).map(([key, type]) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setQrType(key as any)}
                                        className={`flex flex-col items-center gap-1 rounded-md border px-3 py-2 text-sm ${qrType === key
                                                ? "bg-muted border-primary"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Input */}
                    <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            Content
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring min-h-[90px]"
                            placeholder="Enter content"
                        />
                    </div>

                    {/* Advanced */}
                    <div className="rounded-md border p-3 space-y-3">
                        <div>
                            <label className="text-sm font-medium">
                                Size: {qrSize}px
                            </label>
                            <input
                                type="range"
                                min={128}
                                max={512}
                                step={32}
                                value={qrSize}
                                onChange={(e) => setQrSize(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Foreground</label>
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="w-full h-9"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Background</label>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-full h-9"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="rounded-lg border bg-background p-4 flex flex-col items-center justify-center">
                    {qrCodeUrl ? (
                        <>
                            <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="rounded-md border"
                                style={{ width: 220, height: 220 }}
                            />

                            <div className="grid grid-cols-2 gap-3 w-full mt-4">
                                <button
                                    onClick={downloadQRCode}
                                    className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                                    className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                            <QrCode className="h-10 w-10 opacity-40" />
                            Enter content to generate QR
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
