import { useAuthDispatch, useAuthState } from "@/src/context/auth";
import axios from "axios";
import Link from "next/link";

export default function NaveBar() {
  const { loading, authenticated } = useAuthState();
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
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center justify-between h-16 px-5 bg-white">
      <span
        style={{ width: 50 }}
        className="text-2xl font-semibold text-gray-400 inline-block"
      >
        <Link href="/">
          <img src="/logo.png" alt="" />
        </Link>
      </span>
      {/* 검색 박스 시작 */}
      <div className="max-w-full pr-4" style={{ width: "calc(100% - 64px)" }}>
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <input
            type="text"
            placeholder="Search.."
            className="px-3 py-1 bg-transparent rounded focus:outline-none"
          />
        </div>
      </div>
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 p-2 mr-2 text-center text-white bg-gray-400 rounded"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/login" legacyBehavior>
                <a className="w-20 p-2 mr-2 text-center text-orange-500 border border-orange-400 rounded">
                  로그인
                </a>
              </Link>
              <Link href="/register" legacyBehavior>
                <a className="w-20 p-2 mr-2 text-center text-white bg-orange-500 rounded">
                  회원가입
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}
