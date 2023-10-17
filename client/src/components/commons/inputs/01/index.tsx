import cls from "classnames";

interface IInputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string | undefined;
  disabeld?: boolean;
  maxLength?: number;
  setValue: (str: string) => void;
}

export default function InputGroup({
  className = "w-full mb-4",
  type = "text",
  placeholder = "",
  disabeld = false,
  error,
  value,
  maxLength,
  setValue,
}: IInputGroupProps) {
  return (
    <div className={className}>
      <input
        disabled={disabeld}
        type={type}
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-200 rounded  focus:bg-white hover:bg-white`,
          {
            "border-red-5002": error,
          },
          {
            "bg-gray-50": disabeld,
          }
        )}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        maxLength={maxLength}
      />
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
}
