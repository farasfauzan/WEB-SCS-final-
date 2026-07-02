// app/layout.js
import "./globals.css";

export const metadata = {
  title: "SCS Komersial Portal",
  description: "Landing Page & Dashboard CRUD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}