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
          <a-input v-model:value.trim="form.name" allowClear placeholder="产品名" />
        </a-form-item>
        <a-form-item name="productCode">
          <a-input v-model:value.trim="form.productCode" allowClear placeholder="产品编码" />
        </a-form-item>
        <a-form-item name="saleStatus" v-if="dicList">
          <a-select
            v-model:value="form.saleStatus"
            style="width: 180px"
            placeholder="上架状态"
            allowClear
          >
            <a-select-option
              v-for="item in dicList['product_sale_status']"
              :key="item.value"
              :label="item.name"
              :value="item.value"
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

      <div>
        <a-button type="primary" @click="addproduct">
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
      rowKey="productId"
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
      <template #brand="{ record }">
        <span>{{ record?.brand?.name }}</span>
      </template>
      <template #saleStatus="{ record }">
        <span>{{ dicData(dicList['product_sale_status'], record.saleStatus) }}</span>
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
                  :title="`是否删除产品 ${record?.name}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="commonFunc(deleteProduct, { productId: record?.productId }, closeModal)"
                >
                  <span>删除</span>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item key="上架状态">
                <a-popconfirm
                  :title="
                    `是否${record.saleStatus === '0' ? '上架' : '下架'}产品 ${record?.name}  ？`
                  "
                  ok-text="是"
                  cancel-text="否"
                  @confirm="
                    commonFunc(
                      updateProductSaleStatus,
                      {
                        productId: record?.productId,
                        saleStatus: record.saleStatus === '0' ? '1' : '0',
                      },
                      closeModal,
                    )
                  "
                >
                  <span>{{ record.saleStatus === '0' ? '上架' : '下架' }}</span>
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
      @ok="e => submitProductForm(e)"
      :width="700"
      @cancel="initForm"
    >
      <a-form :model="productForm" :label-col="{ span: 4 }">
        <a-form-item label="产品名" name="name" v-bind="validateInfos.name">
          <a-input v-model:value.trim="productForm.name" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="产品编码" name="productCode" v-bind="validateInfos.productCode">
          <a-input v-model:value.trim="productForm.productCode" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="品牌" name="brandId">
          <a-select
            v-model:value="productForm.brandId"
            show-search
            :filter-option="filterOption"
            style="width: 180px"
            placeholder="请选择"
            allowClear
          >
            <a-select-option
              v-for="item in brands"
              :key="item.brandId"
              :label="item.name"
              :value="item.brandId"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产品单位" name="productUnit" v-bind="validateInfos.productUnit">
          <a-input v-model:value.trim="productForm.productUnit" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item
          label="产品参数"
          name="productParameterVoList"
          v-bind="validateInfos.productParameterVoList"
        >
          <a-select
            mode="multiple"
            v-model:value="productForm.productParameterVoList"
            style="width: 180px"
            placeholder="请选择"
            @change="handleParameterChange"
          >
            <a-select-option
              v-for="item in parameters"
              :key="item.parameterId"
              :label="item.name"
              :value="item.parameterId"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-form :label-col="{ span: 4 }" v-if="productForm.productParameterVoList.length !== 0">
            <a-form-item
              :label="parameters.find(k => k.parameterId === v)?.name"
              name="content"
              v-for="v in productForm.productParameterVoList"
              :key="v"
            >
              <a-input v-model:value.trim="productParam[v]" placeholder="请输入" allowClear />
            </a-form-item>
          </a-form>
        </a-form-item>
        <a-form-item label="产品图片" name="fileRecordList" v-bind="validateInfos.fileRecordList">
          <a-upload
            action="http://localhost:8099/v1/file/simpleUpload?dic=img"
            list-type="picture-card"
            :headers="headers"
            :file-list="productForm.fileRecordList"
            @change="handleChange"
          >
            <div v-if="productForm.fileRecordList.length < 8">
              <plus-outlined />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="备注" name="remark" v-bind="validateInfos.remark">
          <a-textarea v-model:value.trim="productForm.remark" placeholder="请输入" allowClear />
        </a-form-item>
        <a-form-item label="产品属性组" name="attrBaseList" v-bind="validateInfos.attrBaseList">
          <a-tabs
            v-model:activeKey="activeKey2"
            type="editable-card"
            @edit="onEdit2"
            @change="changeTab2"
          >
            <a-tab-pane
              v-for="pane in productForm.attrBaseList"
              :key="pane.attrId"
              :tab="pane.attrName"
              :closable="true"
            >
              <a-button type="primary" class="mb20" @click="editTitle2(pane)">修改属性组</a-button>
              <a-button class="mb20 ml10" @click="addAttr(pane)">创建属性</a-button>
              <div>
                <a-tag
                  closable
                  v-for="item in pane.attrSonList"
                  :key="item.attrSonId"
                  @click.native="attrSonUpdate(pane, item)"
                  @close="attrSonDelete(pane, item)"
                >
                  {{ item.name }}
                </a-tag>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-item>
        <a-form-item label="产品组" name="productgList" v-bind="validateInfos.productgList">
          <a-tabs v-model:activeKey="activeKey3" type="editable-card" @edit="onEdit3">
            <a-tab-pane
              v-for="pane in productForm.productgList"
              :key="pane.productgId"
              :tab="pane.price"
              :closable="true"
            >
              <a-button type="primary" class="mb20" @click="editTitle3(pane)">修改价格</a-button>
              <div>
                <a-select
                  v-model:value="v.attrSonValue"
                  style="width: 180px"
                  v-for="v in pane.attrList"
                  :key="v.attrId"
                  class="mr10"
                >
                  <a-select-option
                    v-for="k in productForm.attrBaseList.find(item => item.attrId === v.attrId)
                      .attrSonList"
                    :key="k.value"
                  >
                    {{ k.name }}
                  </a-select-option>
                </a-select>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-item>
        <a-form-item label="产品描述" name="productDesList" v-bind="validateInfos.productDesList">
          <a-tabs
            v-model:activeKey="activeKey"
            type="editable-card"
            @edit="onEdit"
            @change="changeTab"
          >
            <a-tab-pane
              v-for="pane in productForm.productDesList"
              :key="pane.desId"
              :tab="pane.desName"
              :closable="true"
            >
              <a-button type="primary" class="mb20" @click="editTitle(pane)">修改标题</a-button>
            </a-tab-pane>
          </a-tabs>
          <div ref="editor" v-show="productForm.productDesList.length !== 0"></div>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="visibleTile" title="介绍标题" @ok="changeTitle">
      <a-input v-model:value.trim="tabTitle.desName" placeholder="请输入" allowClear />
    </a-modal>
    <a-modal v-model:visible="visibleTile2" title="属性组" @ok="changeTitle2">
      <a-input
        v-model:value.trim="tabTitle2.attrName"
        class="mb10"
        placeholder="请输入属性组名"
        allowClear
      />
      <a-input v-model:value.trim="tabTitle2.attrValue" placeholder="请输入属性组编码" allowClear />
    </a-modal>
    <a-modal v-model:visible="visibleTile3" title="属性" @ok="changeTitle3">
      <a-input
        v-model:value.trim="tabTitle3.name"
        class="mb10"
        placeholder="请输入属性名"
        allowClear
      />
      <a-input v-model:value.trim="tabTitle3.value" placeholder="请输入属性编码" allowClear />
    </a-modal>
    <a-modal v-model:visible="visibleTile4" title="属性" @ok="changeTitle4">
      <a-input
        v-model:value.trim="tabTitle4.price"
        type="number"
        placeholder="请输入价格"
        allowClear
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  onBeforeMount,
  watch,
  ref,
  onBeforeUnmount,
  nextTick,
  getCurrentInstance,
  watchEffect,
} from 'vue';
import { product as columns } from '@/table/product/product';
import {
  getProductList,
  updateProduct,
  deleteProduct,
  createProduct,
  getProductParameterList,
  updateProductSaleStatus,
} from '@/api/product';
import { getBrandList } from '@/api/brand';
import { commonFunc, dicData } from '@/utils/util';
import { DownCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useForm } from '@ant-design-vue/use';
import { useStore } from 'vuex';
import WangEditor from 'wangeditor';
import {
  page,
  searchList,
  getList,
  pagination,
  data,
  loading,
  filterOption,
} from '@/mixins/baseForm';

const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`,
};
const {
  ctx: { $message },
} = getCurrentInstance();

const dicList = ref({});
const store = useStore();
watchEffect(() => {
  dicList.value = store.getters['common/dic'];
});

const form = reactive({
  name: '',
  saleStatus: '',
  productCode: '',
});
const productParam = reactive({});
const productForm = reactive({
  name: '',
  productId: '',
  brandId: '',
  productUnit: '',
  productCode: '',
  fileRecordList: [],
  productParameterVoList: [],
  attrBaseList: [],
  productDesList: [],
  productgList: [],
  remark: '',
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: '请输入品牌名',
    },
  ],
  productCode: [
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
  productUnit: [
    {
      required: true,
      message: '请输入产品单位',
    },
  ],
  productParameterVoList: [
    {
      required: true,
      message: '请选择产品参数',
    },
  ],
  productgList: [
    {
      required: true,
      message: '请选择产品组',
    },
  ],
});

const products = ref([]);
const brands = ref([]);
const parameters = ref([]);
const activeKey = ref('');
const activeKey2 = ref('');
const activeKey3 = ref('');

const visible = ref(false);

const title = ref('');
const tabTitle = reactive({
  desId: '',
  desName: '',
  content: '',
});
const visibleTile = ref(false);
const tabTitle2 = reactive({
  attrId: '',
  attrName: '',
  attrValue: '',
  attrSonList: [],
});
const tabTitle3 = reactive({
  attrSonId: '',
  name: '',
  value: '',
});
const tabTitle4 = reactive({
  productgId: '',
  price: 0,
  attrList: [],
});
const visibleTile2 = ref(false);
const visibleTile3 = ref(false);
const visibleTile4 = ref(false);

const { resetFields, validate, validateInfos } = useForm(productForm, rulesRef);

onBeforeMount(() => {
  getList(getProductList, form);
  getBrandList({ size: 9999 }).then(res => {
    brands.value = res.data.data.records;
  });
  getProductParameterList({ size: 9999 }).then(res => {
    parameters.value = res.data.data.records;
  });
});

watch(
  () => productForm.attrBaseList,
  (val, old) => {
    if (old.length !== 0) {
      productForm.productgList = [];
    }
  },
  {
    deep: true,
  },
);

let instance;
const resetForm = () => {
  form.name = '';
  form.saleStatus = '';
  form.productCode = '';
  searchList(getList);
};

const initForm = () => {
  const keys = Object.keys(productParam);
  keys.forEach(v => {
    if (typeof productParam[v] === 'string') {
      productParam[v] = '';
    } else {
      productParam[v] = [];
    }
  });
  if (instance) {
    instance.txt?.html('');
  }
  resetFields();
  visible.value = false;
  getList();
};

const handleChange = ({ fileList }) => {
  productForm.fileRecordList = fileList;
};

const editor = ref();
const handleMenuClick = (key, row) => {
  if (key === 'edit') {
    title.value = '编辑产品';
    visible.value = true;
    productForm.name = row.name;
    productForm.productId = row.productId;
    productForm.fileRecordList = row.fileRecordList;
    productForm.remark = row.remark;
    productForm.productCode = row.productCode;
    productForm.brandId = row.brandId;
    productForm.productUnit = row.productUnit;
    productForm.productDesList = row.productDesList;
    productForm.productParameterVoList = row.productParameterVoList.map(v => v.parameterId);
    productForm.attrBaseList = row.attrBaseList;
    productForm.productgList = row.productgList;
    activeKey.value = productForm.productDesList?.[0]?.desId;
    activeKey2.value = productForm.attrBaseList?.[0]?.attrId;
    activeKey3.value = productForm.productgList?.[0]?.productgId;
    tabTitle2.attrId = productForm.attrBaseList?.[0]?.attrId;
    row.productParameterVoList.forEach(v => {
      productParam[v.parameterId] = v.content;
    });
    productForm.fileRecordList.forEach(v => {
      v.url = v.fileFullPath;
      v.status = 'done';
      v.name = v.fileName;
    });
    if (!instance) {
      nextTick(() => {
        instance = new WangEditor(editor.value);
        Object.assign(instance.config, {
          onchange() {
            const index = productForm.productDesList.findIndex(v => v.desId === activeKey.value);
            if (index != -1) {
              productForm.productDesList[index].content = instance.txt?.html();
            }
          },
        });
        instance.create();
        instance.txt.html(
          productForm.productDesList[0] ? productForm.productDesList[0].content : '',
        );
      });
    } else {
      instance.txt.html(productForm.productDesList[0] ? productForm.productDesList[0].content : '');
    }
  }
};

const addproduct = () => {
  visible.value = true;
  title.value = '添加产品';
  if (!instance) {
    nextTick(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange() {
          const index = productForm.productDesList.findIndex(v => v.desId === activeKey.value);
          if (index != -1) {
            productForm.productDesList[index].content = instance.txt?.html();
          }
        },
      });
      instance.create();
      instance.txt.html(productForm.productDesList[0] ? productForm.productDesList[0].content : '');
    });
  } else {
    instance.txt.html(productForm.productDesList[0] ? productForm.productDesList[0].content : '');
  }
};

const submitProductForm = e => {
  e.preventDefault();
  validate().then(() => {
    productForm.fileRecordList = productForm.fileRecordList.map(v => {
      if (v.response) {
        return {
          ...v.response.data,
          url: v.response.data.fileFullPath,
          status: 'done',
          name: v.response.data.fileName,
        };
      } else {
        return {
          ...v,
          url: v.fileFullPath,
          status: 'done',
          name: v.fileName,
        };
      }
    });
    productForm.productParameterVoList = productForm.productParameterVoList.map(v => ({
      parameterId: v,
      content: productParam[v],
    }));
    commonFunc(title.value !== '添加产品' ? updateProduct : createProduct, productForm, initForm);
  });
};

const closeModal = () => {
  visible.value = false;
  getList();
};
const handleParameterChange = value => {
  if (value.length === 0) {
    const keys = Object.keys(productParam);
    keys.forEach(v => {
      productParam[v] = '';
    });
  } else {
    const keys = Object.keys(productParam);
    if (keys.length > productForm.productParameterVoList.length) {
      keys.forEach(v => {
        const data = productForm.productParameterVoList.find(item => item === v);
        if (!data) {
          delete productParam[v];
        }
      });
    }
    if (keys.length < productForm.productParameterVoList.length) {
      productForm.productParameterVoList.forEach(v => {
        const data = keys.find(item => item === v);
        if (!data) {
          delete productParam[v];
        }
      });
    }
  }
};
const add = () => {
  const day = Date.now() + '';
  productForm.productDesList.push({
    content: '',
    desName: '新描述',
    desId: day,
  });
  activeKey.value = day;
  instance.txt.html('');
};
const remove = targetKey => {
  const index = productForm.productDesList.findIndex(v => v.desId === targetKey);
  if (targetKey === activeKey.value) {
    if (index !== 0) {
      activeKey.value = productForm.productDesList[index - 1].desId;
    }
  }
  productForm.productDesList.splice(index, 1);
};
const add2 = () => {
  const day = Date.now() + '';
  productForm.attrBaseList.push({
    attrId: day,
    attrName: '新属性',
    attrValue: '',
    attrSonList: [],
  });
  activeKey2.value = day;
};
const remove2 = targetKey => {
  const index = productForm.attrBaseList.findIndex(v => v.attrId === targetKey);
  if (targetKey === activeKey2.value) {
    if (index !== 0) {
      activeKey2.value = productForm.attrBaseList[index - 1].attrId;
    }
  }
  productForm.attrBaseList.splice(index, 1);
};

const add3 = () => {
  const day = Date.now() + '';
  productForm.productgList.push({
    productgId: day,
    price: 300,
    attrList:
      productForm.attrBaseList.map(v => ({
        attrId: v.attrId,
        attrSonValue: '',
        attrSonName: '',
      })) || [],
  });
  activeKey3.value = day;
};
const remove3 = targetKey => {
  const index = productForm.productgList.findIndex(v => v.productgId === targetKey);
  if (targetKey === activeKey3.value) {
    if (index !== 0) {
      activeKey3.value = productForm.productgList[index - 1].productgId;
    }
  }
  productForm.productgList.splice(index, 1);
};

const attrSonDelete = (row, son) => {
  const index = productForm.attrBaseList.findIndex(v => v.attrId === row.attrId);
  const index2 = productForm.attrBaseList[index].attrSonList.findIndex(
    v => v.attrSonId === son.attrSonId,
  );
  productForm.attrBaseList[index].attrSonList.splice(index2, 1);
};
const attrSonUpdate = (row, son) => {
  tabTitle3.attrSonId = son.attrSonId;
  tabTitle3.name = son.name;
  tabTitle3.value = son.value;
  visibleTile3.value = true;
};
const onEdit2 = (targetKey, action) => {
  if (action === 'add') {
    add2();
  }
  if (action === 'remove') {
    remove2(targetKey);
  }
};

const onEdit3 = (targetKey, action) => {
  if (action === 'add') {
    add3();
  }
  if (action === 'remove') {
    remove3(targetKey);
  }
};

const changeTab2 = id => {
  const row = productForm.productDesList.find(v => v.desId === id);
  activeKey.value = row.desId;
  if (!instance) {
    nextTick(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange() {
          const index = productForm.productDesList.findIndex(v => v.desId === activeKey.value);
          productForm.productDesList[index].content = instance.txt?.html();
        },
      });
      instance.create();
      instance.txt.html(row.content || '');
    });
  } else {
    instance.txt.html(row.content || '');
  }
};
const onEdit = (targetKey, action) => {
  if (action === 'add') {
    add();
  }
  if (action === 'remove') {
    remove(targetKey);
  }
};

const changeTab = id => {
  const row = productForm.productDesList.find(v => v.desId === id);
  activeKey.value = row.desId;
  if (!instance) {
    nextTick(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange() {
          const index = productForm.productDesList.findIndex(v => v.desId === activeKey.value);
          productForm.productDesList[index].content = instance.txt?.html();
        },
      });
      instance.create();
      instance.txt.html(row.content || '');
    });
  } else {
    instance.txt.html(row.content || '');
  }
};
const editTitle = row => {
  tabTitle.desId = row.desId;
  tabTitle.desName = row.desName;
  tabTitle.content = '';
  visibleTile.value = true;
};
const editTitle2 = row => {
  tabTitle2.attrId = row.attrId;
  tabTitle2.attrName = row.attrName;
  tabTitle2.attrValue = row.attrValue;
  tabTitle2.attrSonList = [];
  visibleTile2.value = true;
};
const editTitle3 = row => {
  tabTitle4.productgId = row.productgId;
  tabTitle4.price = row.price;
  tabTitle4.attrList = row.attrList;
  visibleTile4.value = true;
};
const changeTitle = () => {
  const index = productForm.productDesList.findIndex(v => v.desId === tabTitle.desId);
  productForm.productDesList[index].desName = tabTitle.desName;
  visibleTile.value = false;
};
const changeTitle3 = () => {
  if (!tabTitle3.name) {
    $message.error('属性名称为空');
    return;
  }
  if (!tabTitle3.value) {
    $message.error('属性编码为空');
    return;
  }

  const index = productForm.attrBaseList.findIndex(v => v.attrId === tabTitle2.attrId);
  const index2 = productForm.attrBaseList[index].attrSonList.findIndex(
    v => v.attrSonId === tabTitle3.attrSonId,
  );
  productForm.attrBaseList[index].attrSonList[index2].name = tabTitle3.name;
  productForm.attrBaseList[index].attrSonList[index2].value = tabTitle3.value;
  visibleTile3.value = false;
};
const changeTitle2 = () => {
  if (!tabTitle2.attrName) {
    $message.error('属性名称为空');
    return;
  }
  if (!tabTitle2.attrValue) {
    $message.error('属性编码为空');
    return;
  }
  const index = productForm.attrBaseList.findIndex(v => v.attrId === tabTitle2.attrId);
  productForm.attrBaseList[index].attrName = tabTitle2.attrName;
  productForm.attrBaseList[index].attrValue = tabTitle2.attrValue;
  visibleTile2.value = false;
};
const changeTitle4 = () => {
  if (!tabTitle4.price) {
    $message.error('价格为空');
    return;
  }
  const index = productForm.productgList.findIndex(v => v.productgId === tabTitle4.productgId);
  productForm.productgList[index].price = tabTitle4.price;
  visibleTile4.value = false;
};
const addAttr = row => {
  const day = Date.now() + '';
  const index = productForm.attrBaseList.findIndex(v => v.attrId === row.attrId);
  productForm.attrBaseList[index].attrSonList.push({
    attrSonId: day,
    name: '新属性',
    value: '',
  });
  tabTitle3.value = '';
  tabTitle3.name = '';
  tabTitle3.attrSonId = day;
};
onBeforeUnmount(() => {
  if (instance) {
    instance.destroy();
    instance = null;
  }
});
</script>
