import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import useSwR from "swr";
export default function CommunityDetailList() {
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
  return (
    <>
      {sub && (
        <div>
          {/* 베너 이미지 */}
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
              ></div>
            ) : (
              <div className="h-20 bg-gray-400"></div>
            )}
          </div>
          {/* 커뮤니티 메타 데이터 */}
          <div className="h-20 bg-white">
            <div className="relative flex max-w-5xl px-5 mx-auto">
              <div className="absolute" style={{ top: -15 }}>
                {sub.imageUrl && (
                  <Image
                    src={sub.imageUrl}
                    alt="커뮤니티 이미지"
                    width={70}
                    height={70}
                    className="rounded-full"
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
          <div className="flex maxw-5xl px-4 pt-5 mx-auto"></div>
        </div>
      )}
    </>
  );
}
