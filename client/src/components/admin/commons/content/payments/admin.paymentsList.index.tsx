import { Payment } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import useSwR from "swr";
import dayjs from "dayjs";
import BasicTable from "@/src/components/commons/table";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";

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
  const {
    data: payments,
    error,
    mutate,
  } = useSwR<Payment[]>("/payments/list" || null);
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    if (searchData.length === 0) {
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

  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }

    try {
      const { data: posts } = await axios.post(
        `/search/${selectedNav}/${searchTypeChoose}/${searchData}`
      );
      mutate(posts, false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",

      render: (_: any, __: any, index: number) =>
        payments?.length ? payments?.length - index : "",
    },
    {
      title: "생성일자",
      dataIndex: "createdAt",
      key: "createdAt",

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
      render: (el: any) => (
        <div>
          <span>{el ? "성공" : "실패"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full section-layout">
      <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
        <UserOutlined className="mr-2" /> 결제 정보 리스트
      </p>
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
