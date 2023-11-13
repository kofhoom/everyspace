import { Button, Result } from "antd";
import Link from "next/link";

export default function RegisterSuccessList() {
  return (
    <Result
      className="flex items-center flex-col justify-center"
      status="success"
      title="회원 가입이 완료 되었습니다."
      subTitle="서비스 이용을 위해 로그인 페이지로 이동해 주세요."
      extra={[
        <Link href="/login" legacyBehavior key="login">
          <Button
            type="primary"
            style={{ background: "#1677ff", color: "#fff" }}
            className="hover:border-gray-300"
          >
            로그인
          </Button>
        </Link>,
        <Link href="/" legacyBehavior key="main">
          <Button>메인 페이지</Button>
        </Link>,
      ]}
    />
  );
}
