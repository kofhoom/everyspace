import { FormEvent, useState, ChangeEvent, useRef } from "react";
import InputGroup from "../../commons/inputs/01";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthState } from "@/src/context/auth";

export default function RegisterList() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authenticated) router.push("/"); //이미 로그인된 유져는 리다이렉트 시킴
  // 이미지 파일 프리뷰 처리

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];
    const fileName = URL.createObjectURL(file);
    setImgUrl(fileName);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageUrl) {
      setErrors({ profileImage: "이미지를 등록해 주세요" });
      return;
    }

    if (fileInputRef.current?.files && fileInputRef.current?.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("type", fileInputRef.current.name);
      try {
        // 이미지 업로드 API 호출
        const { data: registerImageUrl } = await axios.post(
          `/auth/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const result = await axios.post("/auth/register", {
          email,
          password,
          username,
          imageUrn: registerImageUrl, // Use the image URL directly
        });

        console.log(result);

        router.push("/login");
      } catch (error: any) {
        console.log("error", error);
        setErrors(error?.response?.data || {});
      }
    }
  };
  return (
    <div className="bg-white">
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadImage}
      />
      <div className="flex items-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96 border border-gray-200 p-4 rounded-lg shadow-md">
          <h1 className="mb-2 text-mg  font-bold">회원가입</h1>
          <form onSubmit={handleSubmit}>
            <div
              className="h-56 mb-2"
              style={{
                backgroundImage: `url(${
                  !imageUrl
                    ? "https://www.gravatar.com/avatar?d=mp&f=y"
                    : imageUrl
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            ></div>
            <button
              className="px-4 py-1  text-sm font-semibold text-white bg-gray-400 border rounded"
              onClick={() => openFileInput("post")}
            >
              프로필 이미지 등록
            </button>
            <p className="font-medium text-xs text-red-500 mb-2">
              {errors.profileImage}
            </p>
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">이메일: </p>
              <InputGroup
                placeholder="Email"
                value={email}
                setValue={setEmail}
                error={errors.email}
              />
            </div>
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">닉네임: </p>
              <InputGroup
                placeholder="nickname"
                value={username}
                setValue={setUsername}
                error={errors.username}
              />
            </div>
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">비밀번호: </p>
              <InputGroup
                placeholder="Password"
                value={password}
                setValue={setPassword}
                error={errors.password}
                type="password"
              />
            </div>

            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href="/login" legacyBehavior>
              <a className="m-1 text-blue-500 uppercase">로그인</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
