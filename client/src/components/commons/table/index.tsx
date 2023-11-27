import { Table, Pagination, Divider } from "antd";
import { useState } from "react";
import AdminDetailsList from "../../admin/commons/content/details/admin.detailsList.index";

interface Itabels {
  // 컬럼 및 데이터 정보, 제목, 타입을 받아옴
  columns: any[];
  data: any[] | undefined;
  title?: string;
  type?: string;
}

const BasicTable = ({ columns, data, title, type }: Itabels): JSX.Element => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // 현재 페이지 데이터 계산
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentData = data?.slice(start, end);

  // 확장 행 처리 함수
  const handleExpand = (expanded: any, record: any) => {
    let key = (record.key = record.id);

    // 클릭한 행만 확장하도록 key를 추가
    if (expanded) {
      setExpandedRowKeys([key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  return (
    <>
      {type !== "user" ? (
        // 테이블 컴포넌트 렌더링
        <Table
          columns={columns}
          dataSource={currentData}
          pagination={false}
          scroll={{ x: 1400 }}
          expandable={{
            expandedRowRender: (record, index: number) =>
              expandedRowKeys.includes(record.key) && (
                <>
                  <Divider className="mb-5" />
                  {/* 세부 정보 리스트를 표시하는 컴포넌트 */}
                  <AdminDetailsList title={title} data={data?.[index]} />
                </>
              ),
            expandedRowKeys: expandedRowKeys,
            onExpand: handleExpand,
          }}
        />
      ) : (
        // 유저 타입일 경우 페이지네이션 없이 테이블 렌더링
        <Table columns={columns} dataSource={currentData} pagination={false} />
      )}

      <Pagination
        style={{ display: "flex", justifyContent: "center" }}
        className="mt-5"
        current={page}
        total={data?.length}
        pageSize={pageSize}
        onChange={handleChangePage}
      />
    </>
  );
};

export default BasicTable;
