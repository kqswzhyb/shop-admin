import { ref, toRefs, reactive } from 'vue'
import { Page } from '@/api/interface';

export const data = ref([]);

export const loading = ref(false);

export const page: Page = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});
export const filterOption = (input, option) =>
  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

export const searchList = (func) => {
  page.current = 1;
  func();
};


let func2
let form2
export const getList = (func, form) => {
  console.log(func, form)
  if (func) {
    func2 = func
  }
  if (form) {
    form2 = form
  }
  loading.value = true;
  (func ? func(Object.assign({}, page, form ? form : form2)) : func2(Object.assign({}, page, form ? form : form2)))
    .then(res => {
      const result = res.data.data;
      data.value = result.records;
      page.total = result.total;
      page.pageSize = result.pageSize;
    })
    .finally(() => {
      loading.value = false;
    });
};

export const pagination = reactive({
  defaultPageSize: 10,
  showTotal: total => `共 ${total} 条数据`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '50', '100', '200'],
  onShowSizeChange: (current, pageSize) => {
    page.current = 1;
    page.pageSize = pageSize;
    getList('', '');
  },
  onChange: (current, pageSize) => {
    page.current = current;
    page.pageSize = pageSize;
    getList('', '');
  },
  ...toRefs(page),
});
