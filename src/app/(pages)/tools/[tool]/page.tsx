import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import Base64EncoderDecoder from "@/components/Base64EncoderDecoder";
import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";
import HashGenerator from "@/components/HashGenerator";
import ImgCompressor from "@/components/imgCompressor";
import JsonFormatter from "@/components/JsonFormatter";
import MarkdownEditor from "@/components/MarkdownEditor";
import PasswordGenerator from "@/components/PasswordGenerator";
import PdfConverter from "@/components/PdfConverter";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import TextSummarizer from "@/components/TextSummarizer";
import UnitConverter from "@/components/UnitConverter";
import UrlShortener from "@/components/UrlShortener";

// ✅ This is the right way to type a dynamic route in App Router
interface ToolPageProps {
  params: {
    tool: string;
  };
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  return {
    title: `${params.tool.replace(/-/g, " ")} | Tool`,
    description: `Use the ${params.tool.replace(/-/g, " ")} tool online.`,
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const { tool } = params;

  const renderTool = () => {
    switch (tool) {
      case "image-compressor":
        return <ImgCompressor />;
      case "text-summarizer":
        return <TextSummarizer />;
      case "qr-code-generator":
        return <QRCodeGenerator />;
      case "pdf-converter":
        return <PdfConverter />;
      case "password-generator":
        return <PasswordGenerator />;
      case "color-palette-generator":
        return <ColorPaletteGenerator />;
      case "json-formatter":
        return <JsonFormatter />;
      case "unit-converter":
        return <UnitConverter />;
      case "markdown-editor":
        return <MarkdownEditor />;
      case "url-shortener":
        return <UrlShortener />;
      case "hash-generator":
        return <HashGenerator />;
      case "base64-encoder-decoder":
        return <Base64EncoderDecoder />;
      default:
        notFound(); // use next/navigation to throw 404 page
    }
  };

  return <div className="">{renderTool()}</div>;
}
