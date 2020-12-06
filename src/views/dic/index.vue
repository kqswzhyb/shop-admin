<template>
  <div>
    <a-row>
      <a-col :span="6">
        <a-button type="primary" class="mb10" @click="changeType('add')">
          添加
        </a-button>
        <div class="box-view">
          <a-tree :tree-data="typeList" style="width:100%;" @select="onSelect">
            <template #title="{title,key}"
              ><div class="flex-between">
                <span>{{ title }}</span>
                <div>
                  <a-button type="link" @click="changeType('edit', key)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    :title="`是否删除该类型 ${title}  ？`"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="commonFunc(deleteDicType, { typeID: key }, closeModal)"
                  >
                    <a-button type="link">
                      删除
                    </a-button>
                  </a-popconfirm>
                </div>
              </div></template
            >
          </a-tree>
        </div>
      </a-col>
      <a-col :offset="2" :span="6">
        <a-button type="primary" v-show="selectKey" class="mb10" @click="changeDic('add')">
          添加
        </a-button>
        <div class="h42" v-show="!selectKey" style="width:100%;"></div>
        <div class="box-view">
          <a-tree :tree-data="dicList" style="width:100%;">
            <template #title="{title,key}"
              ><div class="flex-between">
                <span>{{ title }}</span>
                <div>
                  <a-button type="link" @click="changeDic('edit', key)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    :title="`是否删除该字典 ${titleDic}  ？`"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="commonFunc(deleteDic, { dicId: key }, closeModalDic)"
                  >
                    <a-button type="link">
                      删除
                    </a-button>
                  </a-popconfirm>
                </div>
              </div></template
            >
          </a-tree>
        </div>
      </a-col>
    </a-row>
    <a-modal
      v-model:visible="visible"
      :title="title"
      @ok="e => submitTypeForm(e)"
      @cancel="initTypeForm"
    >
      <a-form ref="type" :model="typeForm" :label-col="{ span: 4 }">
        <a-form-item label="类型名称" name="name" v-bind="validateInfos.name">
          <a-input v-model:value.trim="typeForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="类型编码" name="code" v-bind="validateInfos.code">
          <a-input v-model:value.trim="typeForm.code" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="typeForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="visibleDic"
      :title="titleDic"
      @ok="e => submitDicForm(e)"
      @cancel="initDicForm"
    >
      <a-form ref="dic" :model="dicForm" :label-col="{ span: 4 }">
        <a-form-item label="字典名称" name="name" v-bind="validateInfos2.name">
          <a-input v-model:value.trim="dicForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="字典值" name="value" v-bind="validateInfos2.value">
          <a-input v-model:value.trim="dicForm.value" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="dicForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, reactive } from 'vue';
import {
  getDicTypeList,
  updateDicType,
  createDicType,
  deleteDicType,
  getDicList,
  updateDic,
  deleteDic,
  createDic,
} from '@/api/dic';
import { commonFunc } from '@/utils/util';
import { useForm } from '@ant-design-vue/use';

const typeList = ref([]);
const dicList = ref([]);

const typeForm = reactive({
  name: '',
  code: '',
  typeId: '',
  remark: '',
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入类型名称',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入类型编码',
    },
  ],
});

const dicForm = reactive({
  name: '',
  value: '',
  typeId: '',
  dicId: '',
  remark: '',
});
const rulesRef2 = reactive({
  name: [
    {
      required: true,
      message: '请输入字典名称',
    },
  ],
  value: [
    {
      required: true,
      message: '请输入字典值',
    },
  ],
});

const visible = ref(false);
const visibleDic = ref(false);
const titleDic = ref('');
const title = ref('');
const selectKey = ref('');

const { resetFields, validate, validateInfos } = useForm(typeForm, rulesRef);
const { resetFields: resetFields2, validate: validate2, validateInfos: validateInfos2 } = useForm(
  dicForm,
  rulesRef2,
);

const getTypeList = () => {
  getDicTypeList({ size: 9999 }).then(res => {
    typeList.value = res.data.data.records;
    typeList.value.forEach(v => {
      v.title = v.name;
      v.key = v.typeId;
    });
  });
};
const getList = () => {
  getDicList({ size: 9999, typeId: selectKey.value }).then(res => {
    dicList.value = res.data.data.records;
    dicList.value.forEach(v => {
      v.title = v.name;
      v.key = v.dicId;
    });
  });
};

onBeforeMount(() => {
  getTypeList();
});
const changeType = (mode, key) => {
  title.value = mode === 'add' ? '添加类型' : '编辑类型';
  if (mode === 'edit') {
    const data = typeList.value.find(v => v.key === key);
    typeForm.name = data.name;
    typeForm.code = data.code;
    typeForm.typeId = data.key;
    typeForm.remark = data.remark;
  }

  visible.value = true;
};
const closeModal = () => {
  visible.value = false;
  resetFields();
  getTypeList();
  selectKey.value = '';
};
const submitTypeForm = e => {
  e.preventDefault();
  validate().then(() => {
    let fun;
    if (title.value !== '添加类型') {
      fun = updateDicType;
    } else {
      fun = createDicType;
    }
    commonFunc(fun, typeForm, closeModal);
  });
};

const initTypeForm = () => {
  resetFields();
  closeModal();
};

const changeDic = (mode, key) => {
  titleDic.value = mode === 'add' ? '添加字典' : '编辑字典';
  if (mode === 'edit') {
    const data = dicList.value.find(v => v.key === key);
    dicForm.name = data.name;
    dicForm.value = data.value;
    dicForm.dicId = data.key;
    dicForm.typeId = data.typeId;
    dicForm.remark = data.remark;
  } else {
    dicForm.typeId = selectKey.value;
  }

  visibleDic.value = true;
};
const closeModalDic = () => {
  visibleDic.value = false;
  resetFields2();
  getList();
};
const submitDicForm = e => {
  e.preventDefault();
  validate2().then(() => {
    let fun;
    if (titleDic.value !== '添加字典') {
      fun = updateDic;
    } else {
      fun = createDic;
    }
    commonFunc(fun, dicForm, closeModalDic);
  });
};

const initDicForm = () => {
  resetFields2();
  closeModalDic();
};

const onSelect = (selectedKeys, info) => {
  if (info.selectedNodes.length !== 0) {
    selectKey.value = info.selectedNodes[0].key;
    getList();
  } else {
    dicList.value = [];
    selectKey.value = '';
  }
};
</script>

<style lang="less" scoped>
.box-view {
  border: 1px solid #ccc;
  text-align: center;
  overflow: auto;
  height: calc(100vh - 210px);
}
.ant-tree:deep(li .ant-tree-node-content-wrapper) {
  width: calc(100% - 48px);
}
.ant-tree:deep(li span.ant-tree-switcher.ant-tree-switcher-noop) {
  display: none;
}
</style>
