import { Radio, RadioChangeEvent } from "antd";

interface IRadioGroupProps {
  className?: string;
  value: string;
  error?: string | undefined;
  setValue: (str: string) => void;
  name?: string;
  onChange: (e: RadioChangeEvent) => void;
}

export default function RadioLayout({
  className = "w-full mb-4",
  error,
  value,
  setValue,
}: IRadioGroupProps) {
  return (
    <div className={className}>
      <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
        <Radio value={"free"} className="font-medium ">
          무료
        </Radio>
        <Radio value={"가격설정"}>가격설정</Radio>
      </Radio.Group>
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
}
