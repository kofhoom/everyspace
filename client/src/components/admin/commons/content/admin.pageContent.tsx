// PageContent.js
// 각 섹션에 필요한 컴포넌트들을 import
import AdminMemberList from "./members/admin.membersList.index"; // 회원 리스트
import AdminHideoutList from "./hideout/admin.hideoutList.index"; // 아지트 리스트
import AdminPostsList from "./posts/admin.postList.index"; // 작성글 리스트
import AdminPaymentList from "./payments/admin.paymentsList.index"; // 결제 정보 리스트

// PageContent 컴포넌트에 대한 프롭스를 정의
interface PageContentProps {
  selectedNav: string;
}

// 선택된 네비게이션에 기반하여 다른 섹션을 동적으로 렌더링하는 AdminPageContent
const AdminPageContent = ({ selectedNav }: PageContentProps) => {
  // 선택된 네비게이션에 따라 어떤 섹션을 렌더링할지 결정하는 switch 문
  switch (selectedNav) {
    case "home":
      // home 섹션을 두 개의 컴포넌트 행으로 렌더링
      return (
        <>
          <div className="flex w-full layout2 mb-10">
            <AdminMemberList />
            <AdminHideoutList />
          </div>
          <div className="flex w-full layout2 mb-10">
            <AdminPostsList />
            <AdminPaymentList />
          </div>
        </>
      );
    case "members":
      return <AdminMemberList selectedNav={selectedNav} />;
    case "hideout":
      return <AdminHideoutList selectedNav={selectedNav} />;
    case "posts":
      return <AdminPostsList selectedNav={selectedNav} />;
    case "paymemts":
      return <AdminPaymentList selectedNav={selectedNav} />;
    default:
      return null; // 선택된 Nav에 해당하는 내용이 없는 경우
  }
};

export default AdminPageContent;
