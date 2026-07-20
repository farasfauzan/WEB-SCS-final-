import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";

export default function VisiMisiSection() {
  const values = [
    {
      title: "Visi dan Kolaborasi",
      desc: "Dengan tekad, Idealisme, Antusiasme, Pengalaman, Kerja Keras dan Tim yang Solid, sehingga dapat maju berkembang dan dipercaya oleh pelanggan.",
      icon: "/logovisi1.svg",
    },
    {
      title: "Keahlian dan Praktik Berkelanjutan",
      desc: "Kami berkomitmen untuk memberikan hasil yang luar biasa dalam jangka waktu yang singkat dan menghemat biaya, dengan menggunakan metode dan praktik yang berkelanjutan.",
      icon: "/logovisi2.svg",
    },
    {
      title: "Nilai dan Fokus Pada Masa Depan",
      desc: "Dengan integritas, transparansi, dan pemahaman yang dalam tentang lingkungan bangunan, kami berkomitmen untuk membangun masa depan bersama Anda.",
      icon: "/logovisi3.svg",
    },
  ];

  return (
    <section className="w-full bg-[#F1F1F1] py-[clamp(3rem,8vh,6rem)] px-6 flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-[clamp(2.5rem,6vh,4rem)] items-center">
        <FadeUp
          delay={0.1}
          className="max-w-3xl text-center flex flex-col gap-4"
        >
          <h2 className="text-[#1E1E1E] text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
            Membangun Kualitas <br />
            Merajut Masa Depan
          </h2>
          <p className="text-[#757575] text-[13px] md:text-base font-normal font-['Plus_Jakarta_Sans'] leading-relaxed">
            Dengan Visi, Misi, semangat, dan pandangan jauh ke depan, kami
            menghadirkan bangunan transformatif yang tahan uji waktu. Setiap
            proyek mencerminkan komitmen kami terhadap kualitas, inovasi, dan
            nilai jangka panjang.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="w-full">
          <div className="bg-[#FFFFFF] rounded-3xl p-[clamp(1.5rem,4vw,3rem)] border border-[#E6E6E6] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {values.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-center gap-3 mb-1 md:mb-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shrink-0">
                    <CldImg
                      src={item.icon}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-[#1E1E1E] text-lg md:text-xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[#757575] text-[13px] md:text-sm font-normal font-['Plus_Jakarta_Sans'] leading-relaxed pl-10 md:pl-11">
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
