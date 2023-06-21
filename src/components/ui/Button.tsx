import className from 'classnames';

interface ButtonProps {
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
  outline?: boolean;
  rounded?: boolean;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  children,
  type = 'button',
  ...rest
}) => {
  const classes = className(
    rest.className,
    'flex items-center px-3 py-1.5 border',
    {
      'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-600 text-white':
        primary && !outline,
      'border-gray-900 bg-gray-900 text-white': secondary && !outline,
      'border-green-500 bg-green-500 text-white': success && !outline,
      'border-yellow-400 bg-yellow-400 text-white': warning && !outline,
      'border-red-500 bg-red-500 text-white': danger && !outline,
      'rounded-full': rounded,
      'bg-white ': outline,
      'border-blue-500 text-blue-500': outline && primary,
      'border-gray-900 text-gray-900': outline && secondary,
      'border-green-500 text-green-500': outline && success,
      'border-yellow-400text-yellow-400': outline && warning,
      'border-red-700 text-red-500': outline && danger,
    }
  );

  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!warning) +
    Number(!!success) +
    Number(!!danger);
  if (count > 1) {
    throw new Error(
      'Only one of primary, secondary, success, warning, danger is allowed'
    );
  }

  return (
    <button type={type} {...rest} className={classes}>
      {children}
    </button>
  );
};

export { Button };
