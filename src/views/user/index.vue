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
        <a-form-item name="nickName">
          <a-input v-model:value.trim="form.nickName" allowClear placeholder="昵称" />
        </a-form-item>
        <a-form-item name="phone">
          <a-input v-model:value.trim="form.phone" allowClear placeholder="手机号码" />
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
            title = '添加用户';
          "
        >
          添加
        </a-button>
        <a-button class="ml10" @click="userExport"> 导出 </a-button>
      </div>
    </div>

    <a-table
      class="mt20"
      :columns="columns"
      :data-source="data"
      bordered
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.userId"
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
                  :title="`是否删除用户 ${record.nickName}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="commonFunc(deleteUser, { userId: record.userId }, closeModal)"
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
      @ok="e => submitUserForm(e)"
      @cancel="initForm"
    >
      <a-form ref="user" :model="userForm" :label-col="{ span: 4 }">
        <a-form-item label="昵称" name="nickName" v-bind="validateInfos.nickName">
          <a-input v-model:value.trim="userForm.nickName" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="手机号码" name="phone" v-bind="validateInfos.phone">
          <a-input v-model:value.trim="userForm.phone" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="角色" name="roleId" v-bind="validateInfos.roleId">
          <a-select
            v-model:value="userForm.roleId"
            show-search
            :filter-option="filterOption"
            style="width: 180px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
              {{ item.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="userForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
    {{ dst }}
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref, toRefs } from 'vue';
export { user as columns } from '@/table/user/user';
export { getUserList, updateUser, deleteUser, createUser, printUser } from '@/api/user';
import { getRoleList } from '@/api/role';
export { commonFunc, downLoadFile } from '@/utils/util';
export { DownCircleOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
export {
  page,
  filterOption,
  searchList,
  getList,
  pagination,
  data,
  loading,
} from '@/mixins/baseForm';

export const form = reactive({
  nickName: '',
  phone: '',
});
export const userForm = reactive({
  nickName: '',
  phone: '',
  roleId: '',
  userId: '',
  remark: '',
});
export const rulesRef = reactive({
  nickName: [
    {
      required: true,
      message: '请输入昵称',
    },
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号码',
    },
  ],
  roleId: [
    {
      required: true,
      message: '请选择角色',
    },
  ],
});

export const roles = ref([]);

export const visible = ref(false);

export const title = ref('');

export const { resetFields, validate, validateInfos } = useForm(userForm, rulesRef);

onBeforeMount(() => {
  getList(getUserList, form);
  getRoleList({ size: 9999 }).then(res => {
    roles.value = res.data.data.records;
  });
});

export const resetForm = () => {
  form.nickName = '';
  form.phone = '';
  searchList(getList);
};

export const initForm = () => {
  resetFields();
  closeModal();
};

export const userExport = () => {
  printUser().then(res => {
    downLoadFile(res.data, '用户列表.xlsx');
  });
};

export const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑用户';
    visible.value = true;
    userForm.nickName = row.nickName;
    userForm.phone = row.phone;
    userForm.roleId = row.roleId;
    userForm.userId = row.userId;
    userForm.remark = row.remark;
  }
};

export const submitUserForm = e => {
  e.preventDefault();
  validate().then(() => {
    let data2;
    let fun;
    if (title.value !== '添加用户') {
      data2 = userForm;
      fun = updateUser;
    } else {
      data2 = Object.assign({}, userForm, { userName: userForm.phone, password: '123456' });
      delete data2.userId;
      fun = createUser;
    }
    commonFunc(fun, data2, closeModal);
  });
};

export const closeModal = () => {
  visible.value = false;
  getList();
};
</script>
