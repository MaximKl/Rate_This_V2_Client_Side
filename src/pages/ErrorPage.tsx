import imagef from '../assets/sad.png';
const ErrorPage: React.FC = () => {
  return (
    <div className="flex h-[100%] w-full justify-center bg-slate-300 pt-[64px] pb-[48px]">
      <div className="flex items-center justify-center">
        <span className="w-fit select-none text-2xl font-bold text-slate-600/80 sm:text-8xl">
          ТАКОЇ СТОРНІКИ НЕ ІСНУЄ
        </span>
        <img
          alt="sad_face"
          src={imagef}
          className="center hidden h-fit w-fit scale-[0.5] opacity-20 grayscale lg:block"
        />
      </div>
    </div>
  );
};

export { ErrorPage };
