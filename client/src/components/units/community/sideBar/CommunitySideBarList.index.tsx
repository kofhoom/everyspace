import { useAuthState } from "@/src/context/auth";
import { Sub } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSwR from "swr";

// 메인 사이드바
export default function CommunityContentList() {
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const address = "/boards/sub/topSubs";

  // SWR 훅을 사용하여 인기 아지트 데이터 가져오기
  const { data: topSubs } = useSwR<Sub[]>(address);

  // 인기 아지트 여부 확인
  const isTopSub = topSubs?.length === 0;

  // 아지트 생성 페이지 이동 핸들러
  const createMovePageHandleler = () => {
    const checkCommunityMake = topSubs?.some(
      (el) => el.username === user?.username
    );
    if (checkCommunityMake)
      return window.alert("아지트 생성은 1개만 가능합니다.");
    else router.push("/agit/create");
  };

  return (
    <div className="w-4/12 ml-3 ms:ml-0 ms:w-full ms:mb-3">
      <div className="bg-white border rounded-lg shadow-md">
        <div className="p-4 border-b">
          <p className="text-lg font-semibold text-center">아지트</p>
        </div>
        {/* 아지트 리스트 */}
        <div className="ms:h-28 overflow-auto">
          {isTopSub && (
            <div className="text-center flex justify-center items-center h-full text-gray-300">
              <p className="text-md mt-3">나만의 아지트를 생성해 보세요</p>
            </div>
          )}
          {topSubs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs border-b"
            >
              {/* 아지트 이미지 및 링크 */}
              <Link href={`/r/${sub.name}`} legacyBehavior>
                <a className="flex-shrink-0">
                  <Image
                    src={sub.imageUrl}
                    className="rounded-full cursor-pointer"
                    alt="Sub"
                    width={24}
                    height={24}
                  ></Image>
                </a>
              </Link>
              {/* 아지트 이름 및 링크 */}
              <Link href={`/r/${sub.name}`} legacyBehavior>
                <a className="ml-2 font-bold bover:cursor-pointer overflow-hidden overflow-ellipsis w-44">
                  {sub.name}
                </a>
              </Link>
              {/* 아지트의 게시글 수 */}
              <p className="ml-auto font-med">{sub.postCount}</p>
            </div>
          ))}
        </div>
        {/* 아지트 생성 버튼 (인증된 사용자에게만 표시) */}
        {authenticated && (
          <div
            className="max-w-fit m-auto my-5 px-2.5 py-1 text-sm cursor-pointer border-gray-300 hover:border-blue-500 hover:font-semibold hover:text-blue-500 transition rounded-xl border text-gray-400 "
            onClick={createMovePageHandleler}
          >
            아지트 생성
          </div>
        )}
      </div>
    </div>
  );
}
