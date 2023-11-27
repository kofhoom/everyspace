/* eslint-disable @next/next/no-img-element */
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Avatar, Space, Card } from "antd";
import { TbCrown } from "react-icons/tb";
import { useRouter } from "next/router";
import { Sub } from "@/types";

const IconText = ({ icon, text }: { icon: React.FC; text: any }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const { Meta } = Card;

export default function AgitList(props: { data: Sub }) {
  const router = useRouter();
  const moveToPage = () => {
    router.push(`/r/${props.data.name}`);
  };

  return (
    <Card
      className="rounded-lg shadow-md hover:shadow-xl transition-shadow border"
      cover={
        <img
          alt="아지트 베너 사진"
          src={props.data?.bannerUrl ?? "/mainLogo.png"}
          onClick={moveToPage}
          className="cursor-pointer"
        />
      }
      actions={[
        <IconText
          icon={TbCrown}
          text={
            <div>
              <p className="font-bold">아지트장</p>
              <p>{props.data?.username}</p>
            </div>
          }
          key="list-vertical-star-o"
        />,
        <IconText
          icon={UserOutlined}
          text={
            <div>
              <p className="font-bold">맴버수</p>
              <p>{props.data?.subMemberCount}</p>
            </div>
          }
          key="list-vertical-like-o"
        />,
        <IconText
          icon={EditOutlined}
          text={
            <div>
              <p className="font-bold">게시글 수</p>
              <p>{props.data?.posts?.length}</p>
            </div>
          }
          key="list-vertical-message"
        />,
      ]}
    >
      <Meta
        // avatar={<Avatar src={props.data?.imageUrl} />}
        title={props.data?.name}
        description={props.data?.description}
      />
    </Card>
  );
}
