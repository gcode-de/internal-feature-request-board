import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internal Feature Request Board",
  description: "Collect, prioritize, and discuss feature ideas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
