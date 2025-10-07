// app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { UserProvider } from "@/context/userContext";

export const metadata: Metadata = {
  title: "ConSoft",
  description: "Aplicación Web desarrollada para Confort & Estilo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
