// PageContent.js

import AdminMemberList from "./members/admin.membersList.index"; // 회원 리스트
import AdminHideoutList from "./hideout/admin.hideoutList.index"; // 아지트 리스트
import AdminPostsList from "./posts/admin.postList.index"; // 작성글 리스트
import AdminPaymentList from "./payments/admin.paymentsList.index"; // 결제 정보 리스트

interface PageContentProps {
  selectedNav: string;
}

const AdminPageContent = ({ selectedNav }: PageContentProps) => {
  switch (selectedNav) {
    case "home":
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
