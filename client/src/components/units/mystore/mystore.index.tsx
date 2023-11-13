import { Post } from "@/types";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCardList from "../post/cardList/PostCardList.index";
import Image from "next/image";
import { Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import { TfiWrite } from "react-icons/tfi";
import { Space } from "antd";

import axios from "axios";
import { useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useAuthState } from "@/src/context/auth";
import { CameraOutlined } from "@ant-design/icons";
import { FaRegCopy } from "react-icons/fa";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { handleCopyClipBoard } from "@/utils/helpers";

export default function MyStoreList() {
  const router = useRouter();
  const username = router.query.username;
  const { data, error, mutate } = useSWR(
    username ? `/users/${username}` : null
  );

  const { authenticated, user } = useAuthState();
  const [size, setSize] = useState<SizeType>("middle"); // default is 'middle'
  const [ownSub, setOwnSub] = useState<Boolean | string>(false);

  // 자신의 글인지 판별 유무
  useEffect(() => {
    if (!user) return;
    setOwnSub(authenticated && user.username === data?.user.username);
  }, [authenticated, data?.user.username, user]);

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
      await axios.post(`/mystore/${username}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };
  if (!data) return null;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `${data.user.username}의 음악`,
      children: (
        <>
          <div className="w-full section-layout border shadow-md  ms:px-5">
            <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
              <TfiWrite className="mr-2" /> {data.user.username}의 음악
            </p>
            {data.userData.map((data: any) => {
              if (data.type === "Post") {
                const post: Post = data;
                return (
                  <>
                    <PostCardList
                      key={post.identifier}
                      post={post}
                      type={"mystore"}
                    />
                  </>
                );
              }
            })}
          </div>
        </>
      ),
    },
  ];
  return (
    <div className=" max-w-5xl px-4 pt-5 mx-auto mb-5">
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadImage}
      />
      <div className="w-full mb-3">
        <div className={`py-5 relative bg-gray-400`}>
          <div className="h-full absolute top-0 left-0 w-full mystore-banner-wrap">
            <Image
              src={data?.user.userBannerUrl || "/9ca3af.png"}
              alt="유져 베너 이미지"
              className="w-full object-cover"
              width={70}
              height={70}
            ></Image>
            {ownSub ? (
              <Button
                className="h-8 absolute top-2 right-2 bg-white z-10 cursor-pointer mystore-banner-btn"
                icon={<CameraOutlined />}
                onClick={() => openFileInput("banner")}
              >
                이미지 업데이트
              </Button>
            ) : (
              ""
            )}
          </div>

          <div className="bg-transparent flex items-center border-t border-b mb-3 w-fit">
            <div className="w-full relative flex max-w-5xl px-5 mx-auto">
              <div
                className={`relative mystore-profile h-44 w-44 rounded-full ${
                  ownSub ? "cursor-pointer" : ""
                }`}
                style={{ top: 0 }}
              >
                <Image
                  src={data.user.userImageUrl}
                  alt="커뮤니티 이미지"
                  width={70}
                  height={70}
                  className="rounded-full w-full h-full"
                ></Image>
                {ownSub ? (
                  <Button
                    className="h-8 absolute bottom-0 bg-white z-13 cursor-pointer mystore-banner-btn"
                    icon={<CameraOutlined />}
                    style={{ transform: "translateX(-50%)", left: "50%" }}
                    onClick={() => openFileInput("image")}
                  >
                    이미지 업데이트
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div className="pt-1 pl-8">
                <div className="flex items-center">
                  <h1
                    className="text-3xl mb-2"
                    style={{
                      backgroundColor: "rgba(0,0,0,.8)",
                      color: "#fff",
                      lineHeight: "37px",
                      padding: "4px 7px",
                    }}
                  >
                    {username}
                  </h1>
                </div>
                <p
                  className="text-sm font-bold text-gray-400"
                  style={{
                    backgroundColor: "rgba(0,0,0,.8)",
                    color: "#ccc",
                    lineHeight: "1.2",
                    padding: "2px 7px 3px",
                    fontSize: "12px",
                  }}
                >
                  /mystore/{username}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 커뮤니티 메타 데이터 */}
      </div>
      <div className="w-full text-end">
        <Space wrap className="mb-2 ml-auto">
          <Button
            block
            type="primary"
            icon={<FaRegCopy />}
            size={size}
            onClick={handleCopyClipBoard(
              `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/mystore/${data?.user.username}`
            )}
          >
            링크 공유
          </Button>
        </Space>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="w-full custom"
        tabPosition={"top"}
        type="card"
      />
    </div>
  );
}
