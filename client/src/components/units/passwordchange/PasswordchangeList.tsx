import { FormEvent, ChangeEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button, Divider } from "antd";
import InputGroup from "../../commons/inputs/01";

interface FormData {
  email: string;
  username: string;
  password: string | number | any;
  newPassword: string;
}

export default function PasswordChangeList() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    newPassword: "",
  });
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  // 사용자 입력값이 변경될 때 호출되는 함수
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  // 비밀번호 확인
  const isPassWordChack = formData.newPassword === newPasswordCheck;

  // username와 tel 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(
    formData.email &&
    formData.username &&
    formData.password &&
    formData.newPassword &&
    isPassWordChack
  );

  // 폼 제출 시 실행되는 함수
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // 서버로 로그인 요청 보냄
      const { data } = await axios.post(`/auth/passwordChange`, formData);

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
          <h1 className="text-2xl font-bold">비밀번호 변경</h1>
          <Divider className="mb-5 mt-3" />

          {result ? (
            // 아이디 찾기 결과
            <div className="p-5 bg-white rounded-lg border flex flex-col">
              <p>비밀번호가 변경 되었습니다.</p>
              <Link href="/login" legacyBehavior key="login">
                <Button
                  type="primary"
                  style={{ background: "#1677ff", color: "#fff" }}
                  className="hover:border-gray-300 mt-2 py-2 mb-1 text-xm font-bold h-10 rounded-xl"
                >
                  로그인
                </Button>
              </Link>
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
                className="text-sm mb-5"
                placeholder="닉네임"
                name="nickname"
                value={formData.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) =>
                  setFormData({ ...formData, username: str })
                }
                error={errors.username}
              />

              <InputGroup
                placeholder="기존 비밀번호"
                name="password"
                type="password"
                className="text-sm mb-5"
                value={formData.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) =>
                  setFormData({ ...formData, password: str })
                }
                error={errors.password}
              />
              <InputGroup
                placeholder="새 비밀번호"
                type="password"
                name="newPassword"
                className="text-sm mb-5"
                value={formData.newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) =>
                  setFormData({ ...formData, newPassword: str })
                }
                error={errors.newPassword}
              />
              <InputGroup
                placeholder="새 비밀번호 확인"
                type="password"
                name="newPasswordCheck"
                className="text-sm mb-5"
                value={newPasswordCheck}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                setValue={(str: string) => setNewPasswordCheck(str)}
                error={
                  newPasswordCheck.length > 1 && isPassWordChack
                    ? "비밀번호가 일치 합니다."
                    : newPasswordCheck.length > 1 && !isPassWordChack
                    ? "비밀번호가 일치하지 않습니다."
                    : ""
                }
              />
              {/* 비밀번호 찾기 버튼 -  모두 값이 있는 경우 활성화 */}
              <button
                className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500"
                } rounded-xl transition`}
                disabled={isButtonDisabled}
              >
                비밀번호 변경
              </button>
            </form>
          )}
          <div className="w-full flex justify-center mt-2">
            <ul className="flex">
              <li>
                <small>
                  {" "}
                  <Link href="/idfind" legacyBehavior>
                    <a className="uppercase hover:underline">아이디 찾기</a>
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
                  <Link href="/register" legacyBehavior>
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
