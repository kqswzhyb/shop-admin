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
        <a-form-item name="orderCode">
          <a-input v-model:value.trim="form.orderCode" allowClear placeholder="订单号" />
        </a-form-item>
        <a-form-item name="userName">
          <a-input v-model:value.trim="form.userName" allowClear placeholder="下单人" />
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
      rowKey="orderId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
      </template>
      <template #orderStatus="{ record }">
        <span>{{ dicData(dicList['order_status'], record.orderStatus) }}</span>
      </template>
      <template #address="{ record }">
        <a-popover title="地址">
          <template #content>
            <p>{{ record.contactName }}————{{ record.contactPhone }}</p>
            <p>{{ record.contactPhone }}</p>
            <p>{{ record.provinceName }}——{{ record.cityName }}——{{ record.areaName }}</p>
            <p>{{ record.addressDetail }}</p>
          </template>
          <a-button type="primary">
            收货信息
          </a-button>
        </a-popover>
      </template>
      <template #expandedRowRender="{ record }">
        <p class="product-detail" v-for="item in record.orderDetailList" :Key="item.orderDetailId">
          <span>产品名称: {{ item.productName }}</span>
          <span>单价: {{ item.originPrice }}</span>
          <span>购买数量: {{ item.productNum }}{{ item.productUnit }}</span>
          <span>属性: {{ item.attrs }}</span>
        </p>
      </template>
      <template #operation="{ record }">
        <a-dropdown>
          <a class="dropdown-menu" @click="e => e.preventDefault()">
            <DownCircleOutlined style="font-size:20px;" />
          </a>
          <template v-slot:overlay>
            <a-menu>
              <a-menu-item v-if="record.orderStatus === '4'" key="发货">
                <a-popconfirm
                  :title="`是否发货 ${record?.orderCode}  ？`"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="
                    commonFunc(
                      updateStatus,
                      { orderId: record?.orderId, orderStatus: '5' },
                      getList,
                    )
                  "
                >
                  <span>发货</span>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-divider />
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, watchEffect, ref } from 'vue';
export { order as columns } from '@/table/order/order';
export { getOrderList, updateOrder, updateStatus } from '@/api/order';
export { commonFunc, dicData } from '@/utils/util';
export { DownCircleOutlined } from '@ant-design/icons-vue';
export { page, searchList, getList, pagination, data, loading } from '@/mixins/baseForm';
import { useStore } from 'vuex';

export const form = reactive({
  orderCode: '',
  userName: '',
});
const store = useStore();
export const dicList = ref([]);
watchEffect(() => {
  dicList.value = store.getters['common/dic'];
});
onBeforeMount(() => {
  getList(getOrderList, form);
});

export const resetForm = () => {
  form.orderCode = '';
  form.userName = '';
  searchList(getList);
};
</script>

<style lang="less" scoped>
.product-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
