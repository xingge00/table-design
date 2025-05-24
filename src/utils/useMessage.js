import { onMounted, onUnmounted, unref } from 'vue'
import handleMessage from './handleMessage'

const TIME_OUT = 10000 // 超时时间

const loadingCache = {}
const randomId = () => Math.random().toString(36).slice(2, 10)

export const useMessage = (iframeRef) => {
  const iframe = unref(iframeRef)
  const postMessage = iframe ? iframe.contentWindow.postMessage : window.parent.postMessage
  // 发消息
  const sendMessage = (params, obj = {}) => {
    const tempId = randomId()
    if (typeof params === 'function') throw new Error('argument1 cannot be a function')
    if (typeof obj !== 'object') throw new Error('argument21 must be an object')
    if (typeof params === 'string') params = { ...obj, businessType: params }
    const { businessType, message, method = 'get', requestId = tempId, responseId } = params

    const op = {}
    op.promise = new Promise((resolve, reject) => {
      op.resolve = resolve
      op.reject = reject
      postMessage({ businessType, requestId, method, message, responseId }, '*')
    })

    if (method === 'get') {
      loadingCache[requestId] = op
      setTimeout(() => {
        const op = loadingCache[requestId]
        if (!op) return
        op.reject(new Error('请求超时'))
      }, TIME_OUT)
      return op.promise
    }

    return null
  }

  // 处理消息
  const acceptMessage = async (e) => {
    const { data } = e
    const { method, businessType, requestId, message, responseId } = data

    // 处理请求的消息
    if (method === 'get') {
      const res = await handleMessage(businessType, message)
      sendMessage({ businessType, method: 'response', responseId: requestId, message: res })
    }

    // 处理响应的消息
    if (method === 'response') {
      const op = loadingCache[responseId]
      if (!op) return
      op.resolve(message)
      delete loadingCache[responseId]
    }
  }

  onMounted(() => {
    window.addEventListener('message', acceptMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', acceptMessage)
  })

  return {
    sendMessage,
  }
}
