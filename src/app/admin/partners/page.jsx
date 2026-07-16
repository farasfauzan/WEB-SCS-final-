"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function PartnerListPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004282]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <CldImg src="/icons/partner.svg" alt="" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Partners</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage partner/affiliate companies
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">
            No partners yet.
          </div>
        ) : (
          partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {partner.logoUrl ? (
                    <CldImg
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <CldImg
                      src="/icons/building.svg"
                      alt=""
                      className="w-6 h-6"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {partner.name || "Unnamed Partner"}
                  </h3>
                  {partner.linkUrl && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {partner.linkUrl}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-gray-50">
                <Link
                  href={`/admin/partners/${partner.id}`}
                  className="inline-flex items-center gap-1.5 bg-[#004282] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
