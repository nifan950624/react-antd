const getActiveRule = (hash) => (location) => location.hash.startsWith(hash)

const microApps = [
  {
    name: 'sub-vue',
    entry: '//localhost:8000',
    activeRule: getActiveRule('#/sub'),
    container: '#subapp-viewport'
  }
]

export default microApps
