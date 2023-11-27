import { Payment } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import useSwR from "swr";
import dayjs from "dayjs";
import axios from "axios";
import BasicTable from "@/src/components/commons/table";
import SearchBar from "@/src/components/commons/searchBar";

// 검색 옵션
const option = [
  { values: "전체" },
  { values: "이메일" },
  { values: "제품명" },
  { values: "전화번호" },
  { values: "구매방식" },
];

interface PageContentProps {
  selectedNav?: string;
}

export default function AdminPaymentList({ selectedNav }: PageContentProps) {
  // useSwR 훅을 사용하여 결제 정보 목록을 가져오기
  const {
    data: payments,
    error,
    mutate,
  } = useSwR<Payment[]>("/payments/list" || null);
  // 검색어와 검색 타입 상태
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    if (searchData.length === 0) {
      // 검색어가 없을 때 모든 결제 정보 목록으로 복원
      mutate(payments);
    }

    let koLang: string;
    const map: any = {
      전체: "all",
      이메일: "username",
      제품명: "title",
      전화번호: "body",
      구매방식: "musicType",
    };

    koLang = map[searchType];

    setSearchTypeChoose(koLang);
  }, [searchType, searchData, mutate, payments]);

  // 검색 실행 핸들러
  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }

    try {
      // 검색 API 호출
      const { data: posts } = await axios.post(
        `/search/${selectedNav}/${searchTypeChoose}/${searchData}`
      );
      // 검색 결과로 결제 정보 데이터 갱신
      mutate(posts, false);
    } catch (error) {
      console.log(error);
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      // 렌더링 함수를 사용하여 순번 표시
      render: (_: any, __: any, index: number) =>
        payments?.length ? payments?.length - index : "",
    },
    {
      title: "생성일자",
      dataIndex: "createdAt",
      key: "createdAt",
      // 렌더링 함수를 사용하여 날짜 형식 변환
      render: (createdAt: string) => (
        <>{dayjs(createdAt).format("YYYY-MM-D")}</>
      ),
    },
    {
      title: "판매자",
      dataIndex: "seller_name",
      key: "seller_name",
    },
    {
      title: "구매자",
      dataIndex: "buyer_name",
      key: "buyer_name",
    },
    {
      title: "구매자 이메일",
      dataIndex: "buyer_email",
      key: "buyer_email",
    },
    {
      title: "구매 제품명",
      dataIndex: "buyer_music_title",
      key: "buyer_music_title",
    },
    {
      title: "제품 가격",
      dataIndex: "paid_amount",
      key: "paid_amount",
    },
    {
      title: "구매자 전화번호",
      dataIndex: "buyer_tel",
      key: "buyer_tel",
    },
    {
      title: "구매 방식",
      dataIndex: "pg_provider",
      key: "pg_provider",
    },
    {
      title: "구매 성공 여부",
      dataIndex: "success",
      key: "success",
      // 렌더링 함수를 사용하여 성공 여부 표시
      render: (el: any) => (
        <div>
          <span>{el ? "성공" : "실패"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full section-layout">
      {/* 섹션 타이틀 */}
      <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
        <UserOutlined className="mr-2" /> 결제 정보 리스트
      </p>
      {/* 검색 바 및 테이블 */}
      <div className="mb-10 flex">
        <SearchBar
          setSearchData={setSearchData}
          handleSearch={handleSearch}
          setSearchType={setSearchType}
          searchType={searchType}
          option={option}
          name="SearchBar"
          type={"admin"}
        />
      </div>
      <BasicTable columns={columns} data={payments} title={"결제 상세"} />
    </div>
  );
}
