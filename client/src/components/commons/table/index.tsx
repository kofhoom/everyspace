import { Table } from "antd";
import React from "react";

interface Itabels {
  columns: any[];
  data: any[] | undefined;
}

const BasicTable = ({ columns, data }: Itabels) => (
  <Table columns={columns} dataSource={data} />
);

export default BasicTable;
