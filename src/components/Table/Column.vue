<script lang="jsx">
import { h } from 'vue'
// 空数据时占位
const EMPTY_PLACEHOLDER = '—'
// 测试字典
const dictData = {
  test: [{ label: '测试', value: 1 }, { label: '测试2', value: 2 }],
}
export default {
  name: 'Column',
  props: { columns: Array },
  render: (ctx) => {
    const cellRender = (col, scope) => {
      const {
        render,
        type,
        prop,
        dictKey,
        customMap,
      } = col

      if (['index', 'selection'].includes(type)) return
      // 如果有自定义render函数则直接使用
      if (render) return render(scope, h)

      let result
      if (dictKey && dictData[dictKey]) {
        result = dictData[dictKey]?.find(i => i?.value === scope.row[prop])?.label
      } else if (customMap) {
        result = customMap[scope.row[prop]] ?? scope.row[prop]
      } else {
        result = scope.row[prop] ?? EMPTY_PLACEHOLDER
      }

      result = (
            <span
              class="no-drag"
              style="overflow:hidden;
                text-overflow: ellipsis;
                display:inline-block;
                width:100%;"
            >
              {result ?? EMPTY_PLACEHOLDER}
            </span>
      )
      return result
    }
    const getRender = (columns) => {
      return columns
        .filter(({ vIf = true }) => vIf)
        .map((col) => {
          const { children, vIf, ...otherAttrs } = col
          const { require, labelRender, label, render, ...attrs } = otherAttrs

          return (
              <el-table-column
                show-overflow-tooltip
                {...attrs}
                v-slots={{
                  default: (scope) => {
                    if (Array.isArray(children) && children.length > 0) return getRender(children)
                    else return cellRender(otherAttrs, scope)
                  },
                  header: () => {
                    return (
                      <>
                        {require ? <span style="color:red;">*</span> : null}
                        {labelRender ? labelRender() : <span>{label}</span>}
                      </>
                    )
                  },
                }}
              ></el-table-column>
          )
        })
    }
    return getRender(ctx.columns)
  },
}
</script>

<style lang="scss" scoped>

</style>
