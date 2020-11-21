export const stock = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'stockId',
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    slots: { customRender: 'name' },
  },
  {
    title: '产品属性',
    dataIndex: 'attr',
    key: 'attr',
    align: 'left',
    slots: { customRender: 'attr' },
  },
  {
    title: '可用库存',
    dataIndex: 'totalStock',
    key: 'totalStock',
    align: 'center',
  },
  {
    title: '锁定库存',
    dataIndex: 'lockStock',
    key: 'lockStock',
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
