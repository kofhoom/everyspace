import { User } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import useSwR from "swr";
import dayjs from "dayjs";
import { Button } from "antd";
import BasicTable from "@/src/components/commons/table";
import { MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";

const option = [{ values: "전체" }, { values: "닉네임" }, { values: "이메일" }];

interface PageContentProps {
  selectedNav?: string;
}

export default function AdminMemberList({ selectedNav }: PageContentProps) {
  const { data: users, mutate } = useSwR<User[]>("/users/" || null);
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    if (searchData.length === 0) {
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

  const handleSearch = async () => {
    if (!searchData) {
      window.alert("검색어를 입력해 주세요");
      return;
    }

    try {
      const { data: users } = await axios.post(
        `/search/${selectedNav}/${searchTypeChoose}/${searchData}`
      );
      mutate(users, false);
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
        users?.length ? users?.length - index : "",
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
      <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
        <UserOutlined className="mr-2" /> 회원 리스트
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
      <BasicTable columns={columns} data={users} title={"회원 상세"} />
    </div>
  );
}
