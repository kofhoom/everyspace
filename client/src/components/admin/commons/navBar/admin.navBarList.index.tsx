// src/Navbar.js
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  NotificationOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { selectedNavState } from "@/src/commons/recoil";
import { useAuthDispatch, useAuthState } from "@/src/context/auth";
import axios from "axios";
import Link from "next/link";

const { Header } = Layout;

// AdminNavbar 컴포넌트 정의
const AdminNavbar = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  // 로그아웃 처리 함수
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

  // Recoil을 사용하여 선택된 네비게이션 상태를 가져오고 설정하는 부분
  const [selectedNav, setSelectedNav] = useRecoilState(selectedNavState);
  const handleNavClick = (nav: any) => {
    setSelectedNav(nav.key);
  };
  // 컴포넌트 렌더링
  return (
    <Header
      style={{
        position: "fixed",
        zIndex: 2,
        width: "100%",
        background: "#1890ff",
        color: "#fff",
        fontSize: "18px",
        padding: "0",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="logo px-3 flex justify-between">
        {/* 홈페이지로 이동하는 링크 */}
        <Link href={`/admin`} legacyBehavior>
          My Admin
        </Link>
        {/* 사용자 정보 및 로그아웃, 홈페이지로 이동하는 섹션 */}
        <div className="flex items-center">
          <p className="text-xs mr-3">
            <b>{user?.username}</b>님 환영합니다.
          </p>
          <span
            className="cursor-pointer inline-block mr-3"
            onClick={handleLogout}
          >
            로그아웃
          </span>
          <Link href={`/`} legacyBehavior>
            홈페이지
          </Link>
        </div>
      </div>
      {/* 네비게이션 메뉴 */}
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        selectedKeys={[selectedNav]}
        onClick={handleNavClick}
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="members" icon={<UserOutlined />}>
          회원 관리
        </Menu.Item>
        <Menu.Item key="hideout" icon={<AppstoreAddOutlined />}>
          아지트 관리
        </Menu.Item>
        <Menu.Item key="posts" icon={<FileTextOutlined />}>
          글 관리
        </Menu.Item>
        <Menu.Item key="paymemts" icon={<NotificationOutlined />}>
          결제 정보
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AdminNavbar;
