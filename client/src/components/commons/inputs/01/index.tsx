import cls from "classnames";
import { ChangeEvent } from "react";

// InputGroup 컴포넌트 정의
interface IInputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string | undefined;
  disabled?: boolean;
  maxLength?: number;
  name?: string;
  setValue: (str: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// InputGroup 함수 컴포넌트 정의
export default function InputGroup({
  className = "w-full mb-4",
  type = "text",
  placeholder = "",
  disabled = false,
  error,
  value,
  maxLength,
  setValue,
  name,
}: IInputGroupProps) {
  return (
    <div className={className}>
      {/* 입력 필드 */}
      <input
        disabled={disabled}
        type={type}
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-200 rounded  focus:bg-white hover:bg-white`,
          {
            "border-red-5002": error,
          },
          {
            "bg-gray-50": disabled,
          }
        )}
        placeholder={placeholder}
        name={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        value={value}
        maxLength={maxLength}
      />
      {/* 에러 또는 안내 메시지 */}
      <small
        className={`font-medium ${
          error === "비밀번호가 일치 합니다." ? "text-blue-500" : "text-red-500"
        }`}
      >
        {error}
      </small>
    </div>
  );
}
