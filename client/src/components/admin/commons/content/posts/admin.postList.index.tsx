import { Post } from "@/types";
import { FileTextOutlined } from "@ant-design/icons";
import useSwR from "swr";
import dayjs from "dayjs";
import { Button } from "antd";
import BasicTable from "@/src/components/commons/table";
import { MouseEventHandler, useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "@/src/components/commons/searchBar";

const option = [
  { values: "전체" },
  { values: "작성자" },
  { values: "제목" },
  { values: "내용" },
  { values: "장르" },
  { values: "가격형태" },
  { values: "가격" },
];

interface PageContentProps {
  selectedNav?: string;
}

export default function AdminPostsList({ selectedNav }: PageContentProps) {
  const { data, error, mutate } = useSwR<Post[]>("/posts/getAllPost/" || null);
  const [searchData, setSearchData] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeChoose, setSearchTypeChoose] = useState("all");

  // 폼 입력값 변경 핸들러
  useEffect(() => {
    if (searchData.length === 0) {
      mutate(data);
    }

    let koLang: string;
    const map: any = {
      전체: "all",
      작성자: "username",
      제목: "title",
      내용: "body",
      장르: "musicType",
      가격형태: "priceChoose",
      가격: "price",
    };

    koLang = map[searchType];

    setSearchTypeChoose(koLang);
  }, [searchType, searchData, mutate, data]);

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
        data?.length ? data?.length - index : "",
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
      title: "작성자",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "내용",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "장르",
      dataIndex: "musicType",
      key: "musicType",
    },
    {
      title: "음원 파일명",
      dataIndex: "musicFileUrn",
      key: "musicFileUrn",
    },
    {
      title: "가격 형태",
      dataIndex: "priceChoose",
      key: "priceChoose",
    },
    {
      title: "가격",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "링크",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "커버 이미지",
      dataIndex: "imageUrl",
      key: "imageUrl",
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
            data-identifier={el.identifier}
            data-slug={el.slug}
            danger
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];
  const handleDelete: MouseEventHandler<HTMLElement> = async (event) => {
    const identifier = event.currentTarget.getAttribute("data-identifier"); // 이벤트 데이터 속성에서 username 가져오기
    const slug = event.currentTarget.getAttribute("data-slug"); // 이벤트 데이터 속성에서 username 가져오기
    if (!identifier && !slug) return window.alert("사용자 id가 없습니다.");
    if (confirm("정말 삭제하시겠습니까??") == true) {
      // 삭제 확인

      // 승인 처리 API 호출
      try {
        const result = await axios.post(`/posts/${identifier}/${slug}/delete`);
        // API 호출 성공 시 사용자 목록 업데이트
        mutate();
        console.log(result);
      } catch (error) {
        console.error("Error approving user", error);
      }
    } else {
      //취소

      return false;
    }
  };
  return (
    <div className="w-full section-layout">
      <p className="flex items-center text-2xl font-medium pb-3 mb-4 border-b border-b-gray-300">
        <FileTextOutlined className="mr-2" /> 작성 글 리스트
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
      <BasicTable columns={columns} data={data} title={"작성 글 상세"} />
    </div>
  );
}
