import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "@/src/context/auth"; //context 설정

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; // 쿠키에 유져 토큰 저장 허용
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
