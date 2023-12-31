// 글 업로드 페이지
import PostCreateList from "@/src/components/units/post/create/PostCreate.index";
import axios from "axios";
import { GetServerSideProps } from "next";

export default function PostCreatePage() {
  return <PostCreateList />;
}

// 인증에 따른 제한
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    // 쿠키가 없다면 에러를 보내기
    if (!cookie) throw Error("Missing auth token cookie");

    // 쿠키가 있다면 그 쿠키를 이용해서 백엔드에 인증 처리하기
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });
    return { props: {} };
  } catch (error) {
    // 백엔드에서 요청에서 던져준 쿠기를 이용해 인증 처리할 떄 에러가 나면 /login 페이지로 이동
    res.writeHead(307, { Location: "../login" }).end();
    return { props: {} };
  }
};
