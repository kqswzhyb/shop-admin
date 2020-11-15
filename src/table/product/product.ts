export const product = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'productId',
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '图片',
    dataIndex: 'pic',
    key: 'productId',
    align: 'center',
    slots: { customRender: 'pic' },
  },
  {
    title: '产品名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '产品编码',
    dataIndex: 'productCode',
    key: 'productCode',
    align: 'center',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brandName',
    align: 'center',
    slots: { customRender: 'brand' },
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
