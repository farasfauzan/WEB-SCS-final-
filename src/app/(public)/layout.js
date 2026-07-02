// app/(public)/layout.js
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white p-4 border-b font-bold text-blue-900">
        SCS Navbar Temporary
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}