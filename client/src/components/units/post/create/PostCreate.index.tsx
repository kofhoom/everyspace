import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import InputGroup from "@/src/components/commons/inputs/01";
import SelectGroup from "@/src/components/commons/select/01";
import { Post } from "@/types";
import RadioLayout from "@/src/components/commons/radio/01";
import { Divider } from "antd";

const ageData = [
  { values: "선택" },
  { values: "앰비언트" },
  { values: "다크 앰비언트" },
  { values: "뉴에이지 음악" },
  { values: "베이스 음악" },
  { values: "퓨처 베이스" },
  { values: "일렉트로 하우스" },
  { values: "브레이크비트" },
  { values: "볼티모어 클럽" },
  { values: "저지 클럽" },
  { values: "빅 비트" },
  { values: "칠아웃" },
  { values: "다운템포" },
  { values: "사이키델릭 트랜스" },
  { values: "트립합" },
  { values: "디스코" },
  { values: "Hi-NRG" },
  { values: "유로비트" },
  { values: "유로댄스" },
  { values: "이탈로 디스코" },
  { values: "시티 팝" },
  { values: "포스트디스코" },
  { values: "드럼 앤 베이스" },
  { values: "리퀴드 펑크" },
  { values: "덥 음악" },
  { values: "일렉트로닉 록" },
  { values: "댄스록" },
  { values: "댄스 펑크" },
  { values: "일랙트로닉 팝" },
  { values: "디스코 폴로" },
  { values: "신스팝" },
  { values: "디스코 폴로" },
  { values: "일렉트로클래시" },
  { values: "일렉트로팝" },
  { values: "인디 록" },
  { values: "크라우트록" },
  { values: "뉴 웨이브" },
  { values: "다크웨이브" },
  { values: "뉴 로맨티시즘" },
  { values: "포스트 록" },
  { values: "스페이스 록" },
  { values: "신스메탈" },
  { values: "그라인드코어" },
  { values: "일렉트로닉코어" },
  { values: "일렉트로니카" },
  { values: "그라인드코어" },
  { values: "포크트로니카" },
  { values: "프로그레시브" },
  { values: "민속 일렉트로니카" },
  { values: "쿠두루" },
  { values: "실험 음악" },
  { values: "포크트로니카" },
  { values: "블랙 미디" },
  { values: "일렉트로어쿠스틱" },
  { values: "애시드 재즈" },
  { values: "정글" },
  { values: "하드코어 테크노" },
  { values: "브레이크코어" },
  { values: "디지털 하드코어" },
  { values: "스피드코어" },
  { values: "유령론" },
  { values: "베이퍼웨이브" },
  { values: "힙합" },
  { values: "클라우드 랩" },
  { values: "크렁크" },
  { values: "이모 랩" },
  { values: "멈블 랩" },
  { values: "트랩" },
  { values: "드릴" },
  { values: "하우스" },
  { values: "애시드 하우스" },
  { values: "딥 하우스" },
  { values: "프렌치 하우스" },
  { values: "퓨처 하우스" },
  { values: "UK 하드하우스" },
  { values: "리듬 앤 블루스 및 솔 음악" },
  { values: "컨템퍼러리 알앤비" },
  { values: "네오 소울" },
  { values: "뉴 잭 스윙" },
  { values: "테크노" },
  { values: "트랜스 음악" },
  { values: "UK 개러지" },
  { values: "투스텝" },
  { values: "베이스라인" },
  { values: "브레이크스텝" },
  { values: "덥스텝" },
  { values: "퓨처 개러지" },
  { values: "그라임" },
  { values: "UK 펑키" },
  { values: "비디오 게임 음악" },
  { values: "칩튠" },
];

// 폼 데이터의 인터페이스 정의
interface FormData {
  title: string;
  priceChoose: string;
  price: string | number | any;
  musicType: string;
  body: string;
  sub: string | string[] | undefined;
}

export default function PostCreateList() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    priceChoose: "free",
    price: "",
    musicType: "",
    body: "",
    sub: router.query.sub || "nomal",
  });
  const [imgUrl, setImgUrl] = useState<string>("");
  const [musicName, setMusicName] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // 폼 입력값 변경 핸들러
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors({});
  };

  // 파일 입력 창 열기
  const openFileInput = (type: string) => {
    const fileInputRefToUse = type === "cover" ? fileInputRef : fileInputRef2;
    fileInputRefToUse.current!.name = type;
    fileInputRefToUse.current?.click();
  };

  // 파일 업로드
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    if (event.target.id === "cover") {
      if (file?.type === "audio/mpeg" || file?.type === "audio/wav") {
        window.alert("유효한 파일이 아닙니다.");
        return;
      }
      const fileName = URL.createObjectURL(file);
      setImgUrl(fileName);
    } else {
      if (file?.type === "image/png" || file?.type === "image/jpeg") {
        window.alert("유효한 파일이 아닙니다.");
        return;
      }

      setMusicName(file.name);
      setFormData((prevData) => ({ ...prevData, title: file.name }));
    }
    setErrors({});
  };

  // 이미지 URL 해제
  useEffect(() => {
    if (imgUrl) {
      return () => URL.revokeObjectURL(imgUrl);
    }
  }, [imgUrl]);

  // 포스트 등록
  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    const fileInput = fileInputRef.current;
    const fileInput2 = fileInputRef2.current;

    if (fileInput?.files && fileInput2?.files) {
      const formData1 = new FormData();
      const formData2 = new FormData();

      formData1.append("file", fileInput.files[0]);
      formData1.append("type", fileInput.name);

      formData2.append("file", fileInput2.files[0]);
      formData2.append("type", fileInput2.name);

      try {
        // 커버 이미지 업로드
        const { data: imageUrn, error: imaError }: any = await axios.post(
          `/posts/upload`,
          formData1,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // 음악 파일 업로드
        const { data: musicFileUrn, error: musicError }: any = await axios.post(
          `/posts/music/upload`,
          formData2,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // 포스트 데이터 생성 및 전송
        const { data: post } = await axios.post<Post>("/posts", {
          ...formData,
          imageUrn,
          musicFileUrn,
        });

        // 라우터로 이동
        router.push(`/r/${formData.sub}/${post.identifier}/${post.slug}`);
      } catch (error: any) {
        setErrors(error?.response?.data || {});
      }
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16 bg-white">
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadFile}
        multiple
        id="cover"
      />
      <input
        type="file"
        hidden={true}
        ref={fileInputRef2}
        id="musicFile"
        onChange={uploadFile}
      />
      <div className="w-10/12 mx-auto md:w-96 p-4 bg-white  mb-2 border border-gray-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">음원 등록</h1>
        <Divider className="mb-5 mt-3" />
        <div className="w-full">
          <form onSubmit={submitPost}>
            <div className="relative">
              {/* 커버 이미지 업로드 */}
              <div className="mb-2">
                <div
                  className="h-56 border border-gray-200 rounded-lg mb-2"
                  style={{
                    backgroundImage: `url(${!imgUrl ? "" : imgUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <button
                  type="button"
                  className="px-3 py-1 text-sm font-semibold text-white bg-gray-300 hover:bg-black transition-all rounded-lg"
                  onClick={() => openFileInput("cover")}
                >
                  커버 이미지 등록
                </button>
                <div>
                  <small className="font-medium text-red-500">
                    {errors.coverImage}
                  </small>
                </div>
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 음원 파일 업로드 */}
              <div className="flex items-start flex-col mb-2 mt-5">
                <p className="text-sm mb-2 font-semibold">음원 등록:</p>
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-semibold text-white bg-gray-300 hover:bg-black transition-all rounded-lg"
                  onClick={() => openFileInput("music")}
                >
                  음원 등록
                </button>
                {musicName && (
                  <span className="text-sm mb-2 font-semibold">
                    {musicName}
                  </span>
                )}

                <div>
                  <small className="font-medium text-red-500">
                    {errors.music}
                  </small>
                </div>
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 트랙 제목 입력 */}
              <div className="flex items-start flex-col mt-5">
                <p className="text-sm mb-2 font-semibold">트랙 제목:</p>
                <InputGroup
                  placeholder="제목"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  setValue={(str: string) =>
                    setFormData((prevData) => ({ ...prevData, title: str }))
                  }
                  error={errors.title}
                />
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 가격 설정 */}
              <div className="flex items-start flex-col">
                <p className="text-sm mb-2 font-semibold">가격:</p>
                <RadioLayout
                  value={formData.priceChoose}
                  setValue={(str: string) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      priceChoose: str,
                    }))
                  }
                  name="priceChoose"
                  onChange={handleChange}
                />
                <div className="w-full flex items-center">
                  <InputGroup
                    className="w-full mr-2 mb-4"
                    placeholder="가격"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    setValue={(str: string) =>
                      setFormData((prevData) => ({ ...prevData, price: str }))
                    }
                    maxLength={10}
                    disabled={formData.priceChoose == "free"}
                    error={errors.price}
                  />
                  <span className="mb-4">원</span>
                </div>
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 음악 장르 선택 */}
              <div className="flex items-start flex-col">
                <p className="text-sm mb-2 font-semibold">장르:</p>
                <SelectGroup
                  value={formData.musicType}
                  onChange={handleChange}
                  setValue={(str: string) =>
                    setFormData((prevData) => ({ ...prevData, musicType: str }))
                  }
                  option={ageData}
                  name="musicType"
                  error={errors.musicType}
                />
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 내용 입력 */}
              <div className="flex items-start flex-col relative">
                <p className="text-sm mb-2 font-semibold">내용:</p>
                <textarea
                  rows={4}
                  placeholder="설명"
                  name="body"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  value={formData.body}
                  onChange={handleChange}
                  maxLength={20}
                />
                <div>
                  <small className="font-medium text-red-500">
                    {errors.body}
                  </small>
                </div>
                <div
                  style={{ top: 43, right: 10 }}
                  className="absolute mb-2 text-sm text-gray-400 select-none"
                >
                  {formData.body.trim().length}/20
                </div>
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 포스트 등록 버튼 */}
              <div className="flex justify-end mt-2">
                <button className="w-full py-2 mb-1 text-xm font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded-lg">
                  등록 하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
