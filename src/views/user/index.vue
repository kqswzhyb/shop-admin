<template>
  <div>
    <a-form layout="inline" ref="search" :model="form" @submit="searchList" @submit.native.prevent>
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

    <a-table
      class="mt20"
      :columns="columns"
      :data-source="data"
      bordered
      :loading="loading"
      :pagination="pagination"
      :rowKey="(record) => record.userId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
      </template>
      <template #operation="{ record }">
        <a-dropdown>
          <a class="dropdown-menu" @click="(e) => e.preventDefault()"> 操作 </a>
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
      title="编辑用户"
      @ok="() => commonFunc(updateUser, userForm, closeModal)"
      @cancel="initForm"
    >
      <a-form ref="user" :model="userForm" :label-col="{ span: 4 }">
        <a-form-item label="昵称" name="nickName">
          <a-input v-model:value.trim="userForm.nickName" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="手机号码" name="phone">
          <a-input v-model:value.trim="userForm.phone" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="角色" name="roleId">
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
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref, toRefs } from 'vue';
import { Page } from '/@/api/interface';
export { user as columns } from '/@/table/user/user';
export { getUserList, updateUser, deleteUser } from '/@/api/user';
import { getRoleList } from '/@/api/role';
export { commonFunc } from '/@/utils/util';

export let form = reactive({
  nickName: '',
  phone: '',
});
export let userForm = reactive({
  nickName: '',
  phone: '',
  roleId: '',
  userId: '',
});
export let page: Page = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});
export let pagination = reactive({
  defaultPageSize: 10,
  showTotal: (total) => `共 ${total} 条数据`,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '15', '20'],
  onShowSizeChange: (current, pageSize) => {
    page.current = 1;
    page.pageSize = pageSize;
    getList();
  },
  onChange: (current, pageSize) => {
    page.current = current;
    page.pageSize = pageSize;
    getList();
  },
  ...toRefs(page),
});

export let data = ref([]);

export let roles = ref([]);

export let visible = ref(false);

export let loading = ref(false);

onBeforeMount(() => {
  getList();
  getRoleList({ size: 9999 }).then((res) => {
    roles.value = res.data.data.records;
  });
});

export const searchList = () => {
  page.current = 1;
  getList();
};

export const resetForm = () => {
  form.nickName = '';
  form.phone = '';
  searchList();
};

export const initForm = () => {
  userForm.nickName = '';
  userForm.phone = '';
  userForm.roleId = '';
  closeModal();
};

export const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    visible.value = true;
    userForm.nickName = row.nickName;
    userForm.phone = row.phone;
    userForm.roleId = row.roleId;
    userForm.userId = row.userId;
  }
};

export const closeModal = () => {
  visible.value = false;
  getList();
};

export const filterOption = (input, option) =>
  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

export const getList = () => {
  loading.value = true;
  getUserList(Object.assign({}, page, form))
    .then((res) => {
      const result = res.data.data;
      data.value = result.records;
      page.total = result.total;
      page.pageSize = result.pageSize;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
