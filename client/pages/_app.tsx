import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "@/src/context/auth"; //context 설정
import { useRouter } from "next/router";
import NaveBar from "@/src/components/commons/navBar";
import { SWRConfig } from "swr";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; // 쿠키에 유져 토큰 저장 허용
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AuthProvider>
        {!authRoute && <NaveBar />}
        <div className={authRoute ? "" : "pt-16"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}
