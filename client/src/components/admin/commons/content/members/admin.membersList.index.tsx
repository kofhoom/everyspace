import { User } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import useSwR from "swr";
import dayjs from "dayjs";
import { Button } from "antd";
import BasicTable from "@/src/components/commons/table";
import { MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";

// 검색 옵션
const option = [{ values: "전체" }, { values: "닉네임" }, { values: "이메일" }];

interface PageContentProps {
  selectedNav?: string;
}

export default function AdminMemberList({ selectedNav }: PageContentProps) {
  // useSwR 훅을 사용하여 사용자 목록을 가져오기
  const { data: users, mutate } = useSwR<User[]>("/users/" || null);
  // 검색어와 검색 타입 상태
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    if (searchData.length === 0) {
      // 검색어가 없을 때 모든 사용자 목록으로 복원
      mutate(users);
    }

    let koLang: string;
    const map: any = {
      전체: "all",
      닉네임: "username",
      이메일: "email",
    };
    koLang = map[searchType];

    setSearchTypeChoose(koLang);
  }, [searchType, searchData, mutate, users]);

  // 검색 실행 핸들러
  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }

    try {
      // 검색 API 호출
      const { data: users } = await axios.post(
        `/search/${selectedNav}/${searchTypeChoose}/${searchData}`
      );
      // 검색 결과로 사용자 데이터 갱신
      mutate(users, false);
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
        users?.length ? users?.length - index : "",
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
      title: "이메일",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "닉네임",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "아지트 개설여부",
      dataIndex: "sub",
      key: "sub",
      // 렌더링 함수를 사용하여 아지트 개설 여부 표시
      render: (el: any) => (
        <div>
          <span>{el?.title ? "yes" : "no"}</span>
        </div>
      ),
    },
    {
      title: "가입한 아지트 명",
      dataIndex: "sub",
      key: "sub",
      // 렌더링 함수를 사용하여 가입한 아지트 명 표시
      render: (el: any) => (
        <div>
          <span>{el?.title ? el?.title : "없음"}</span>
        </div>
      ),
    },
    {
      title: "프로필 사진",
      dataIndex: "userImageUrl",
      key: "userImageUrl",
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
            data-username={el.username}
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
    const username = event.currentTarget.getAttribute("data-username"); // 이벤트 데이터 속성에서 username 가져오기
    if (!username) return window.alert("사용자 username이 없습니다.");
    if (confirm("정말 삭제하시겠습니까??") == true) {
      // 승인 처리 API 호출
      try {
        const result = await axios.post(`/users/${username}/delete`);
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
        <UserOutlined className="mr-2" /> 회원 리스트
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
      <BasicTable columns={columns} data={users} title={"회원 상세"} />
    </div>
  );
}
