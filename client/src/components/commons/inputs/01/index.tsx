import cls from "classnames";

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
} 

export default function InputGroup({
  className = "mb-2",
  type = "text",
  placeholder = "",
  error,
  value,
  setValue,
}: InputGroupProps) {
  return (
    <div className={className}>
      <input
        type={type}
        style={{ minWidth: 300 }}
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
          {
            "border-red-5002": error,
          }
        )}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
}
