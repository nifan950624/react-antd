import React from 'react'
import ReactDOM from 'react-dom'
import {
  registerMicroApps,
  start,
  initGlobalState,
  MicroAppStateActions
} from 'qiankun'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/store'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import microApps from './micro-app'
import 'moment/locale/zh-cn'
import App from './App'
import '@/assets/css/public.scss'
import '@/utils'

moment.locale('zh-cn')

const actions: MicroAppStateActions = initGlobalState({ a: 'a' })

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev)
})
actions.setGlobalState({ name: 'nifan' })
actions.offGlobalStateChange()

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById('root')
)

const obj: any = {
  beforeLoad: (app) => {
    console.log('before load app.name====>>>>>', app.name)
  },
  beforeMount: [
    (app) => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    (app) => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
    }
  ],
  afterUnmount: [
    (app) => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
}

registerMicroApps(microApps, obj)

start()
