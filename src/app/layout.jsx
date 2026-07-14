import { Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { cldAsset } from "@/lib/cloudinary";

// Definisi font Google (Opsional jika Anda ingin menggunakannya melalui Next/Font)
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const FAVICON_URL = cldAsset("/logo-scs.svg");

export const metadata = {
  title: {
    default: "PT Sinar Cerah Sempurna | Perusahaan Konstruksi & Infrastruktur",
    template: "%s | PT Sinar Cerah Sempurna"
  },
  description: "Perusahaan konstruksi dan infrastruktur terpercaya di Indonesia dengan komitmen tinggi pada kualitas, integritas, dan inovasi.",
  icons: {
    icon: [
      { url: FAVICON_URL, type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}