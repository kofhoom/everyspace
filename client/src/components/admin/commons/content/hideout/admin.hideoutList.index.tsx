import { Sub } from "@/types";
import { Button } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { MouseEventHandler, useState, useEffect } from "react";
import useSwR from "swr";
import dayjs from "dayjs";
import axios from "axios";
import BasicTable from "@/src/components/commons/table";
import SearchBar from "@/src/components/commons/searchBar";

// 검색 옵션
const option = [
  { values: "전체" },
  { values: "개설자" },
  { values: "아지트이름" },
  { values: "개설목적" },
];

interface PageContentProps {
  selectedNav?: string;
}

export default function AdminHideoutList({ selectedNav }: PageContentProps) {
  // useSwR 훅을 사용하여 서브네임 목록을 가져오기
  const { data, error, mutate } = useSwR<Sub[]>("/boards/" || null);

  // 검색어와 검색 타입 상태
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    let koLang: string;
    const map: any = {
      전체: "all",
      개설자: "username",
      아지트이름: "title",
      개설목적: "description",
    };

    koLang = map[searchType];

    setSearchTypeChoose(koLang);
  }, [searchType]);

  // 검색 실행 핸들러
  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }

    try {
      // 검색 API 호출
      const { data: subs } = await axios.post(
        `/search/${selectedNav}/${searchTypeChoose}/${searchData}`
      );
      // 검색 결과로 데이터 갱신
      mutate(subs, false);
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
        data?.length ? data?.length - index : "",
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
      title: "개설자",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "아지트 이름",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "내용",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "개설 목적",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "맴버 수",
      dataIndex: "subMemberCount",
      key: "subMemberCount",
    },
    {
      title: "아지트 대표 사진",
      dataIndex: "imageUrl",
      key: "imageUrl",
      // 렌더링 함수를 사용하여 이미지 표시
      render: (el: string) => (
        <div
          className="w-20 h-20 m-auto rounded-md"
          style={{
            backgroundImage: `url(${el})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid #e5e7eb",
          }}
        ></div>
      ),
    },
    {
      title: "아지트 배너 사진",
      dataIndex: "bannerUrn",
      key: "bannerUrn",
      fixed: "center",
      // 렌더링 함수를 사용하여 이미지 표시
      render: (el: string) =>
        el && (
          <div
            className="w-20 h-20 m-auto rounded-md"
            style={{
              backgroundImage: `url(${el})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid #e5e7eb",
            }}
          ></div>
        ),
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      // 렌더링 함수를 사용하여 삭제 버튼 표시
      render: (el: any) => (
        <div className="w-full flex justify-center">
          <Button
            type="primary"
            className="hover:outline-black font-medium w-15 mr-2"
            size={"middle"}
            onClick={(e) => handleDelete(e)}
            data-name={el.name}
            danger
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  // 삭제 버튼 클릭 핸들러
  const handleDelete: MouseEventHandler<HTMLElement> = async (event) => {
    const name = event.currentTarget.getAttribute("data-name"); // 이벤트 데이터 속성에서 username 가져오기
    if (!name) return window.alert("사용자 name이 없습니다.");
    if (confirm("정말 삭제하시겠습니까??") == true) {
      // 삭제 확인

      // 승인 처리 API 호출
      try {
        const result = await axios.post(`/boards/${name}/delete`);
        // API 호출 성공 시 사용자 목록 업데이트
        mutate();
        console.log(result);
      } catch (error) {
        console.error("Error approving user", error);
      }
    } else {
      return false;
    }
  };
  return (
    <div className="w-full section-layout">
      {/* 섹션 타이틀 */}
      <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
        <AppstoreAddOutlined className="mr-2" /> 아지트 리스트
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
      <BasicTable columns={columns} data={data} title="아지트 상세" />
    </div>
  );
}
