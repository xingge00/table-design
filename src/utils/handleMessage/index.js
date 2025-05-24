const sleep = (time, msg) => new Promise(resolve => setTimeout(() => resolve(msg), time))

const doMap = {
  1000: async () => await sleep(1000, 'sleep1000'),
  2000: async () => await sleep(2000, 'sleep2000'),
  init: async () => {
    await sleep(3000)
    return 'init_ok'
  },
}
export default async function (businessType, msg) {
  const fn = doMap[businessType]

  return fn ? await fn?.(msg) : 'normal_ok'
}
