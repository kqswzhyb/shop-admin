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
        <a-form-item name="name">
          <a-input v-model:value.trim="form.name" allowClear placeholder="品牌名" />
        </a-form-item>
        <a-form-item name="brandCode">
          <a-input v-model:value.trim="form.brandCode" allowClear placeholder="品牌编码" />
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
            title = '添加品牌';
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
      rowKey="brandId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
      </template>
      <template #pic="{ record }">
        <img
          v-if="record?.fileRecordList?.length !== 0"
          :src="record?.fileRecordList?.[0]?.fileFullPath"
          height="40"
          alt=""
        />
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
                  :title="`是否删除品牌 ${record?.name}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="commonFunc(deleteBrand, { brandId: record?.brandId }, closeModal)"
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
      @ok="e => submitBrandForm(e)"
      @cancel="initForm"
    >
      <a-form ref="brand" :model="brandForm" :label-col="{ span: 4 }">
        <a-form-item label="品牌名" name="name" v-bind="validateInfos.name">
          <a-input v-model:value.trim="brandForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="品牌编码" name="brandCode" v-bind="validateInfos.brandCode">
          <a-input v-model:value.trim="brandForm.brandCode" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="品牌图片" name="fileRecordList" v-bind="validateInfos.fileRecordList">
          <a-upload
            action="http://localhost:8099/v1/file/simpleUpload?dic=img"
            list-type="picture-card"
            :headers="headers"
            :file-list="brandForm.fileRecordList"
            @change="handleChange"
          >
            <div v-if="brandForm.fileRecordList.length < 8">
              <plus-outlined />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="brandForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { brand as columns } from '@/table/brand/brand';
import { getBrandList, updateBrand, deleteBrand, createBrand } from '@/api/brand';
import { commonFunc, downLoadFile } from '@/utils/util';
import { DownCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { page, searchList, getList, pagination, data, loading } from '@/mixins/baseForm';

const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`,
};

const form = reactive({
  name: '',
  brandCode: '',
});
const brandForm = reactive({
  name: '',
  brandId: '',
  brandCode: '',
  fileRecordList: [],
  remark: '',
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入品牌名',
    },
  ],
  brandCode: [
    {
      required: true,
      message: '请输入品牌编码',
    },
  ],
  fileRecordList: [
    {
      required: true,
      message: '请上传品牌图片',
    },
  ],
});

const brands = ref([]);

const visible = ref(false);

const title = ref('');

const { resetFields, validate, validateInfos } = useForm(brandForm, rulesRef);

onBeforeMount(() => {
  getList(getBrandList, form);
});

const resetForm = () => {
  form.name = '';
  form.brandCode = '';
  searchList(getList);
};

const handleChange = ({ fileList }) => {
  brandForm.fileRecordList = fileList;
};
const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑品牌';
    visible.value = true;
    brandForm.name = row.name;
    brandForm.brandId = row.brandId;
    brandForm.fileRecordList = row.fileRecordList;
    brandForm.remark = row.remark;
    brandForm.brandCode = row.brandCode;
    brandForm.fileRecordList.forEach(v => {
      v.url = v.fileFullPath;
      v.status = 'done';
      v.name = v.fileName;
    });
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

const submitBrandForm = e => {
  e.preventDefault();
  validate().then(() => {
    if (title.value === '添加品牌') {
      brandForm.fileRecordList = brandForm.fileRecordList.map(v => ({
        ...v.response.data,
        url: v.response.data.fileFullPath,
        status: 'done',
        name: v.response.data.fileName,
      }));
    }
    commonFunc(title.value !== '添加品牌' ? updateBrand : createBrand, brandForm, closeModal);
  });
};
</script>
