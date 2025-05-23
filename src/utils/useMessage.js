import { onMounted, onUnmounted } from 'vue'

const doList = []

export const useMessage = (iframe) => {
  // 发消息
  const sendMessage = (message) => {
    if (iframe) {
      // 向子窗口发送消息
      iframe.contentWindow.postMessage({ api: 'getData', method: 'send', message }, '*')
      const op = {
        api: 'getData',
      }
      const p = new Promise((resolve, reject) => {
        op.resolve = resolve
      })
      op.promise = p
      doList.push(op)
    }
  }

  // 处理消息
  const acceptMessage = (e) => {
    const { data } = e
    const { method, api, message } = data
    if (method === 'send') {
      // 处理接收到的消息
      sendMessage({ api, method: 'response', message: `我已经接收到${message}` })
    }
    if (method === 'response') {
      // 处理接收到的消息
      const idx = doList.findIndex(i => i.api === api)
      if (idx === -1) return
      const op = doList[idx]
      op.resolve(message)
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
