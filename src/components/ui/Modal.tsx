import { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  actionBar: React.ReactNode;
  onRegister?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  actionBar,
  onRegister,
}) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    document.getElementById('root')?.classList.add('blur-sm');
    return () => {
      document.getElementById('root')?.classList.remove('blur-sm');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const overflow = onRegister
    ? 'overflow-y-scroll min-h-[80%] registrationScrollbar'
    : 'min-h-fit';

  return ReactDOM.createPortal(
    <div className="">
      <div
        onClick={() => {
          onClose(false);
        }}
        className="fixed inset-0 z-40 bg-slate-700 opacity-80"
      ></div>
      <div
        className={`fixed inset-x-[30%] inset-y-32 z-40 rounded-lg p-6 shadow-lg shadow-black/30 ${overflow} min-w-fit bg-slate-300`}
      >
        <div className="relative flex min-w-fit flex-col justify-between">
          {children}
          <div className="mt-4 flex justify-center">{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')!
  );
};
export { Modal };
