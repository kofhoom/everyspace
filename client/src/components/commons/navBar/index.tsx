import { useAuthDispatch, useAuthState } from "@/src/context/auth";
import { Divider } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import MobileNavBarList from "./mNavBar";

// NavBar 컴포넌트 정의
export default function NaveBar() {
  const { loading, authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();

  // 로그아웃 핸들러
  const handleLogout = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-13 p-3 bg-white border-b max-w-6xl m-auto">
      {/* 로고 */}
      <div>
        <Link href="/" legacyBehavior>
          <a className="flex items-center">
            <Image
              src="/mainLogo.png"
              alt="logo"
              width={30}
              height={30}
              className="mr-1"
            />
            <span className="mr-5 font-extrabold inline-block">ORIZIC</span>
          </a>
        </Link>
      </div>
      {/* PC 화면 네비게이션 */}
      <div className="mr-auto ms:hidden">
        <ul className="flex items-center">
          <li className="text-sm transition hover:font-semibold cursor-pointer mr-3">
            <Link href={`/mystore/${user?.username}`} legacyBehavior>
              <a className="text-xs">나의 상점</a>
            </Link>
          </li>{" "}
          <li className="text-sm mr-3">
            <Divider className="ml-1 mr-1" type="vertical" />
          </li>
          <li className="text-sm transition hover:font-semibold cursor-pointer">
            <Link href={`/community`} legacyBehavior>
              <a className="text-xs">아지트</a>
            </Link>
          </li>
        </ul>
      </div>
      {/* PC 화면 업로드 버튼 */}
      <div className="ml-auto pr-5">
        <div className="text-sm  cursor-pointer mr-2">
          <button className="w-20 px-2 text-xs h-7 text-center text-gray-400 font-normal border-gray-300 hover:border-blue-500 hover:font-semibold hover:text-blue-500 transition rounded-xl border">
            <Link href={`/create`} legacyBehavior>
              <a className="flex justify-center items-center w-full h-full text-xs text-gray-30">
                업로드
              </a>
            </Link>
          </button>
        </div>
      </div>
      {/* 사용자 정보 및 로그인/로그아웃 버튼 */}
      <div className="flex items-center ms:hidden">
        {!loading &&
          (authenticated ? (
            <>
              {/* 인증된 사용자 정보 */}
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
              <p className="text-xs mr-4">
                <b>{user?.username}</b>님 환영합니다.
              </p>
              <div className="flex items-center w-32">
                <Link href={`/u/${user!.username}`} legacyBehavior>
                  <a className="flex justify-center items-center w-full h-full text-xs mr-1 hover:underline cursor-pointer transition">
                    마이 페이지
                  </a>
                </Link>
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
            <div className="flex items-center w-28">
              <Link href={`/login`} legacyBehavior>
                <a className="flex justify-center items-center w-full h-full text-xs mr-2 hover:underline cursor-pointer transition">
                  로그인
                </a>
              </Link>
              <Link href={`/register`} legacyBehavior>
                <a className="flex justify-center items-center w-full h-full text-xs hover:underline cursor-pointer transition">
                  회원가입
                </a>
              </Link>
            </div>
          ))}
      </div>
      {/* 모바일 화면 네비게이션 */}
      <div className="hidden ms:block">
        <MobileNavBarList
          loading={loading}
          authenticated={authenticated}
          user={user}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}
