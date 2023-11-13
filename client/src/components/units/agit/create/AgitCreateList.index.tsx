import InputGroup from "@/src/components/commons/inputs/01";
import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState, type ChangeEvent } from "react";
import { Divider } from "antd";

interface FormData {
  title: string;
  name: string;
  description: string;
}

export default function AgitCreateList() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // username와 password 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(
    formData.title &&
    formData.name &&
    formData.description
  );

  // 사용자 입력값이 변경될 때 호출되는 함수
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  // 폼 전송
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post("/boards/new", {
        ...formData,
      });
      router.push(`/r/${res.data?.name}`);
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response?.data || {});
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="mx-auto md:w-96 p-4 bg-white  mb-2 border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">아지트 만들기</h1>
        <Divider className="mb-5 mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="text-sm mb-1 font-semibold">아지트 이름:</p>
            <p className="mb-2 text-xs text-gray-400">
              아지트의 이름을 입력해주세요.
            </p>
            <InputGroup
              placeholder="이름"
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              setValue={(str: string) =>
                setFormData({ ...formData, name: str })
              }
              error={errors?.name}
            ></InputGroup>
          </div>
          <Divider className="mb-5 mt-3" />
          <div className="my-6">
            <p className="text-sm mb-1 font-semibold">설명:</p>
            <p className="mb-2 text-xs text-gray-400">
              해당 아지트에 대한 설명을 입력해 주세요.
            </p>
            <InputGroup
              placeholder="설명"
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              setValue={(str: string) =>
                setFormData({ ...formData, description: str })
              }
              error={errors?.description}
            ></InputGroup>
          </div>
          <Divider className="mb-5 mt-3" />
          <div className="my-6">
            <p className="text-sm mb-1 font-semibold">운영 목적:</p>
            <p className="mb-2 text-xs text-gray-400">
              해당 아지트를 개설하는 이유를 알려주세요.
            </p>
            <InputGroup
              placeholder="개설목적"
              value={formData.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              setValue={(str: string) =>
                setFormData({ ...formData, title: str })
              }
              error={errors?.title}
            ></InputGroup>
          </div>
          <Divider className="mb-5 mt-3" />
          {/* 포스트 등록 버튼 */}
          <div className="flex justify-end mt-2">
            <button
              className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              } rounded-xl transition`}
              disabled={isButtonDisabled}
            >
              아지트 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
