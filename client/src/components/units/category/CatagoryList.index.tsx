import React, { useEffect, useState } from "react";
import { Divider, Empty, Segmented } from "antd";
import { catagoryData } from "@/src/commons/dummyData";
import PostCardList from "../post/cardList/PostCardList.index";
import useSWR from "swr";
import { Post } from "@/types";
import axios from "axios";

// 정렬 옵션
const sort = ["최신순", "저가순", "고가순"];

const CatagoryList: React.FC = () => {
  // 검색 데이터 및 정렬 기준 상태 관리
  const [searchData, setValue] = useState<string | number>("전체");
  const [sortChoose, setSortChoose] = useState("최신순");

  // SWR 훅을 사용하여 데이터 가져오기
  const {
    data: catagoryDataList,
    error,
    mutate: catagoryMutate,
  } = useSWR<Post[]>(`/posts/getCatagoryPost/${searchData}/${sortChoose}`); // 포스트 리스트

  // 더미 데이터에서 "선택" 값을 "전체"로 변환
  const newCdata = catagoryData.map((el: any) =>
    el.values === "선택" ? (el.values = "전체") : el.values
  );

  // 데이터 로딩 상태 확인
  const isInitialLoading = !catagoryDataList && !error;
  const isData = catagoryDataList?.length === 0;

  // 정렬 데이터 요청 및 데이터 갱신 함수
  const handelSortData = (sortType: string) => async (e: any) => {
    setSortChoose(sortType);
    try {
      // 정렬 데이터 요청
      const { data: sortData } = await axios.get(
        `/posts/getCatagoryPost/${searchData}/${sortType}`
      );
      // 데이터 갱신

      catagoryMutate(sortData, false);
    } catch (error) {
      console.error("데이터 가져오기 실패", error);
    }
  };

  return (
    <div className="segmented">
      {/* Segmented 컴포넌트를 활용한 카테고리 선택 */}
      <Segmented
        options={newCdata.map((label: string, index: number) => ({
          value: label,
          label: (
            <span
              className={`inline-block pl-1 ${
                searchData === label ? "segmented-active" : ""
              }`}
              key={index}
            >
              {label}
            </span>
          ),
        }))}
        value={searchData}
        onChange={setValue}
      />
      <div className="w-full mb-4 mt-5 flex justify-between">
        {/* 검색 결과 및 정렬 옵션 표시 */}
        <p>
          <span className="text-red-500">{searchData}</span>의 검색결과{" "}
          <span className="text-gray-400">{catagoryDataList?.length}개</span>
        </p>
        <ul className="flex items-center text-sm">
          {sort.map((el: any) => (
            <React.Fragment key={el}>
              <li
                key={el}
                className={`cursor-pointer ${
                  sortChoose === el ? "text-red-500" : ""
                }`}
                onClick={handelSortData(el)}
              >
                {el}
              </li>
              {el == "고가순" ? (
                ""
              ) : (
                <li>
                  <Divider type="vertical" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <div className={`w-full ${isData ? "" : "layout md:flex flex-col"}`}>
        {isInitialLoading && (
          // 데이터 로딩 중일 때 표시
          <p className="text-lg text-center">로딩중입니다.</p>
        )}
        {isData && (
          // 데이터가 없을 때 표시
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
            <p className="text-lg text-center text-gray-300">
              데이터가 없습니다.
            </p>
          </>
        )}

        {catagoryDataList?.map((post: Post) => (
          // PostCardList 컴포넌트를 사용하여 포스트 카드 리스트 표시
          <PostCardList
            key={post.identifier}
            post={post}
            mutate={catagoryMutate}
            type={"catagory"}
          />
        ))}
      </div>
    </div>
  );
};

export default CatagoryList;
