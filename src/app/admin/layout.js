// app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div className="bg-slate-100 min-h-screen p-4">
      <header className="mb-4 font-bold text-slate-700">SCS Dashboard Admin</header>
      <main>{children}</main>
    </div>
  );
}