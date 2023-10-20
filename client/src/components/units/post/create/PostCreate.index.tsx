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

export default function PostCreateList() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [priceChoose, setPriceChoose] = useState("free");
  const [price, setPrice] = useState("");
  const [musicType, setMusicType] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const [musicName, setMusicName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  let { sub: subName } = router.query;

  if (router.pathname === "/create" && !subName) {
    subName = "nomal";
  }
  console.log(subName);

  const openFileInput = (type: string) => {
    const fileInputRefs: any = type === "cover" ? fileInputRef : fileInputRef2;
    fileInputRefs.current!.name = type;
    fileInputRefs.current?.click();
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    if (event.target.id === "cover") {
      if (file?.type === "audio/mpeg" || file?.type === "audio/wav") {
        window.alert("유요한 파일이 아닙니다.");
        return false;
      }
      const fileName = URL.createObjectURL(file);
      setImgUrl(fileName);
    } else {
      if (file?.type === "image/png" || file?.type === "image/jpeg") {
        window.alert("유요한 파일이 아닙니다.");
        return false;
      }
      setMusicName(file.name);
      setTitle(file.name);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [imageUrl]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "" || !subName) return;

    const fileInput = fileInputRef.current;
    const fileInput2 = fileInputRef2.current;

    if (fileInput?.files && fileInput2?.files) {
      const formData = new FormData();
      const formData2 = new FormData();

      formData.append("file", fileInput.files[0]);
      formData.append("type", fileInput.name);

      formData2.append("file", fileInput2.files[0]);
      formData2.append("type", fileInput2.name);

      try {
        const { data: imageUrn } = await axios.post(`/posts/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { data: musicFileUrn } = await axios.post(
          `/posts/music/upload`,
          formData2,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const { data: post } = await axios.post<Post>("/posts", {
          title: title.trim(),
          priceChoose,
          price: Number(price),
          musicType,
          body,
          sub: subName,
          imageUrn,
          musicFileUrn,
        });
        // console.log(post);
        router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
      } catch (error) {}
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
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
      <div className="w-10/12 mx-auto md:w-96 bg-white rounded-md p-4">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg font-semibold">음악등록</h1>
          <form onSubmit={submitPost}>
            <div className="relative ">
              <div className="mb-2">
                <div
                  className="h-56 border border-gray-200 rounded-md mb-2"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <button
                  className="px-3 py-1 text-sm font-semibold text-white bg-black border rounded mb-2"
                  onClick={() => openFileInput("cover")}
                >
                  커버이미지 등록
                </button>
              </div>

              <div className="flex items-start flex-col mb-2">
                <p className="text-sm mb-2 font-semibold">음원등록: </p>
                <button
                  className="px-3 py-1 text-sm font-semibold text-white bg-black border rounded mb-2"
                  onClick={() => openFileInput("music")}
                >
                  음원등록
                </button>
                <span className="text-sm mb-2 font-semibold">{musicName}</span>
              </div>
              <div className="flex items-start flex-col">
                <p className="text-sm mb-2 font-semibold">트랙제목: </p>
                <InputGroup
                  placeholder="제목"
                  value={title}
                  setValue={setTitle}
                />
              </div>
              <div className="flex items-start flex-col">
                <p className="text-sm mb-2 font-semibold">가격: </p>
                <RadioLayout value={priceChoose} setValue={setPriceChoose} />
                <div className="w-full flex items-center">
                  <InputGroup
                    className="w-full mr-2 mb-4"
                    placeholder="가격"
                    type="number"
                    value={price}
                    setValue={setPrice}
                    maxLength={10}
                    disabeld={priceChoose !== "free" ? false : true}
                  />
                  <span className="mb-4">원</span>
                </div>
              </div>
              <div className="flex items-start flex-col">
                <p className="text-sm mb-2 font-semibold">장르: </p>
                <SelectGroup
                  value={musicType}
                  setValue={setMusicType}
                  option={ageData}
                />
              </div>
              <div className="flex items-start flex-col relative">
                <p className="text-sm mb-2 font-semibold">내용: </p>
                <textarea
                  rows={4}
                  placeholder="설명"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div
                  style={{ top: 43, right: 10 }}
                  className="absolute mb-2 text-sm text-gray-400 select-none"
                >
                  {title.trim().length}/20
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
                  등록하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
