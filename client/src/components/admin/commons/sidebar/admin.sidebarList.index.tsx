// src/Sidebar.js
import { Menu } from "antd";

import {
  UserOutlined,
  FileTextOutlined,
  NotificationOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

// AdminSidebar 컴포넌트 정의
interface PageContentProps {
  selectedNav: string;
}

const AdminSidebar = ({ selectedNav }: PageContentProps) => {
  // 선택된 네비게이션에 따라 다른 사이드바 메뉴를 렌더링
  switch (selectedNav) {
    // Home에 해당하는 경우 아무것도 렌더링하지 않음
    case "home":
      return <></>;
    case "members":
      return (
        // 회원 관리 메뉴
        <Menu
          theme="dark"
          mode="inline"
          style={{
            marginTop: "128px",
            background: "#333",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.15)",
          }}
          defaultSelectedKeys={["members"]}
          selectedKeys={[selectedNav]}
        >
          <Menu.Item
            key="members"
            icon={<UserOutlined />}
            style={{ borderRadius: 0 }}
          >
            회원 관리
          </Menu.Item>
        </Menu>
      );
    case "hideout":
      return (
        // 아지트 관리 메뉴
        <Menu
          theme="dark"
          mode="inline"
          style={{
            marginTop: "128px",
            background: "#333",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.15)",
          }}
          defaultSelectedKeys={["hideout"]}
          selectedKeys={[selectedNav]}
        >
          <Menu.Item
            key="hideout"
            icon={<AppstoreAddOutlined />}
            style={{ borderRadius: 0 }}
          >
            아지트 관리
          </Menu.Item>
        </Menu>
      );
    case "posts":
      return (
        // 글 관리 메뉴
        <Menu
          theme="dark"
          mode="inline"
          style={{
            marginTop: "128px",
            background: "#333",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.15)",
          }}
          defaultSelectedKeys={["posts"]}
          selectedKeys={[selectedNav]}
        >
          <Menu.Item
            key="posts"
            icon={<FileTextOutlined />}
            style={{ borderRadius: 0 }}
          >
            글 관리
          </Menu.Item>
        </Menu>
      );

    case "paymemts":
      return (
        // 결제 정보 메뉴
        <Menu
          theme="dark"
          mode="inline"
          style={{
            marginTop: "128px",
            background: "#333",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.15)",
          }}
          defaultSelectedKeys={["paymemts"]}
          selectedKeys={[selectedNav]}
        >
          <Menu.Item
            key="paymemts"
            icon={<NotificationOutlined />}
            style={{ borderRadius: 0 }}
          >
            결제 정보
          </Menu.Item>
        </Menu>
      );
    default:
      return null; // 선택된 Nav에 해당하는 내용이 없는 경우
  }
};

export default AdminSidebar;
