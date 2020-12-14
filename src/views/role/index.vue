<template>
  <div>
    <div class="flex-between mb20">
      <a-form layout="inline" :model="form" @submit="searchList(getList)" @submit.prevent>
        <a-form-item name="roleName">
          <a-input v-model:value.trim="form.roleName" allowClear placeholder="角色名" />
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
            title = '添加角色';
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
      rowKey="roleId"
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
              <a-menu-item key="menu">
                <span>权限</span>
              </a-menu-item>
              <a-menu-item key="edit">
                <span>编辑</span>
              </a-menu-item>
              <a-menu-item key="删除">
                <a-popconfirm
                  :title="`是否删除角色 ${record?.roleName}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="commonFunc(deleteRole, { roleId: record?.roleId }, closeModal)"
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
      @ok="e => submitRoleForm(e)"
      @cancel="initForm"
    >
      <a-form :model="roleForm" :label-col="{ span: 4 }">
        <a-form-item label="角色" name="roleName" v-bind="validateInfos.roleName">
          <a-input v-model:value.trim="roleForm.roleName" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="roleForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="menuVisible" title="编辑角色权限列表" @ok="e => submitMenus(e)">
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        :replaceFields="{
          title: 'name',
          key: 'menuId',
          children: 'children',
        }"
        :tree-data="menus"
      >
      </a-tree>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { role as columns } from '@/table/role/role';
import {
  getRoleList,
  updateRole,
  deleteRole,
  createRole,
  batchSaveRoleMenu,
  getRoleAllMenu,
} from '@/api/role';
import { getMenuAllList } from '@/api/menu';
import { commonFunc, downLoadFile } from '@/utils/util';
import { DownCircleOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { page, searchList, getList, pagination, data, loading } from '@/mixins/baseForm';

const form = reactive({
  roleName: '',
});
const roleForm = reactive({
  roleName: '',
  roleId: '',
  remark: '',
});
const rulesRef = reactive({
  roleName: [
    {
      required: true,
      message: '请输入角色名',
    },
  ],
});
ref: menus = [];

ref: checkedKeys = [];

ref: current = '';

ref: visible = false;

ref: menuVisible = false;

ref: title = '';

const { resetFields, validate, validateInfos } = useForm(roleForm, rulesRef);

onBeforeMount(() => {
  getList(getRoleList, form);
  getMenuAllList().then(res => {
    menus = res.data.data[0].children;
  });
});

const resetForm = () => {
  form.roleName = '';
  searchList(getList);
};

const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title = '编辑角色';
    visible = true;
    roleForm.roleName = row.roleName;
    roleForm.roleId = row.roleId;
    roleForm.remark = row.remark;
  }
  if (key === 'menu') {
    getRoleAllMenu({ roleId: row.roleId }).then(res => {
      checkedKeys = res.data.data.filter(v => v.menuId !== '111');
    });
    current = row.roleId;
    menuVisible = true;
  }
};

const closeModal = () => {
  visible = false;
  resetFields();
  getList();
};

const initForm = () => {
  resetFields();
  closeModal();
};

const submitRoleForm = e => {
  e.preventDefault();
  validate().then(() => {
    commonFunc(title !== '添加角色' ? updateRole : createRole, roleForm, closeModal);
  });
};
const submitMenus = e => {
  e.preventDefault();
  commonFunc(
    batchSaveRoleMenu,
    { menus: checkedKeys.join(','), roleId: current },
    () => {
      menuVisible = false;
      getList();
    },
  );
};
</script>
