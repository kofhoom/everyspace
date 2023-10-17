import { useAuthDispatch, useAuthState } from "@/src/context/auth";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function NaveBar() {
  const { loading, authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();
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
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-13 px-5 bg-white border-b">
      <span
        style={{ width: 50 }}
        className="text-2xl font-semibold text-gray-400 inline-block"
      >
        <Link href="/" legacyBehavior>
          <a>
            <Image src="/mlogo.png" alt="logo" width={80} height={80} />
          </a>
        </Link>
      </span>
      <span className="mr-3 font-extrabold">ORIZIC</span>
      {/* 검색 박스 시작 */}
      <div className="max-w-full pr-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <FaSearch className="ml-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search.."
            className="px-3 py-1 bg-transparent h-7 rounded focus:outline-none"
          />
        </div>
      </div>
      <div className="ml-auto pr-10">
        <p className="text-sm font-semibold cursor-pointer">
          <Link href={`/community`} legacyBehavior>
            <a className="text-xs">커뮤니티</a>
          </Link>
        </p>
      </div>
      <div className="flex items-center">
        {!loading &&
          (authenticated ? (
            <>
              <Link href={`/u/${user!.username}`} legacyBehavior>
                <a className="flex justify-center items-center w-8 h-8 border border-gray-300 rounded-full overflow-hidden mr-2">
                  <Image
                    key={user!.username}
                    src={user!.userImageUrl}
                    alt="sub"
                    className="rounded-full cursor-pointer border-gray-200"
                    width={34}
                    height={34}
                  />
                </a>
              </Link>
              <p className="text-xs mr-2">
                <b>{user?.username}</b>님 환영합니다.
              </p>
              <button className="w-21 px-2 mr-2 text-sm h-7 text-center text-white bg-black rounded">
                <Link href={`/u/${user!.username}`} legacyBehavior>
                  <a className="text-xs">마이 페이지</a>
                </Link>
              </button>
              <button
                className="w-20 px-2 mr-2 text-xs h-7 text-center text-white bg-gray-400 rounded"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" legacyBehavior>
                <a className="w-20 px-2 pt-1 mr-2 h-7 text-sm text-center text-orange-500 border border-orange-400 rounded">
                  로그인
                </a>
              </Link>
              <Link href="/register" legacyBehavior>
                <a className="w-20 px-2 pt-1 mr-2 h-7 text-sm text-center text-white bg-orange-500 rounded">
                  회원가입
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}
