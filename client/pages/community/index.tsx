// 커뮤니티 페이지
import { GetServerSideProps } from "next";
import axios from "axios";
import CommunityList from "@/src/components/units/community/Community.index";

export default function CommunityPage() {
  return <CommunityList />;
}

// 서버 측에서 실행되는 getServerSideProps 함수를 통해 페이지 인증 처리
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    // 쿠키 헤더에서 쿠키 추출
    const cookie = req.headers.cookie;

    // 쿠키가 없는 경우 에러 발생
    if (!cookie) throw Error("Missing auth token cookie");

    // 백엔드에 쿠키를 포함하여 사용자 정보 요청
    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });

    // 성공 시 빈 객체 반환
    return { props: {} };
  } catch (error) {
    // 에러 발생 시 로그인 페이지로 리다이렉션
    res.writeHead(307, { Location: "../login" }).end();
    return { props: {} };
  }
};
