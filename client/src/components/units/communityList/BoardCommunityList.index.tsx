import { useAuthState } from "@/src/context/auth";
import { Sub } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSwR from "swr";
// 메인 사이드바
export default function BoardCommunityList() {
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const address = "http://localhost:4000/api/boards/sub/topSubs";

  const { data: topSubs } = useSwR<Sub[]>(address);

  const createMovePageHandleler = () => {
    const checkCommunityMake = topSubs?.some(
      (el) => el.username === user?.username
    );
    if (checkCommunityMake) window.alert("아지트 생성은 1개만 가능합니다.");
    else router.push("/boards/new");
  };

  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-4 border-b">
          <p className="text-lg font-semibold text-center">아지트</p>
        </div>
        {/* 포스트 리스트 */}
        <div>
          {topSubs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs border-b"
            >
              <Link href={`/r/${sub.name}`} legacyBehavior>
                <a>
                  <Image
                    src={sub.imageUrl}
                    className="rounded-full cursor-pointer"
                    alt="Sub"
                    width={24}
                    height={24}
                  ></Image>
                </a>
              </Link>
              <Link href={`/r/${sub.name}`} legacyBehavior>
                <a className="ml-2 font-bold bover:cursor-pointer">
                  {sub.name}
                </a>
              </Link>
              <p className="ml-auto font-med">{sub.postCount}</p>
            </div>
          ))}
        </div>
        {authenticated && (
          <div
            className="max-w-fit m-auto my-5 px-2.5 py-1 text-sm cursor-pointer font-normal border-gray-300 hover:border-black hover:font-semibold transition rounded border"
            onClick={createMovePageHandleler}
          >
            아지트 생성
          </div>
        )}
      </div>
    </div>
  );
}
