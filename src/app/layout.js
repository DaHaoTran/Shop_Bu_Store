import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StoreProvider from "./providers/storeprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shopbu",
  description: "A shop website",
};

export default function RootLayout({ children }) {
  if(typeof window !== 'undefined') return null
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="page-container">
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  );
}
