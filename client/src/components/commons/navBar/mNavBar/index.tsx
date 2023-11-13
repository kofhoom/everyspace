import React, { useState } from "react";
import { Button, Divider, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { User } from "@/types";
import Link from "next/link";
import Image from "next/image";
interface IMobileNavProps {
  handleLogout: () => void;
  loading: boolean;
  authenticated: boolean;
  user: User | undefined;
}

export default function MobileNavBarList({
  handleLogout,
  loading,
  authenticated,
  user,
}: IMobileNavProps) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
      ></Button>
      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        extra={
          <>
            <div className="flex flex-col ">
              {!loading &&
                (authenticated ? (
                  <>
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
                    <div className="flex items-center w-36 ml-auto">
                      <Link href={`/u/${user!.username}`} legacyBehavior>
                        <a className="flex justify-center items-center w-full h-full text-xs mr-1 hover:underline cursor-pointer transition">
                          마이 페이지
                        </a>
                      </Link>
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
                  <div className="flex items-center w-28">
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
        <div className="mr-auto">
          <ul className="flex flex-col">
            <li className="text-sm transition hover:font-semibold cursor-pointer">
              <Link href={`/mystore/${user?.username}`} legacyBehavior>
                <a className="text-lg">나의 상점</a>
              </Link>
            </li>
            <li>
              <Divider className="" />
            </li>
            <li className="text-sm transition hover:font-semibold cursor-pointer">
              <Link href={`/community`} legacyBehavior>
                <a className="text-lg">아지트</a>
              </Link>
            </li>
            <li>
              <Divider className="" />
            </li>
          </ul>
        </div>
      </Drawer>
    </>
  );
}
