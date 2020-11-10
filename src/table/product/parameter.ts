export const parameter = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '参数名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '参数编码',
    dataIndex: 'parameterCode',
    key: 'parameterCode',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    key: 'createAt',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    slots: { customRender: 'operation' },
  },
];
