import { useAuthState } from "@/src/context/auth";
import { TbCrown } from "react-icons/tb";
import { Sub } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { Tooltip, Divider } from "antd";
import { CgUserList } from "react-icons/cg";
// BiImage

interface ISideBarProps {
  // 게시판 정보와 권한 정보를 받아옴
  sub: Sub;
  ownSub: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

export default function SideBar({ sub, ownSub, setEdit }: ISideBarProps) {
  const { user } = useAuthState(); // 사용자 인증 정보를 가져옴
  const [error, setError] = useState<any>({}); // 에러 상태 관리

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

  // 가입 신청 처리 함수
  const handleRequestApproval = async (userId: string) => {
    if (ownSub) return; // 자신이 개설한 게시판인 경우 가입 신청 불가

    // 승인 요청 보내기 API 호출
    try {
      // 가입 신청 API 호출
      const result = await axios.put(`/auth/${userId}/request-approval`, {
        requesterUserId: user?.username,
      });

      window.alert("가입 신청 되었습니다.");
    } catch (error: any) {
      console.log(error);
      setError(error?.response?.data || {});
    }
  };
  return (
    <div className="w-4/12 ml-3 ms:w-full ms:ml-0">
      <div className="bg-white border rounded-lg shadow-md">
        <div className="p-3 bg-black rounded-t">
          <p className="font-semibold text-white">{sub?.name}</p>
          <Divider className="mb-3 mt-3 bg-white" />
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
              맴버수 :{" "}
              {sub?.subMemberCount && (
                <span className="flex items-center">
                  {sub?.subMemberCount}
                  <Tooltip
                    placement="bottom"
                    title={text}
                    className="cursor-pointer"
                  >
                    <CgUserList {...btnProps} />
                  </Tooltip>
                </span>
              )}
            </span>
          </p>
          <>
            {!ownSub &&
            !sub.subMember?.some((el: any) => el === user?.username) ? (
              <div
                className="w-full mx-0 my-2 text-center rounded border border-gray-300 hover:border-black hover:font-semibold transition cursor-pointer"
                onClick={() => handleRequestApproval(sub.username)}
              >
                <p className="w-full inline-block p-2 text-xs text-black bg-white rounded">
                  가입 신청
                </p>
                {error.message && (
                  <p className="text-xs mb-2 text-red-600">{error.message}</p>
                )}
              </div>
            ) : (
              ""
            )}
            {ownSub ||
            sub.subMember?.some((el: any) => el === user?.username) ? (
              <p className="w-full mx-0 my-2 text-center rounded-xl border border-gray-300 hover:border-black hover:font-semibold transition">
                <Link href={`/r/${sub.name}/create`} legacyBehavior>
                  <a className="w-full inline-block p-2 text-xs text-black">
                    게시글 등록
                  </a>
                </Link>
              </p>
            ) : (
              ""
            )}
            {ownSub && (
              <div
                className="w-full mx-0 my-2 text-center rounded-xl border border-gray-300 hover:border-blue-500 hover:text-blue-500 hover:font-semibold transition cursor-pointer"
                onClick={() => setEdit(true)}
              >
                <p className="w-full inline-block p-2 text-xs">편집</p>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
