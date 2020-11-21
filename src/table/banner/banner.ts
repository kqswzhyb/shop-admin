export const banner = [
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '链接',
    dataIndex: 'link',
    key: 'link',
    align: 'center',
  },
  {
    title: '位置',
    dataIndex: 'place',
    key: 'place',
    align: 'center',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
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
