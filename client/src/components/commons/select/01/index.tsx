import cls from "classnames";
import { ChangeEvent } from "react";

interface ISelectGroupProps {
  className?: string;
  value: string;
  error?: string | undefined;
  option?: any;
  name?: string;
  setValue: (str: string) => void;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectGroup({
  className = "w-full mb-4",
  error,
  value,
  option,
  setValue,
  name,
}: ISelectGroupProps) {
  return (
    <div className={className}>
      <select
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-200 rounded  focus:bg-white hover:bg-white`,
          {
            "border-red-5002": error,
          }
        )}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setValue(e.target.value)
        }
        value={value}
        name={name}
      >
        {option?.map((el: any, index: any) => (
          <option key={index}>{el?.values ?? ""}</option>
        ))}
      </select>
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
}
