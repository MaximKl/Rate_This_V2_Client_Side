interface FooterProps {
  isStaticPage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isStaticPage }) => {
  return (
    <div className={`absolute ${isStaticPage && 'bottom-0'} w-full`}>
      <div className="relative z-10 flex h-[48px] w-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 text-center">
        <div className="flex w-[30%] justify-center">
          <div className="w-fit truncate">
            <h1 className="truncate text-left text-sm text-slate-300">
              Застосунок розробив студент групи КНТ-19-2
            </h1>
            <h1 className="truncate pt-1 text-center text-sm text-slate-300">
              <span className="italic">Клішов Максим</span>
            </h1>
          </div>
        </div>
        <div className="w-[40%]"></div>
        <div className="flex w-[30%] justify-center">
          <div className="w-fit truncate">
            <h1 className="truncate text-left text-sm text-slate-300">
              Зв'язатися з розробником:
            </h1>
            <h1 className="truncate pt-1 text-center text-sm text-slate-300">
              <a href="mailto:maksym.klishov@nure.ua?subject=Відгук до RateThis">
                <span className=" cursor-pointer border-b-2">
                  maksym.klishov@nure.ua
                </span>
              </a>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Footer };
