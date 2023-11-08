import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "@/src/context/auth"; //context 설정
import { useRouter } from "next/router";
import NaveBar from "@/src/components/commons/navBar";
import { SWRConfig } from "swr";
import axios from "axios";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import FooterLayout from "@/src/components/commons/footer";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; // 쿠키에 유져 토큰 저장 허용
  const { pathname } = useRouter();
  const authRoutes = ["/admin", "/admin/login"];
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
    <>
      <Head>
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.15.4/js/all.js"
          integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <RecoilRoot>
          <AuthProvider>
            {authRoute ? "" : <NaveBar />}
            <div className={!authRoute ? "pt-12 min-h-screen" : " "}>
              <Component {...pageProps} />
              <FooterLayout />
            </div>
          </AuthProvider>
        </RecoilRoot>
      </SWRConfig>
    </>
  );
}
