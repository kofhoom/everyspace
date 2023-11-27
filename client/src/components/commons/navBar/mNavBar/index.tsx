import React, { useState } from "react";
import { Button, Divider, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { User } from "@/types";
import Link from "next/link";
import Image from "next/image";

// MobileNavBarList 컴포넌트 정의
interface IMobileNavProps {
  handleLogout: () => void;
  loading: boolean;
  authenticated: boolean;
  user: User | undefined;
}

// MobileNavBarList 함수 컴포넌트 정의
export default function MobileNavBarList({
  handleLogout,
  loading,
  authenticated,
  user,
}: IMobileNavProps) {
  const [open, setOpen] = useState(false);

  const handelDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* 메뉴 아이콘 버튼 */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={handelDrawer}
      ></Button>
      {/* Drawer 컴포넌트 */}
      <Drawer
        placement="right"
        onClose={handelDrawer}
        open={open}
        extra={
          <>
            {/* 사용자 정보 및 메뉴 */}
            <div className="flex flex-col ">
              {!loading &&
                (authenticated ? (
                  <>
                    {/* 인증된 사용자 정보 */}
                    <div className="flex items-center mb-3">
                      <Link href={`/u/${user!.username}`} legacyBehavior>
                        <a className="flex justify-center items-center w-8 h-8 border border-gray-300 rounded-full overflow-hidden mr-2">
                          <Image
                            key={user!.username}
                            src={user!.userImageUrl}
                            alt="sub"
                            className="rounded-full cursor-pointer border-gray-200 object-contain"
                            width={34}
                            height={34}
                          />
                        </a>
                      </Link>
                      <p className="text-xs">
                        <b>{user?.username}</b>님 환영합니다.
                      </p>
                    </div>
                    {/* 로그인된 사용자 메뉴 */}
                    <div className="flex items-center w-36 ml-auto">
                      <div onClick={handelDrawer} className="w-full">
                        <Link href={`/u/${user!.username}`} legacyBehavior>
                          <a className="flex justify-center items-center w-full h-full text-xs mr-1 hover:underline cursor-pointer transition">
                            마이 페이지
                          </a>
                        </Link>
                      </div>
                      <Divider type="vertical" />
                      <div
                        className="flex justify-center items-center w-full h-full text-xs hover:underline cursor-pointer transition"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </div>
                    </div>
                  </>
                ) : (
                  // 미인증 사용자 메뉴
                  <div
                    className="flex items-center w-28"
                    onClick={handelDrawer}
                  >
                    <Link href={`/login`} legacyBehavior>
                      <a className="flex justify-center items-center w-full h-full text-xs hover:underline cursor-pointer transition">
                        로그인
                      </a>
                    </Link>
                    <Divider className="ml-1" type="vertical" />
                    <Link href={`/register`} legacyBehavior>
                      <a className="flex justify-center items-center w-full h-full text-xs hover:underline cursor-pointer transition">
                        회원가입
                      </a>
                    </Link>
                  </div>
                ))}
            </div>
          </>
        }
      >
        {/* 메뉴 목록 */}
        <div className="mr-auto">
          <ul className="flex flex-col">
            <li
              className="text-sm transition hover:font-semibold cursor-pointer"
              onClick={handelDrawer}
            >
              <Link href={`/mystore/${user?.username}`} legacyBehavior>
                <a className="text-lg w-full inline-block">나의 상점</a>
              </Link>
            </li>
            <li>
              <Divider className="" />
            </li>
            <li
              className="text-sm transition hover:font-semibold cursor-pointer"
              onClick={handelDrawer}
            >
              <Link href={`/community`} legacyBehavior>
                <a className="text-lg w-full inline-block">아지트</a>
              </Link>
            </li>
            <li>
              <Divider />
            </li>
          </ul>
        </div>
      </Drawer>
    </>
  );
}
