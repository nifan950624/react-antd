import React, { useState, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Dropdown, Layout } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import style from './Header.module.scss'

interface Props extends ReduxProps {}

const Header: FC<Props> = ({ storeData: { userInfo }, setStoreData }) => {
  const history = useHistory()
  const { userName = '-' } = userInfo
  const firstWord = userName.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const logout = async () => {
    await setStoreData('SET_USERINFO', {})
    history.replace({ pathname: '/login' })
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  const toggle = (): void => {
    setCollapsed(!collapsed)
    setStoreData('SET_COLLAPSED', !collapsed)
  }

  return (
    <Layout.Header className={style.header}>
      <div className={style.toggleMenu} onClick={toggle}>
        {collapsed ? (
          <MenuUnfoldOutlined className={style.trigger} />
        ) : (
          <MenuFoldOutlined className={style.trigger} />
        )}
      </div>
      <Breadcrumb />
      <Dropdown className={`fr ${style.content}`} overlay={menu}>
        <span className={style.user}>
          <span className="avart">{firstWord}</span>
          <span>{userName}</span>
        </span>
      </Dropdown>
    </Layout.Header>
  )
}
export default connect(
  (state) => state,
  actions
)(Header)
