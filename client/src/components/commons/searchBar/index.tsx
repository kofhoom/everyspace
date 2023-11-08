import { FaSearch } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";
import { Button, Divider } from "antd";
import SelectGroup from "../select/01";

interface ISeachProps {
  setSearchData: Dispatch<SetStateAction<string>>;
  handleSearch: () => Promise<void>;
  setSearchType?: Dispatch<SetStateAction<string>> | any;
  searchType?: string;
  option?: any[];
  name?: string;
  type?: string;
}

export default function SearchBar({
  setSearchData,
  handleSearch,
  setSearchType,
  searchType,
  option,
  name,
  type,
}: ISeachProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="max-w-full flex mt-11">
        <div
          className={`relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white ${
            type == "main" ? "w-full max-w-4xl m-auto h-11" : ""
          }`}
        >
          <input
            type="text"
            placeholder={`${
              type == "main" ? "아티스트, 트렉, 장르 검색" : "검색"
            }`}
            className={`text-sm px-3 py-1 bg-transparent h-7 rounded focus:outline-none ${
              type == "main" ? "w-full" : ""
            }`}
            onChange={(e) => setSearchData(e.target.value)}
          />
          <FaSearch
            className="mr-2 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        {type == "admin" && (
          <>
            <SelectGroup
              className="ml-3 mr-3"
              value={searchType ?? ""}
              setValue={(str: string) => setSearchType(str)}
              option={option}
              name={name}
            />
          </>
        )}
      </div>
      <Divider className="mb-5" />
    </div>
  );
}
