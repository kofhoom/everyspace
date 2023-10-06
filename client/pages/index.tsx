import BoardCommunityList from "@/src/components/units/board/communityList/BoardCommunityList.index";

export default function Home() {
  return (
    <main className="flex max-w-5xl px-4 mx-auto pt-5">
      {/* 포스트 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12"></div>

      {/* 사이드바 */}
      <BoardCommunityList />
    </main>
  );
}
