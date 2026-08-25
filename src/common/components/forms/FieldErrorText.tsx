export interface FieldErrorTextProps {
  message?: string | { message?: string } | null;
  className?: string;
}

export const FieldErrorText = ({
  message,
  className = 'mb-0 text-danger pt-2 fs-13',
}: FieldErrorTextProps) => {
  const text = typeof message === 'object' ? message?.message : message;
  return text ? <p className={className}>{String(text)}</p> : null;
};
