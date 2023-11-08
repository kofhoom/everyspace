import { FormEvent, ChangeEvent, useState } from "react";
import InputGroup from "../../commons/inputs/01";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "@/src/context/auth";
import { Divider } from "antd";

interface FormData {
  username: string;
  password: string;
}

export default function LoginListPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const isAdmin = router.pathname.includes("/admin");
  if (!isAdmin && authenticated) {
    router.push("/");
  }

  // 사용자 입력값이 변경될 때 호출되는 함수
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  // username와 password 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(formData.username && formData.password);

  // 폼 제출 시 실행되는 함수
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // 서버로 로그인 요청 보냄
      const res = await axios.post("/auth/login", formData);

      // 로그인 상태 업데이트
      dispatch("LOGIN", res.data?.user);

      // 홈페이지로 리다이렉트
      if (isAdmin) {
        router.push("/admin");
        return;
      }
      router.push("/");
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
          <h1 className="text-2xl font-bold">{isAdmin ? "admin" : "로그인"}</h1>
          <Divider className="mb-5 mt-3" />
          <form
            onSubmit={handleSubmit}
            className="p-5 bg-white rounded-lg border"
          >
            <InputGroup
              className="text-sm mb-5"
              placeholder="닉네임"
              name="username"
              value={formData.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              setValue={(str: string) =>
                setFormData({ ...formData, username: str })
              }
              error={errors.username}
            />
            <InputGroup
              placeholder="비밀번호"
              type="password"
              name="password"
              className="text-sm mb-5"
              value={formData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              setValue={(str: string) =>
                setFormData({ ...formData, password: str })
              }
              error={errors.password}
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
              로그인
            </button>
          </form>
          {!isAdmin && (
            <small>
              아직 아이디가 없나요?
              <Link href="/register" legacyBehavior>
                {/* 회원가입 링크 */}
                <a className="m-1 text-blue-500 uppercase">회원가입</a>
              </Link>
            </small>
          )}{" "}
        </div>
      </div>
    </div>
  );
}
