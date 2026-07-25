export default function Footer(){
  return (
    <footer className="mx-auto w-full max-w-[1040px] px-5 pb-[88px] pt-10 text-[13px] leading-[1.6] text-[#111110]/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-6">
        <p className="font-[500] tracking-[-0.01em]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#009E73]" aria-hidden /> alamost.com
          </span>
          <span className="mx-2 opacity-40">•</span> Built solo • free-tier static
        </p>
        <p className="text-[12px] opacity-70">Okabe-Ito safe • PNG client export • No tracking</p>
      </div>
    </footer>
  );
}
