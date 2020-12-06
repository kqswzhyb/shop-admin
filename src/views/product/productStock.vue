<template>
  <div>
    <div class="flex-between mb20">
      <a-form
        layout="inline"
        ref="search"
        :model="form"
        @submit="searchList(getList)"
        @submit.native.prevent
      >
        <a-form-item name="productId">
          <a-select
            v-model:value="form.productId"
            show-search
            :filter-option="filterOption"
            style="width: 180px"
            placeholder="产品名称"
            allowClear
          >
            <a-select-option
              v-for="item in products"
              :key="item.productId"
              :label="item.name"
              :value="item.productId"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button class="mr10" type="primary" html-type="submit"> 搜索 </a-button>
          <a-button @click="resetForm"> 清空 </a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      class="mt20"
      :columns="columns"
      :data-source="data"
      bordered
      :loading="loading"
      :pagination="pagination"
      rowKey="stockId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
      </template>
      <template #name="{ record }">
        <span>{{ record.product && record.product.name }}</span>
      </template>
      <template #saleStatus="{ record }">
        <span>{{
          record.saleStatus.find(v => v.value === record.saleStatus) &&
            record.saleStatus.find(v => v.value === record.saleStatus).name
        }}</span>
      </template>
      <template #attr="{ record }">
        <div v-for="(item, i) in record.attrList" :key="item.attrId">
          <span>{{ i + 1 + '. ' + item.attrSonName }}</span>
        </div>
      </template>
      <template #operation="{ record }">
        <a-dropdown>
          <a class="dropdown-menu" @click="e => e.preventDefault()">
            <DownCircleOutlined style="font-size:20px;" />
          </a>
          <template v-slot:overlay>
            <a-menu @click="({ key }) => handleMenuClick(key, record)">
              <a-menu-item key="edit">
                <span>编辑</span>
              </a-menu-item>
              <a-menu-divider />
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>

    <a-modal
      v-model:visible="visible"
      :title="title"
      @ok="e => submitProductgForm(e)"
      @cancel="initForm"
    >
      <a-form ref="productg" :model="productgForm" :label-col="{ span: 4 }">
        <a-form-item label="可用库存" name="totalStock" :min="1" v-bind="validateInfos.totalStock">
          <a-input-number
            v-model:value.number="productgForm.totalStock"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="productgForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { stock as columns } from '@/table/product/stock';
import { getProductgList, updateProductgStock, getProductList } from '@/api/product';
import { commonFunc } from '@/utils/util';
import { DownCircleOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import {
  page,
  searchList,
  getList,
  pagination,
  data,
  loading,
  filterOption,
} from '@/mixins/baseForm';

const form = reactive({
  productId: '',
});
const productgForm = reactive({
  productgId: '',
  totalStock: '',
  remark: '',
});
const rulesRef = reactive({
  totalStock: [
    {
      required: true,
      type: 'number',
      message: '请输入可用库存',
    },
  ],
});

const productgs = ref([]);
const products = ref([]);

const visible = ref(false);

const title = ref('');

const { resetFields, validate, validateInfos } = useForm(productgForm, rulesRef);

onBeforeMount(() => {
  getList(getProductgList, form);
  getProductList({ size: 99999 }).then(res => {
    products.value = res.data.data.records;
  });
});

const resetForm = () => {
  form.productId = '';
  searchList(getList);
};

const initForm = () => {
  resetFields();
  closeModal();
};
const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑库存';
    productgForm.totalStock = row.totalStock;
    console.log(productgForm.totalStock, row.totalStock);
    productgForm.productgId = row.productgId;
    productgForm.remark = row.remark;
    visible.value = true;
  }
};

const submitProductgForm = e => {
  e.preventDefault();
  validate().then(() => {
    commonFunc(updateProductgStock, productgForm, closeModal);
  });
};

const closeModal = () => {
  visible.value = false;
  resetFields();
  getList();
};
</script>
