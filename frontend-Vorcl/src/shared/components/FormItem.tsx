import {
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface FormItemProps<T extends FieldValues> {
  id?: string;
  type?: 'text' | 'email' | 'textarea' | 'tel' | 'date';
  labelText?: string;
  name: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  styles?: string;
}

export default function FormItem<T extends FieldValues>({
  id,
  type,
  labelText,
  name,
  placeholder,
  register,
  error,
  styles,
}: FormItemProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block">
        {labelText}
      </label>
      {type === 'text' && (
        <input
          type="text"
          id={id}
          className={twMerge('input', styles)}
          placeholder={placeholder}
          {...register(name)}
        />
      )}
      {type === 'email' && (
        <input
          type="email"
          id={id}
          className={twMerge('input', styles)}
          placeholder={placeholder}
          {...register(name)}
        />
      )}

      {error && (
        <span className="mt-1 ml-1 text-failure leading-5">
          {error.message}
        </span>
      )}
    </div>
  );
}
