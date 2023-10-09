import { useAuthState } from "@/src/context/auth";
import { Sub } from "@/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import useSwR from "swr";
// 메인 사이드바
export default function BoardCommunityList() {
  const { authenticated } = useAuthState();

  const address = "http://localhost:4000/api/boards/sub/topSubs";
  const { data: topSubs } = useSwR<Sub[]>(address);
  // console.log("topSubs", topSubs);
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-4 border-b">
          <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
        </div>
        {/* 커뮤니티 리스트 */}
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
                  /r/${sub.name}
                </a>
              </Link>
              <p className="ml-auto font-med">{sub.postCount}</p>
            </div>
          ))}
        </div>
        {authenticated && (
          <div className="w-full py-6 text-center">
            <Link href="/boards/new" legacyBehavior>
              <a className="w-full p-2 text-white bg-gray-400 rounded">
                커뮤니티 만들기
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
