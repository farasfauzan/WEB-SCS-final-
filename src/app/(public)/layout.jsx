import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotButton from "@/components/shared/ChatbotButton";
import { getAllSettings } from "@/lib/data";

export default async function PublicLayout({ children }) {
  const settings = await getAllSettings();

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
      <ChatbotButton settings={settings} />
    </div>
  );
}