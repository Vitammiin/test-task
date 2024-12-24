import { twMerge } from 'tailwind-merge';

type ButtonProps = {
  styles?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (...args: any) => any;
};

export default function Button({
  type = 'button',
  styles = '',
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        `w-full py-1 font-Inter-400 font-normal group text-sm bg-customBlue-200 text-mainPrimaryText text-center rounded-lg transition-all  
        hover:bg-blue-700
        focus:bg-blue-700`,
        styles
      )}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
