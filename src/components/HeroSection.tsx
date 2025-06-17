'use client';

export default function HeroSection() {
  return (
    <div
      className="h-[350px] flex flex-col justify-center items-center text-white text-center p-5"
      style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://picsum.photos/1200/350') center/cover no-repeat",
      }}
    >
      {/* <div className="absolute inset-0 bg-black/30"></div> Optional: overlay using Tailwind */}
      <div className="text-xl md:text-[22px] font-light mb-5 z-10" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
        木々は春を追いかけずに待つ。その時が来るのを知っているから。
      </div>
      <button className="bg-white text-gray-800 rounded-full py-2 px-3 sm:px-4 text-xs sm:text-sm border-none cursor-pointer flex items-center z-10">
        <span>詳しく見る</span>
      </button>
    </div>
  );
}