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

const AdminNavbar = () => {
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

  const [selectedNav, setSelectedNav] = useRecoilState(selectedNavState);
  const handleNavClick = (nav: any) => {
    setSelectedNav(nav.key);
  };
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
        <Link href={`/admin`} legacyBehavior>
          <a>My Admin</a>
        </Link>
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
            <a href="/">홈페이지</a>
          </Link>
        </div>
      </div>
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
