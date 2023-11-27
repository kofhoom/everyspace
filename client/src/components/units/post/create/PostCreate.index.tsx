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
import useSwR from "swr";
import { catagoryData } from "@/src/commons/dummyData";

// 폼 데이터의 인터페이스 정의
interface FormData {
  title: string;
  priceChoose: string;
  price: string | number | any;
  musicType: string;
  body: string;
  sub: string | string[] | undefined;
}

interface IPostState {
  isEdit?: boolean;
}
export default function PostCreateList({ isEdit }: IPostState) {
  const router = useRouter();
  const { identifier, slug } = router.query;
  // 포스트 리스트 가져오기
  const { data: post } = useSwR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  useEffect(() => {
    // 데이터가 로드된 후 실행되는 코드
    if (post) {
      // 이미지 파일 설정
      if (post?.imageUrl) {
        const imageUrl = post.imageUrl;
        setImgUrl(imageUrl);
      }

      // 음원 파일 설정
      if (post?.musicFileUrn) {
        const musicUrl = post.musicFileUrn;
        setMusicName(musicUrl);
      }
    }
  }, [post]);

  const [formData, setFormData] = useState<FormData>({
    title: post?.title || "",
    priceChoose: post?.priceChoose || "free",
    price: post?.price || 0,
    musicType: post?.musicType || "",
    body: post?.body || "",
    sub: router.query.sub || "nomal",
  });

  const [imgUrl, setImgUrl] = useState<string>("");
  const [musicName, setMusicName] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // username와 password 둘 다 값이 있는 경우에만 버튼 활성화
  const isButtonDisabled = !(
    formData.title &&
    formData.priceChoose &&
    formData.musicType &&
    formData.body &&
    musicName
  );

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
  const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return; // 파일이 선택되지 않았을 경우

    const file = event.target.files[0];

    if (event.target.id === "cover") {
      if (file?.type === "audio/mpeg" || file?.type === "audio/wav") {
        window.alert("유효한 파일이 아닙니다.");
        return;
      }
      if (file) {
        const fileName = URL.createObjectURL(file);
        setImgUrl(fileName);
      }
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
          `/posts/upload?imageUrn=${post?.imageUrn}`,
          formData1,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // 음악 파일 업로드
        const { data: musicFileUrn, error: musicError }: any = await axios.post(
          `/posts/music/upload?musicFileUrn=${post?.musicFileUrn}`,
          formData2,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (isEdit) {
          // 포스트 데이터 수정 및 전송
          const { data: updatedPost } = await axios.put<Post>(
            `/posts/${identifier}/${slug}/update`,
            {
              ...formData,
              imageUrn,
              musicFileUrn,
            }
          );
          router.push(
            `/r/${formData.sub}/${updatedPost.identifier}/${updatedPost.slug}`
          );
        } else {
          // 포스트 데이터 생성 및 전송
          const { data: post } = await axios.post<Post>("/posts", {
            ...formData,
            imageUrn,
            musicFileUrn,
          });
          // 라우터로 이동
          router.push(`/r/${formData.sub}/${post.identifier}/${post.slug}`);
        }
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

      <div className="mx-auto w-96 sm:w-11/12 p-4 bg-white  mb-2 border border-gray-200 rounded-lg shadow-md">
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
                    backgroundImage: `url(${
                      !imgUrl ? "/mainLogo.png" : imgUrl
                    })`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${!imgUrl ? "contain" : "cover"}`,
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
                  <span className="text-xs mb-2 text-gray-400 mt-1">
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
                    maxLength={100}
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
                  option={catagoryData}
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
                  {formData.body.trim().length}/100
                </div>
              </div>
              <Divider className="mb-5 mt-3" />
              {/* 포스트 등록 수정 버튼 */}

              <div className="flex justify-end mt-2">
                {isEdit === true ? (
                  <button
                    className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                      isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500"
                    } rounded-xl transition`}
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    className={`w-full py-2 mb-1 text-xm font-bold text-white uppercase ${
                      isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500"
                    } rounded-xl transition`}
                  >
                    등록하기
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
