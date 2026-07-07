import FadeUp from "@/components/ui/FadeUp";

export default function SinergiSection() {
  const networks = Array(4).fill({
    title: "PT Maharani Globalindo",
    desc: "perusahaan yang berbasis di Semarang dan bergerak dalam dua lini bisnis utama: jasa konstruksi berskala nasional dan penyelenggaraan perjalanan ibadah umrah"
  });

  return (
    <section className="w-full bg-[#F1F1F1] py-12 px-6 flex flex-col items-center">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-12 items-center">
        
        <FadeUp delay={0.1} className="text-center flex flex-col gap-4 max-w-3xl">
          <h2 className="text-black text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">Jejaring Sinergi Kami</h2>
          <p className="text-black text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
            Setiap unit bisnis kami bekerja dalam harmoni untuk memperkuat visi besar perusahaan. Melalui spesialisasi yang mendalam, kami menghadirkan solusi yang komprehensif bagi setiap tantangan konstruksi yang Anda hadapi.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-4">
          {networks.map((item, idx) => (
            <FadeUp key={idx} delay={0.2 + (idx * 0.1)} className="flex flex-col items-center gap-4 text-center">
              {/* Tempat meletakkan SVG logo sinergi nantinya */}
              <div className="w-32 h-32 bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                <img src={`https://placehold.co/128x128`} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-black text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">{item.title}</h3>
              <p className="text-black text-sm font-normal font-['Plus_Jakarta_Sans']">{item.desc}</p>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}