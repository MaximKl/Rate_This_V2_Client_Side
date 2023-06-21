import classNames from 'classnames';
interface PanelProps {
  children?: React.ReactNode;
  className: string;
}

const Panel: React.FC<PanelProps & React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  const finalClassNames = classNames(
    'p-2 shadow-lg shadow-slate-800/40 w-full',
    className
  );
  return (
    <div {...rest} className={finalClassNames}>
      {children}
    </div>
  );
};

export { Panel };
