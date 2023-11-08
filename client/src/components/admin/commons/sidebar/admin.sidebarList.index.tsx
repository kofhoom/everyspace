// src/Sidebar.js
import { Menu } from "antd";

import {
  UserOutlined,
  FileTextOutlined,
  NotificationOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

interface PageContentProps {
  selectedNav: string;
}

const AdminSidebar = ({ selectedNav }: PageContentProps) => {
  switch (selectedNav) {
    case "home":
      return <></>;
    case "members":
      return (
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
    // case "notifications":
    //   return (
    //     <Menu
    //       theme="dark"
    //       mode="inline"
    //       style={{
    //         marginTop: "128px",
    //         background: "#333",
    //         boxShadow: "2px 0 5px rgba(0, 0, 0, 0.15)",
    //       }}
    //       defaultSelectedKeys={["notifications"]}
    //       selectedKeys={[selectedNav]}
    //     >
    //       <Menu.Item
    //         key="notifications"
    //         icon={<NotificationOutlined />}
    //         style={{ borderRadius: 0 }}
    //       >
    //         공지사항
    //       </Menu.Item>
    //     </Menu>
    //   );
    case "paymemts":
      return (
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
