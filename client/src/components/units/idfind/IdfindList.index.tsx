import { FormEvent, ChangeEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Divider } from "antd";
import InputGroup from "../../commons/inputs/01";

interface FormData {
  email: string;
  tel: string;
}

export default function IdfindList() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    tel: "",
  });
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState<any>({});

  // 사용자 입력값이 변경될 때 호출되는 함수
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  // username와 tel 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(formData.email && formData.tel);

  // 폼 제출 시 실행되는 함수
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // 서버로 로그인 요청 보냄
      const { data } = await axios.post(`/auth/findId`, formData);

      console.log(data);
      setResult(data.message);
    } catch (error: any) {
      console.log("error", error);
      // 서버에서 오류가 발생한 경우 오류 메시지 표시
      setErrors(error?.response?.data || {});
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="mx-auto md:w-96">
          <h1 className="text-2xl font-bold">아이디 찾기</h1>
          <Divider className="mb-5 mt-3" />

          {result ? (
            // 아이디 찾기 결과
            <div className="p-5 bg-white rounded-lg border">
              {result}
              <button
                type="button"
                className={`mt-5 w-full py-2 mb-1 text-xm font-bold text-white uppercase bg-blue-500 
                rounded-xl transition`}
              >
                로그인
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-white rounded-lg border"
            >
              <InputGroup
                className="text-sm mb-5"
                placeholder="이메일"
                name="username"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) =>
                  setFormData({ ...formData, email: str })
                }
                error={errors.email}
              />
              <InputGroup
                placeholder="전화번호"
                type="number"
                name="tel"
                className="text-sm mb-5"
                value={formData.tel}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) =>
                  setFormData({ ...formData, tel: str })
                }
                error={errors.tel}
              />
              {/* 로그인 버튼 - username과 password 모두 값이 있는 경우 활성화 */}
              <button
                className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500"
                } rounded-xl transition`}
                disabled={isButtonDisabled}
              >
                아이디 찾기
              </button>
            </form>
          )}
          <div className="w-full flex justify-center mt-2">
            <ul className="flex">
              <li>
                <small>
                  {" "}
                  <Link href="/passwordfind" legacyBehavior>
                    <a className="uppercase hover:underline">비밀번호 찾기</a>
                  </Link>
                </small>
              </li>
              <li>
                <Divider type="vertical" />
              </li>
              <li>
                <small>
                  <Link href="/register" legacyBehavior>
                    <a className="uppercase hover:underline">회원가입</a>
                  </Link>
                </small>
              </li>
              <li>
                <Divider type="vertical" />
              </li>
              <li>
                <small>
                  <Link href="/login" legacyBehavior>
                    <a className="uppercase hover:underline">로그인</a>
                  </Link>
                </small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
