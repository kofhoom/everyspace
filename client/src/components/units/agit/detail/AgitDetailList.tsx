import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import useSwR from "swr";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useAuthState } from "@/src/context/auth";
import SideBar from "@/src/components/commons/sidebar";
import { Post } from "@/types";
import PostCardList from "../../post/cardList/PostCardList.index";
import { Divider, Empty } from "antd";
import { AiOutlineClose } from "react-icons/ai";

export default function AgitDetailList() {
  const [ownSub, setOwnSub] = useState(false);
  const [edit, setEdit] = useState(false);
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const subName = router.query.sub;
  const {
    data: sub,
    error,
    mutate,
  } = useSwR(subName ? `/boards/${subName}` : null);

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

  //포스트 카드 컴포넌트 생성
  let renderPosts;
  if (!sub) {
    renderPosts = <p className="text-lg text-center">로딩중...</p>;
  } else if (sub.posts.length === 0) {
    renderPosts = (
      <>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
        <p className="text-lg text-center text-gray-300">
          작성된 글이 없습니다.
        </p>
      </>
    );
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <PostCardList key={post.identifier} post={post} subMutate={mutate} />
    ));
  }

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
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  // 아지트 삭제
  const handleIztDelete = async () => {
    if (!ownSub) return;

    // 승인 요청 보내기 API 호출
    try {
      const result = await axios.post(`/boards/${sub.name}/delete`);
      if (confirm("정말 삭제하시겠습니까??") == true) {
        window.alert("아지트가 삭제 되었습니다.");
        router.push(`/community`);
      } else {
        return false;
      }
    } catch (error: any) {
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
          <div className={`bg-gray-400 ${ownSub ? "cursor-pointer" : ""}`}>
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
                className="h-56 bg-gray-400"
                onClick={() => openFileInput("banner")}
              ></div>
            )}
          </div>
          {/* 커뮤니티 메타 데이터 */}
          <div className="h-24 bg-white flex items-center border-t border-b">
            <div className="w-full relative flex max-w-5xl px-5 mx-auto">
              <div
                className={`absolute h-16 w-16 border rounded-full border-gray-300 ${
                  ownSub ? "cursor-pointer" : ""
                }`}
                style={{ top: 0 }}
              >
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
                  <h1 className="text-3xl font-bold mb-1">{sub.name}</h1>
                </div>
                <p className="text-sm font-bold text-gray-400">/r/{sub.name}</p>
              </div>
            </div>
          </div>
          {/* 포스트 & 사이드바 */}
          <div className="flex max-w-5xl px-4 pt-5 mx-auto">
            {!edit ? (
              <div className="w-full md:mr-3 md:w-8/12 border section-layout shadow-md">
                {renderPosts}
              </div>
            ) : (
              <div className="w-full md:mr-3 md:w-8/12 section-layout border shadow-md">
                <div className="w-full px-4">
                  <h2 className="main-section-title flex items-center justify-between">
                    아지트 편집{" "}
                    <AiOutlineClose
                      className="ml-2 cursor-pointer"
                      onClick={() => setEdit(false)}
                    />
                  </h2>
                  <Divider className="mb-5 mt-2" />
                  <div>
                    <span className="font-medium text-sm">
                      아지트 대표 사진 설정:{" "}
                    </span>{" "}
                    <div
                      className="w-full mx-0 my-2 text-center rounded-xl border border-gray-300 hover:border-black hover:font-semibold transition cursor-pointer"
                      onClick={() => openFileInput("image")}
                    >
                      <p className="w-full inline-block p-2 text-xs text-blackrounded">
                        편집
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <span className="font-medium text-sm">
                      아지트 베너 사진 설정:{" "}
                    </span>{" "}
                    <div
                      className="w-full mx-0 my-2 text-center rounded-xl border border-gray-300 hover:font-semibold transition cursor-pointer"
                      onClick={() => openFileInput("banner")}
                    >
                      <p className="w-full inline-block p-2 text-xs text-black rounded">
                        편집
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <span className="font-medium text-sm">아지트 삭제: </span>{" "}
                    <div
                      className="w-full mx-0 my-2 text-center rounded-xl bg-red-400 hover:bg-red-600 hover:font-semibold transition cursor-pointer"
                      onClick={() => handleIztDelete()}
                    >
                      <p className="w-full inline-block p-2 text-xs text-white rounded">
                        삭제
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 아지트 사이드 바 */}
            <SideBar sub={sub} ownSub={ownSub} setEdit={setEdit} />
          </div>
        </div>
      )}
    </>
  );
}
