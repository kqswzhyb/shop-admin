export const role = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '角色名',
    dataIndex: 'roleName',
    key: 'roleName',
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
