import axios from "axios";
import { GetServerSideProps } from "next";

// 어드민 메인 페이지
import { Layout } from "antd";
import AdminSidebar from "@/src/components/admin/commons/sidebar/admin.sidebarList.index";
import AdminNavbar from "@/src/components/admin/commons/navBar/admin.navBarList.index";
import AdminPageContent from "@/src/components/admin/commons/content/admin.pageContent";
import { selectedNavState } from "@/src/commons/recoil";
import { useRecoilValue } from "recoil";

const { Sider, Content } = Layout;

function App() {
  const selectedNav = useRecoilValue(selectedNavState);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <Sider width={200} theme="dark">
        <AdminSidebar selectedNav={selectedNav} />
      </Sider>
      <Layout>
        <Content style={{ padding: "24px", paddingTop: "158px" }}>
          <AdminPageContent selectedNav={selectedNav} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

// 인증에 따른 제한
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없다면 에러를 보내기
    if (!cookie) throw Error("Missing auth token cookie");

    // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에 인증 처리하기
    await axios.get("/auth/me", { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    // 백엔드에서 요청에서 던져준 쿠기를 이용해 인증 처리할 떄 에러가 나면 /login 페이지로 이동
    res.writeHead(307, { Location: "../admin/login" }).end();
    return { props: {} };
  }
};
