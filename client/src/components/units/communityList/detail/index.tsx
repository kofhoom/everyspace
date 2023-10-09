import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import useSwR from "swr";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useAuthState } from "@/src/context/auth";
import SideBar from "@/src/components/commons/sidebar";
export default function CommunityDetailList() {
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSwR(
    subName ? `/boards/${subName}` : null,
    fetcher
  );

  // 자신의 글인지 판별 유무
  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [authenticated, sub, user]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFileInput = (type: string) => {
    if (!ownSub) return; // 자신의 커뮤니티(sub)일 때만 클릭이 가능하게
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  // 이미지 파일 처리
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(`/boards/${sub.name}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {sub && (
        <div>
          {/* 베너 이미지 */}
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          <div className="bg-gray-400">
            {sub.bannerUrl ? (
              <div
                className="h-56"
                style={{
                  backgroundImage: `url(${sub.bannerUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => openFileInput("banner")}
              ></div>
            ) : (
              <div
                className="h-20 bg-gray-400"
                onClick={() => openFileInput("banner")}
              ></div>
            )}
          </div>
          {/* 커뮤니티 메타 데이터 */}
          <div className="h-20 bg-white">
            <div className="relative flex max-w-5xl px-5 mx-auto">
              <div className="absolute" style={{ top: 0 }}>
                {sub.imageUrl && (
                  <Image
                    src={sub.imageUrl}
                    alt="커뮤니티 이미지"
                    width={70}
                    height={70}
                    className="rounded-full"
                    onClick={() => openFileInput("image")}
                  ></Image>
                )}
              </div>
              <div className="pt-1 pl-24">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold">{sub.title}</h1>
                </div>
                <p className="text-sm font-bold text-gray-400">/r/{sub.name}</p>
              </div>
            </div>
          </div>
          {/* 포스트와 사이드바 */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            <div className="w-full md:mr-3 md:w-8/12">
              <SideBar sub={sub} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
