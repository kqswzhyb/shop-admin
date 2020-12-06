<template>
  <a-row>
    <a-col :span="6">
      <a-tree
        :replaceFields="{
          title: 'name',
          key: 'menuId',
          children: 'children',
        }"
        :tree-data="treeData"
        @select="onSelect"
      >
        <template #title="{name,menuId,type}"
          ><div class="flex-between">
            <span>{{ name }}</span>
            <div>
              <a-button type="link" v-if="type === '2'" @click.stop="changeMenu('add', menuId)">
                添加
              </a-button>
              <a-button
                type="link"
                v-if="menuId !== '111'"
                @click.stop="changeMenu('edit', menuId)"
              >
                编辑
              </a-button>
              <a-popconfirm
                :title="`是否删除该权限 ${name}  ？`"
                ok-text="是"
                cancel-text="否"
                @confirm="commonFunc(deleteMenu, { menuId }, getList)"
              >
                <a-button type="link" v-if="menuId !== '111'">
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </div></template
        >
      </a-tree>
    </a-col>

    <a-col :offset="4" :span="14">
      <a-form ref="menu" :model="menuForm" layout="inline" :label-col="{ span: 6 }">
        <a-form-item
          label="权限名称"
          name="name"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.name"
        >
          <a-input v-model:value.trim="menuForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item
          label="权限编码"
          name="permission"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.permission"
        >
          <a-input v-model:value.trim="menuForm.permission" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="URL" name="path" :label-col="{ span: 12 }" v-bind="validateInfos.path">
          <a-input v-model:value.trim="menuForm.path" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item
          label="父级Id"
          name="parentId"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.parentId"
        >
          <a-input
            v-model:value.trim="menuForm.parentId"
            disabled
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="图标名"
          name="icon"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.icon"
        >
          <a-input v-model:value.trim="menuForm.icon" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item
          label="文件路径"
          name="component"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.component"
        >
          <a-input v-model:value.trim="menuForm.component" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="排序" name="sort" :label-col="{ span: 12 }" v-bind="validateInfos.sort">
          <a-input
            type="number"
            v-model:value.trim="menuForm.sort"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="缓存"
          name="keepAlive"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.keepAlive"
        >
          <a-select
            v-model:value="menuForm.keepAlive"
            style="width: 180px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value="0">
              不缓存
            </a-select-option>
            <a-select-option value="1">
              缓存
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" name="type" :label-col="{ span: 12 }" v-bind="validateInfos.type">
          <a-select
            v-model:value="menuForm.type"
            style="width: 180px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value="0">
              菜单
            </a-select-option>
            <a-select-option value="1">
              按钮
            </a-select-option>
            <a-select-option value="2">
              节点
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="备注"
          name="remark"
          :label-col="{ span: 12 }"
          v-bind="validateInfos.remark"
        >
          <a-textarea v-model:value.trim="menuForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
      <div>
        <a-button class="mr10" type="primary" @click="submitMenuForm"> 提交 </a-button>
        <a-button @click="resetFields"> 清空 </a-button>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { getMenuAllList, updateMenu, getMenuList, deleteMenu, createMenu } from '@/api/menu';
import { commonFunc } from '@/utils/util';
import { useForm } from '@ant-design-vue/use';

const treeData = ref([]);
const menuForm = reactive({
  name: '',
  menuId: '',
  permission: '',
  path: '',
  parentId: '',
  icon: '',
  component: '',
  sort: '',
  keepAlive: '',
  type: '',
  remark: '',
});

const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入权限名称',
    },
  ],
  permission: [
    {
      required: true,
      message: '请输入权限编码',
    },
  ],
  type: [
    {
      required: true,
      message: '请输入权限编码',
    },
  ],
  parentId: [
    {
      required: true,
      message: '请输入',
    },
  ],
});

const getList = () => {
  getMenuAllList().then(res => {
    treeData.value = res.data.data;
  });
};

onBeforeMount(() => {
  getList();
});

const { resetFields, validate, validateInfos } = useForm(menuForm, rulesRef);
const onSelect = (selectedKeys, info) => {
  const keys = Object.keys(menuForm);
  if (info.selectedNodes.length !== 0) {
    const form = info.selectedNodes[0].props;
    keys.forEach(v => {
      menuForm[v] = form[v];
    });
  }
};
const changeMenu = (mode, menuId) => {
  if (mode === 'add') {
    resetFields();
    menuForm.parentId = menuId;
  }
};
const submitMenuForm = e => {
  e.preventDefault();
  validate().then(() => {
    commonFunc(menuForm.menuId ? updateMenu : createMenu, menuForm, getList);
  });
};
</script>
