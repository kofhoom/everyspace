import { useAuthState } from "@/src/context/auth";
import { TbCrown } from "react-icons/tb";
import { Sub, User } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { Tooltip, Button } from "antd";
import { CgUserList } from "react-icons/cg";

export default function SideBar({ sub }: { sub: Sub }) {
  const { authenticated, user } = useAuthState();
  const [error, setError] = useState<any>({});

  const text = sub.subMember?.map((el: any, index) => (
    <div key={index}>
      <span>{el}</span>
    </div>
  ));

  const buttonWidth = 25;

  const btnProps = {
    style: {
      width: buttonWidth,
    },
  };
  const handleRequestApproval = async (userId: string) => {
    // 승인 요청 보내기 API 호출
    try {
      const result = await axios.put(`/auth/${userId}/request-approval`, {
        requesterUserId: user?.username,
      });
      console.log(result);
      window.alert("가입 신청 되었습니다.");
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data || {});
    }
  };
  return (
    <div className="hidden w-4/12 ml-3 md:block">
      <div className="bg-white border rounded">
        <div className="p-3 bg-black rounded-t">
          <p className="font-semibold text-white">{sub?.title}</p>
          <p className="font-semibold text-white">{sub?.name}</p>
          <p className="flex items-center mb-1 text-white">
            <span className="text-xs">{sub?.description}</span>
          </p>
        </div>
        <div className="p-3">
          <p className="flex items-center mb-1">
            <span className="text-sm font-medium">
              개설자 : {sub?.username}
            </span>
            <TbCrown />
          </p>
          <p className="flex items-center mb-1">
            <span className="text-sm font-medium">
              개설일 : {dayjs(sub?.createdAt).format("MM.DD.YYYY")}
            </span>
          </p>
          <p className="flex items-center mb-1">
            <span className="flex items-center text-sm font-medium">
              맴버수 : {sub?.subMemberCount}
              {sub?.subMemberCount && (
                <Tooltip
                  placement="bottom"
                  title={text}
                  className="cursor-pointer"
                >
                  <CgUserList {...btnProps} />
                </Tooltip>
              )}
            </span>
          </p>

          {authenticated && (
            <>
              {user?.username !== sub.username &&
              !sub.subMember?.some((el: any) => el === user?.username) ? (
                <div
                  className="w-full mx-0 my-2 text-center rounded border border-gray-300 hover:border-black hover:font-semibold transition cursor-pointer"
                  onClick={() => handleRequestApproval(sub.username)}
                >
                  <p className="w-full inline-block p-2 text-xs text-black bg-white rounded">
                    가입 신청
                  </p>
                  <p>{error.message}</p>
                </div>
              ) : (
                ""
              )}
              {user?.username === sub.username ||
              sub.subMember?.some((el: any) => el === user?.username) ? (
                <p className="w-full mx-0 my-2 text-center rounded border border-gray-300 hover:border-black hover:font-semibold transition">
                  <Link href={`/r/${sub.name}/create`} legacyBehavior>
                    <a className="w-full inline-block p-2 text-xs text-black bg-white rounded">
                      게시글 등록
                    </a>
                  </Link>
                </p>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
