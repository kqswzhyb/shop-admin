export const brand = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'brandId',
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '图片',
    dataIndex: 'pic',
    key: 'brandId',
    align: 'center',
    slots: { customRender: 'pic' },
  },
  {
    title: '品牌名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '品牌编码',
    dataIndex: 'brandCode',
    key: 'brandCode',
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
