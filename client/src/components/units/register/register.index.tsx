import { FormEvent, useState, ChangeEvent, useRef, useEffect } from "react";
import InputGroup from "../../commons/inputs/01";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthState } from "@/src/context/auth";
import { Divider } from "antd";

// 폼 데이터의 인터페이스 정의
interface FormData {
  username: string;
  email: string;
  password: string | number | any;
}

export default function RegisterList() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const [imageUrl, setImgUrl] = useState("");
  const [errors, setErrors] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authenticated } = useAuthState();

  if (authenticated) router.push("/"); //이미 로그인된 유져는 리다이렉트 시킴
  // 이미지 파일 프리뷰 처리

  // 폼 입력값 변경 핸들러
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors({});
  };

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  // username와 password 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(
    formData.username &&
    formData.email &&
    formData.password
  );

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    if (file?.type === "audio/mpeg" || file?.type === "audio/wav") {
      window.alert("유효한 파일이 아닙니다.");
      return;
    }

    const fileName = URL.createObjectURL(file);
    setImgUrl(fileName);
    setErrors({});
  };

  // 이미지 URL 해제
  useEffect(() => {
    if (imageUrl) {
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [imageUrl]);

  // 회원가입 헨들러
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!imageUrl) {
      setErrors({ profileImage: "이미지를 등록해 주세요" });
      return;
    }

    if (fileInputRef.current?.files && fileInputRef.current?.files[0]) {
      const formDataImageFile = new FormData();
      formDataImageFile.append("file", fileInputRef.current.files[0]);
      formDataImageFile.append("type", fileInputRef.current.name);

      try {
        // 이미지 업로드 API 호출
        const { data: registerImageUrl } = await axios.post(
          `/auth/upload`,
          formDataImageFile,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const result = await axios.post("/auth/register", {
          ...formData,
          imageUrn: registerImageUrl,
        });

        console.log(result);

        router.push("/login");
      } catch (error: any) {
        console.log("error", error);
        setErrors(error?.response?.data);
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
          <h1 className="text-2xl font-bold">회원가입</h1>
          <Divider className="mb-5 mt-3" />
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
              type="button"
              className="px-3 py-1 text-sm font-semibold text-white bg-gray-300 hover:bg-black transition-all rounded-lg"
              onClick={() => openFileInput("post")}
            >
              프로필 이미지 등록
            </button>
            <div>
              <small className="font-medium text-red-500 mb-2">
                {errors.profileImage}
              </small>
            </div>
            <Divider className="mb-5 mt-3" />
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">이메일: </p>
              <InputGroup
                placeholder="이메일"
                name="email"
                value={formData.email}
                setValue={(str: string) =>
                  setFormData((prevData) => ({ ...prevData, email: str }))
                }
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <Divider className="mb-5 mt-3" />
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">닉네임: </p>
              <InputGroup
                placeholder="닉네임"
                name="nickname"
                value={formData.username}
                setValue={(str: string) =>
                  setFormData({ ...formData, username: str })
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                error={errors.username}
              />
            </div>
            <Divider className="mb-5 mt-3" />
            <div className="flex items-start flex-col">
              <p className="text-sm mb-2 font-semibold">비밀번호: </p>
              <InputGroup
                placeholder="비밀번호"
                name="password"
                value={formData.password}
                setValue={(str: string) =>
                  setFormData({ ...formData, password: str })
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                type="password"
                error={errors.password}
              />
            </div>
            <Divider className="mb-5 mt-3" />
            <button
              className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500"
              } rounded-xl transition`}
              disabled={isButtonDisabled}
            >
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
