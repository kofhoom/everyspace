import BoardCommunityList from "@/src/components/units/communityList/BoardCommunityList.index";

export default function Home() {
  return (
    <main className="flex max-w-5xl px-4 mx-auto pt-5">
      {/* 포스트 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12"></div>

      {/* 커뮤니티 리스트 */}
      <BoardCommunityList />
    </main>
  );
}
