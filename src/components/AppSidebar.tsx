"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Calendar, FileCode2, FileText, Home, ImageIcon, Inbox, Link2, QrCode, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

// Menu items with real routes
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Image Compressor",
    url: "/dashboard/image-compressor",
    icon: ImageIcon,
  },
  {
    title: "Champak Ai",
    url: "/dashboard/champak-ai",
    icon: Bot,
  },
  {
    title: "Qr Code Generator",
    url: "/dashboard/qr-code-generator",
    icon: QrCode,
  },
  {
    title: "Document Converter",
    url: "/dashboard/document-converter",
    icon: FileText,
  },
  {
    title: "URL Shortener",
    url: "/dashboard/url-shortener",
    icon: Link2,
  },
  {
    title: "Base64 Encoder Decoder",
    url: "/dashboard/base64-encoder-decoder",
    icon: FileCode2,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ToolBox</SidebarGroupLabel>
          <div className="flex flex-col justify-between gap-9">
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>           
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="m-2 flex items-center gap-2">
          <UserButton/>
          <span>
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
