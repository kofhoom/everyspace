import Link from "next/link";

// 메인 사이드바
export default function BoardCommunityList() {
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
