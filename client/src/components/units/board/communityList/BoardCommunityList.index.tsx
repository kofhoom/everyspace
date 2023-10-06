import { Sub } from "@/types";
import axios from "axios";
import Link from "next/link";
import useSwR from "swr";
// 메인 사이드바
export default function BoardCommunityList() {
  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = "http://localhost:4000/api/boards/sub/topSubs";
  const { data: topSobs } = useSwR<Sub[]>(address, fetcher);
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-4 border-b">
          <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
        </div>
        {/* 커뮤니티 리스트 */}
        <div></div>
        <div className="w-full py-6 text-center">
          <Link href="/boards/new" legacyBehavior>
            <a className="w-full p-2 text-white bg-gray-400 rounded">
              커뮤니티 만들기
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
