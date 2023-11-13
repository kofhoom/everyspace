import { Descriptions } from "antd";

interface IDetailsProps {
  data: any | undefined;
  title?: string;
}

const AdminDetailsList = ({ data, title }: IDetailsProps) => {
  // data가 null 또는 undefined일 경우 빈 객체로 초기화
  const items = Object.keys(data || {})
    .map((key) => {
      if (key !== "id" && key !== "password" && key !== "key") {
        return {
          label: key,
          content: data[key],
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const getLabelLagChange = (labels: string) => {
    let koLang: string;
    const map: any = {
      id: "아이디",
      createdAt: "생성일",
      updatedAt: "업데이트 일",
      deletedAt: "삭제 일",
      email: "이메일",
      username: "유져이름",
      password: "비밀번호",
      userImageUrn: "유져 프로필 이미지 파일명",
      userImageUrl: "유져 프로필 이미지 파일 경로",
      userBannerUrn: "스토어 베너 이미지 파일명",
      userBannerUrl: "스토어 베너 이미지 파일명 경로",
      bannerUrl: "아지트 베너 이미지 경로",
      isApproved: "가입 승인 여부",
      isRejected: "가입 거절 여부",
      approvalRequsts: "아지트 가입승인 리스트",
      posts: "작성글 개수",
      sub: "아지트 명",
      key: "키값",
      title: "제목",
      priceChoose: "가격형태",
      price: "가격",
      musicType: "장르",
      identifier: "글 고유 파라미터1",
      slug: "글 고유 파라미터2",
      body: "내용",
      subName: "속해있는 아지트명",
      imageUrn: "커버이미지",
      imageUrl: "커버이미지 경로",
      buyername: "구매자",
      musicFileUrn: "음원 파일명",
      musicFileUrl: "음원 파일 경로",
      url: "게시글 링크명",
      description: "개설 목적",
      name: "소주제",
      bannerUrn: "아지트 베너 이미지",
      subMemberCount: "맴버 수",
      subMember: "맴버 리스트",
      buyer_music_title: "구매 제품 제목",
      buyer_email: "판매자 이메일",
      paid_amount: "제품 가격",
      pg_provider: "구매방식",
      buyer_name: "구매자",
      buyer_tel: "구매자 전화번호",
      success: "구매 성공 여부",
      seller_name: "상품 판매자",
      type: "결제 방식",
    };

    koLang = map[labels] || labels;
    return koLang;
  };
  return (
    <Descriptions title={title} bordered>
      {items.map((item) => (
        <Descriptions.Item
          key={item?.label}
          label={getLabelLagChange(item!.label)}
        >
          {!item?.content ||
          item?.content === undefined ||
          item?.content.length === 0 ||
          item?.content === null
            ? "데이터가 없습니다."
            : item?.label === "success"
            ? "성공"
            : item?.label === "sub"
            ? item?.content.map((el: any) => el.title)
            : item?.label === "posts"
            ? item?.content.length + "개"
            : item?.content}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

export default AdminDetailsList;
