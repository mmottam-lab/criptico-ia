import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Archivo 2030",
  description: "Criptico resuelto con IA. Licenciatura en Inteligencia Artificial, CENTRO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
