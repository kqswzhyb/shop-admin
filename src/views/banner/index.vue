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
          <a-input v-model:value.trim="form.name" allowClear placeholder="名称" />
        </a-form-item>
        <a-form-item name="place">
          <a-input v-model:value.trim="form.place" allowClear placeholder="位置" />
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
            title = '添加轮播图';
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
      rowKey="bannerId"
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
                  :title="`是否删除轮播图 ${record?.name}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="commonFunc(deleteBanner, { bannerId: record?.bannerId }, closeModal)"
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
      @ok="e => submitBannerForm(e)"
      @cancel="initForm"
    >
      <a-form ref="banner" :model="bannerForm" :label-col="{ span: 4 }">
        <a-form-item label="名称" name="name" v-bind="validateInfos.name">
          <a-input v-model:value.trim="bannerForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="链接" name="link" v-bind="validateInfos.link">
          <a-input v-model:value.trim="bannerForm.link" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="位置" name="place" v-bind="validateInfos.place">
          <a-input v-model:value.trim="bannerForm.place" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="排序" name="sort" v-bind="validateInfos.sort">
          <a-input v-model:value.trim="bannerForm.sort" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="图片" name="fileRecordList" v-bind="validateInfos.fileRecordList">
          <a-upload
            action="http://localhost:8099/v1/file/simpleUpload?dic=img"
            list-type="picture-card"
            :headers="headers"
            :file-list="bannerForm.fileRecordList"
            @change="handleChange"
          >
            <div v-if="bannerForm.fileRecordList.length < 8">
              <plus-outlined />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="bannerForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { banner as columns } from '@/table/banner/banner';
import { getBannerList, updateBanner, deleteBanner, createBanner } from '@/api/banner';
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
  place: '',
});
const bannerForm = reactive({
  name: '',
  place: '',
  link: '',
  bannerId: '',
  sort: '',
  fileRecordList: [],
  remark: '',
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入轮播图名',
    },
  ],
  place: [
    {
      required: true,
      message: '请输入轮播图位置',
    },
  ],
  link: [
    {
      required: true,
      message: '请输入轮播图链接',
    },
  ],
  sort: [
    {
      required: true,
      message: '请输入轮播图排序',
    },
  ],
  fileRecordList: [
    {
      required: true,
      message: '请上传轮播图图片',
    },
  ],
});

const banners = ref([]);

const visible = ref(false);

const title = ref('');

const { resetFields, validate, validateInfos } = useForm(bannerForm, rulesRef);

onBeforeMount(() => {
  getList(getBannerList, form);
});

const resetForm = () => {
  form.name = '';
  form.place = '';
  searchList(getList);
};

const initForm = () => {
  resetFields();
  closeModal();
};

const handleChange = ({ fileList }) => {
  bannerForm.fileRecordList = fileList;
};
const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑轮播图';
    visible.value = true;
    bannerForm.name = row.name;
    bannerForm.bannerId = row.bannerId;
    bannerForm.fileRecordList = row.fileRecordList;
    bannerForm.remark = row.remark;
    bannerForm.place = row.place;
    bannerForm.link = row.link;
    bannerForm.sort = row.sort;
    bannerForm.fileRecordList.forEach(v => {
      v.url = v.fileFullPath;
      v.status = 'done';
      v.name = v.fileName;
    });
  }
};

const submitBannerForm = e => {
  e.preventDefault();
  validate().then(() => {
    if (title.value === '添加轮播图') {
      bannerForm.fileRecordList = bannerForm.fileRecordList.map(v => ({
        ...v.response.data,
        url: v.response.data.fileFullPath,
        status: 'done',
        name: v.response.data.fileName,
      }));
    }
    commonFunc(title.value !== '添加轮播图' ? updateBanner : createBanner, bannerForm, closeModal);
  });
};

const closeModal = () => {
  visible.value = false;
  resetFields();
  getList();
};
</script>
