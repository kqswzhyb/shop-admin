<template>
  <div>
    <div class="flex-between mb20">
      <a-form layout="inline" :model="form" @submit="searchList(getList)" @submit.prevent>
        <a-form-item name="name">
          <a-input v-model:value.trim="form.name" allowClear placeholder="参数名" />
        </a-form-item>
        <a-form-item name="parameterCode">
          <a-input v-model:value.trim="form.parameterCode" allowClear placeholder="参数编码" />
        </a-form-item>
        <a-form-item>
          <a-button class="mr10" type="primary" html-type="submit"> 搜索 </a-button>
          <a-button @click="resetForm"> 清空 </a-button>
        </a-form-item>
      </a-form>

      <div>
        <a-button
          type="primary"
          @click="
            visible = true;
            title = '添加参数';
          "
        >
          添加
        </a-button>
      </div>
    </div>

    <a-table
      class="mt20"
      :columns="columns"
      :data-source="data"
      bordered
      :loading="loading"
      :pagination="pagination"
      rowKey="parameterId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
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
              <a-menu-item key="删除">
                <a-popconfirm
                  :title="`是否删除参数 ${record?.name}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="
                    commonFunc(
                      deleteProductParameter,
                      { parameterId: record?.parameterId },
                      closeModal,
                    )
                  "
                >
                  <span>删除</span>
                </a-popconfirm>
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
      @ok="e => submitParameterForm(e)"
      @cancel="initForm"
    >
      <a-form :model="parameterForm" :label-col="{ span: 4 }">
        <a-form-item label="参数名" name="name" v-bind="validateInfos.name">
          <a-input v-model:value.trim="parameterForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="参数编码" name="parameterCode" v-bind="validateInfos.parameterCode">
          <a-input
            v-model:value.trim="parameterForm.parameterCode"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="parameterForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { parameter as columns } from '@/table/product/parameter';
import {
  getProductParameterList,
  updateProductParameter,
  deleteProductParameter,
  createProductParameter,
} from '@/api/product';
import { commonFunc, downLoadFile } from '@/utils/util';
import { DownCircleOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { page, searchList, getList, pagination, data, loading } from '@/mixins/baseForm';

const form = reactive({
  name: '',
  parameterCode: '',
});
const parameterForm = reactive({
  name: '',
  parameterId: '',
  parameterCode: '',
  remark: '',
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入品牌名',
    },
  ],
  parameterCode: [
    {
      required: true,
      message: '请输入品牌编码',
    },
  ],
});

const parameters = ref([]);

const visible = ref(false);

const title = ref('');

const { resetFields, validate, validateInfos } = useForm(parameterForm, rulesRef);

onBeforeMount(() => {
  getList(getProductParameterList, form);
});

const resetForm = () => {
  form.name = '';
  form.parameterCode = '';
  searchList(getList);
};

const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑品牌';
    visible.value = true;
    parameterForm.name = row.name;
    parameterForm.parameterId = row.parameterId;
    parameterForm.remark = row.remark;
    parameterForm.parameterCode = row.parameterCode;
  }
};

const closeModal = () => {
  visible.value = false;
  resetFields();
  getList();
};

const initForm = () => {
  resetFields();
  closeModal();
};

const submitParameterForm = e => {
  e.preventDefault();
  validate().then(() => {
    commonFunc(
      title.value !== '添加参数' ? updateProductParameter : createProductParameter,
      parameterForm,
      closeModal,
    );
  });
};
</script>
