<script lang="jsx" setup>
import { computed, ref, useAttrs } from 'vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElTabPane, ElTabs } from 'element-plus'
const props = defineProps({
  option: {
    type: Object,
    default: () => ({
      visible: false,
      title: '标题',
      formData: null,
      formConfig: [],
    }),
  },
  formConfig: { type: Array, default: () => [] },
})
const emit = defineEmits(['confirm', 'update:option'])
const formRef = ref(null)
const formData = ref({})

const rules = computed(() => getRules(props.formConfig))
const getRules = (formConfig, obj) => {
  if (!(formConfig && formConfig.length)) return []
  const result = obj || {}
  for (const item of formConfig) {
    if (item.type === 'tabs') {
      item.tabs.forEach((cur) => {
        Object.assign(result, getRules(cur.formConfig, result))
      })
      continue
    }
    if (item.required) {
      if (!result[item.prop]) result[item.prop] = []
      result[item.prop].push({
        required: true,
        message: `请输入${item.label}`,
        trigger: 'blur',
      })
    }
    if (item.validatorFn && item.validatorFn.length) {
      if (!result[item.prop]) result[item.prop] = []

      item.validatorFn.forEach((fn) => {
        result[item.prop].push({
          validator: fn(formData.value),
          trigger: 'blur',
        })
      })
    }
  }
  return result
}
// 获取默认值
const getDefaultForm = (formConfig, formData) => {
  if (!(formConfig && formConfig.length)) return null
  const result = formData || {}
  for (const conf of formConfig) {
    const { type, prop, tabs, defaultValue } = conf
    if (type === 'tabs') {
      if (!Array.isArray(tabs)) continue
      tabs.map(i => getDefaultForm(i.formConfig, result))
      continue
    }
    result[prop] = defaultValue
  }
  return result
}

const open = async () => {
  formData.value = props.option.formData || getDefaultForm(props.formConfig)

  setTimeout(() => formRef.value.clearValidate())
}

const close = () => {
  emit('update:option', { visible: false })
}

const handleConfirm = async () => {
  await formRef.value.validate()
  emit('confirm', formData.value)
  close()
}

const renderFormItem = (formConfig) => {
  if (!(formConfig && formConfig.length)) return null
  const formItem = item =>
  <ElFormItem label={item.label} prop={item.prop}>
    {
      item.render
        ? item.render(formData.value, item.prop)
        : <ElInput vModel={formData.value[item.prop]}></ElInput>
    }
  </ElFormItem>

  const tabs = item => Array.isArray(item.tabs)
    ? <ElTabs
      modelValue={item.tabs[0]?.tabCode}
      type="card"
      stretch={true}
      class="form-tabs"
      >
        {item.tabs.map(tab => (
          <ElTabPane label={tab.tabName} name={tab.tabCode}>
            {renderFormItem(tab.formConfig)}
          </ElTabPane>
        ))}
      </ElTabs>
    : null
  return formConfig.map(item =>
    item.type === 'tabs' ? tabs(item) : formItem(item),
  )
}
const attrs = useAttrs()

const render = () => {
  return (
    <ElDialog
      vModel={props.option.visible}
      title={props.option.title}
      width={props.option.width || '450px'}
      onOpen={open}
      v-slots={{
        footer: () =>
        <span class="dialog-footer">
          <ElButton onClick={close}>取消</ElButton>
          <ElButton type="primary" onClick={handleConfirm}>确认</ElButton>
        </span>,
      }}
      >
      <ElForm
        ref={formRef}
        model={formData.value}
        rules={rules.value}
        {...attrs}
      >
        {renderFormItem(props.formConfig)}
      </ElForm>
    </ElDialog>
  )
}
</script>

<template>
  <render></render>
</template>

<style lang="scss" scoped>

</style>
