import FadeUp from "@/components/ui/FadeUp";

export default function VisiMisiSection() {
  const values = [
    { 
      title: "Visi dan Kolaborasi", 
      desc: "Dengan tekad, Idealisme, Antusiasme, Pengalaman, Kerja Keras dan Tim yang Solid, sehingga dapat maju berkembang dan dipercaya oleh pelanggan.",
      icon: "/logovisi1.svg"
    },
    { 
      title: "Keahlian dan Praktik Berkelanjutan", 
      desc: "Kami berkomitmen untuk memberikan hasil yang luar biasa dalam jangka waktu yang singkat dan menghemat biaya, dengan menggunakan metode dan praktik yang berkelanjutan.",
      icon: "/logovisi2.svg"
    },
    { 
      title: "Nilai dan Fokus Pada Masa Depan", 
      desc: "Dengan integritas, transparansi, dan pemahaman yang dalam tentang lingkungan bangunan, kami berkomitmen untuk membangun masa depan bersama Anda.",
      icon: "/logovisi3.svg"
    }
  ];

  return (
    <section className="w-full bg-[#F1F1F1] pt-24 pb-10 px-6 flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 items-center">
        
        <FadeUp delay={0.1} className="max-w-3xl text-center flex flex-col gap-4">
          <h2 className="text-[#1E1E1E] text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
            Membangun Kualitas <br/>Merajut Masa Depan
          </h2>
          <p className="text-[#757575] text-base font-normal font-['Plus_Jakarta_Sans'] leading-relaxed">
            Dengan Visi, Misi, semangat, dan pandangan jauh ke depan, kami menghadirkan bangunan transformatif yang tahan uji waktu. Setiap proyek mencerminkan komitmen kami terhadap kualitas, inovasi, dan nilai jangka panjang.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="w-full">
          <div className="bg-[#FFFFFF] rounded-3xl p-8 md:p-12 border border-[#E6E6E6] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  {/* Memanggil SVG logovisi dari public folder */}
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-[#1E1E1E] text-xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
                    {item.title}
                  </h3>
                </div>
                {/* Margin kiri disesuaikan agar teks rata dengan judul */}
                <p className="text-[#757575] text-sm font-normal font-['Plus_Jakarta_Sans'] leading-relaxed pl-11">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  );
}