<template>
  <div>
    <h1>{{ msg }}</h1>
    <p>{{ computedMsg }}</p>
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="Activity name">
        <a-input v-model:value="form.name" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup="props">
  import { computed, reactive } from 'vue'

  export const named = "hello"

  declare const props: {
    msg: string
  }

  export const form = reactive({ name: '3232' })

  export const computedMsg = computed(() => props.msg + '!!!')
</script>
