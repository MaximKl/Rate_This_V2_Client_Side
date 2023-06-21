import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RxCrossCircled } from 'react-icons/rx';

interface SureMessageProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  actionBar: React.ReactNode;
  elementName?: string;
  isReport?: boolean;
  message?: string;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
}
const SureMessage: React.FC<SureMessageProps> = ({
  onClose,
  actionBar,
  elementName,
  isReport,
  message,
  setMessage,
}) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    document.getElementById('root')?.classList.add('blur-sm');
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.getElementById('root')?.classList.remove('blur-sm');
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="">
      <div
        onClick={() => {
          onClose(false);
        }}
        className="fixed inset-0 z-40 bg-slate-700 opacity-80"
      ></div>
      <div
        className={`fixed inset-x-[30%] inset-y-[30%] z-40 h-fit min-w-fit rounded-lg bg-slate-300 p-6 shadow-lg shadow-black/30`}
      >
        <div className="relative">
          <RxCrossCircled
            onClick={() => {
              onClose(false);
            }}
            className="absolute right-0 cursor-pointer text-3xl font-extrabold text-slate-800 duration-150 hover:text-slate-600"
          />
        </div>
        <div className="mb-5 flex justify-center text-xl font-bold text-slate-700">
          {isReport ? <h1>ВІКНО СКАРГИ</h1> : <h1>ПІДТВЕРДІТЬ ДІЮ</h1>}
        </div>
        <div className="flex min-w-fit flex-col items-center justify-between text-center text-lg">
          {isReport ? (
            <>
              <h1 className="mb-5 text-slate-800">
                Напишіть вашу скаргу на рецензію
              </h1>
              <div className="min-w-[80%] ">
                <textarea
                  placeholder="Напишіть свою скаргу (мінімум 10 символів)"
                  className="max-h-[15rem] min-h-[8rem] w-full rounded bg-slate-300 px-2 text-left text-slate-800 shadow shadow-black/50 outline-none placeholder:text-slate-500 sm:h-24"
                  onChange={(e) => setMessage!(e.target.value)}
                  value={message}
                ></textarea>
                <h1
                  className={`mr-4 text-right text-base font-bold ${
                    message!.length > 2000 || message!.length < 11
                      ? 'text-red-700'
                      : 'text-slate-600'
                  }`}
                >
                  {message!.length}/2000
                </h1>
              </div>
            </>
          ) : (
            <h1 className="mb-9">Ви точно впевнені що хочете {elementName}</h1>
          )}
          <div className=" top-0 mb-3 flex justify-center">{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')!
  );
};

export { SureMessage };
