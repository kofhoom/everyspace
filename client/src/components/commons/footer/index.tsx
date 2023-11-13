/* eslint-disable @next/next/no-img-element */
import { Layout, Divider } from "antd";

const { Footer } = Layout;

function FooterLayout() {
  return (
    <div className="w-full max-w-6xl m-auto">
      <Divider className="mb-5 mt-2" />

      <Footer
        className="bg-gray-100 border-b max-w-6xl m-auto items-center w-full h-full text-xs"
        style={{ textAlign: "center" }}
      >
        <div className="w-full">
          <div className="flex items-center mb-2">
            <img
              src="/mainLogo.png"
              alt="Company Logo"
              style={{ height: "30px" }}
            />
            <span className="ml-1 font-extrabold inline-block text-base">
              ORIZIC
            </span>
          </div>
          <div className="text-left">
            <p>(주)오리직 | 대표자: 김준수 | 사업자번호: 444-44-00612</p>
            <p>
              통신판매업: 2023-서울봉화-0062 | 개인정보보호책임자: 김준수 |
              이메일: info@ORIZIC.com
            </p>
            <p>전화번호: 070-4948-1181 | 주소: 서울시 강남구 11길 1층</p>
            <p className="mt-2">© 2023 ORIZIC</p>
          </div>
        </div>
      </Footer>
    </div>
  );
}

export default FooterLayout;
