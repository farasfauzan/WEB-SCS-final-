"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PartnerListPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    const res = await fetch(`/api/partners/${id}`, { method: "DELETE" });
    if (res.ok) fetchPartners();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <img src="/icons/partner.svg" alt="" className="w-5 h-5 text-[#004282]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Partners</h1>
              <p className="text-gray-500 text-sm mt-1">Manage partner/affiliate companies</p>
            </div>
          </div>
        </div>
        <Link href="/admin/partners/create" className="inline-flex items-center gap-2 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
          <img src="/icons/plus.svg" alt="" className="w-4 h-4 brightness-0 invert" />
          Add Partner
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-400 border border-gray-100">
            No partners yet. Add your first partner company.
          </div>
        ) : (
          partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain" />
                  ) : (
                    <img src="/icons/building.svg" alt="" className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{partner.name || "Unnamed Partner"}</h3>
                  {partner.linkUrl && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{partner.linkUrl}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
                <Link href={`/admin/partners/${partner.id}`} className="text-[#004282] hover:text-blue-700 text-sm font-medium">Edit</Link>
                <button onClick={() => handleDelete(partner.id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
