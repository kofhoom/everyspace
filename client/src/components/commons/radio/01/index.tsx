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
      {/* 라디오 그룹 컴포넌트 */}
      <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
        {/* 무료 옵션 */}
        <Radio value={"free"} className="font-medium ">
          무료
        </Radio>
        {/* 가격설정 옵션 */}
        <Radio value={"가격설정"}>가격설정</Radio>
      </Radio.Group>
      {/* 오류 메시지 */}
      <small className="font-medium text-red-500">{error}</small>
    </div>
  );
}
