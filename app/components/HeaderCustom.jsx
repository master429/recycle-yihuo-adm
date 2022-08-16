import React from 'react';
import { Avatar, Layout, Menu, Modal } from 'antd';
import '../assets/css/header.less'

import App from '../common/App.jsx';
import AdminUtils from "./admin/AdminUtils";
import AdminProfile from "./admin/AdminProfile";
import { inject, observer } from 'mobx-react';

import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

@inject('admin')
@observer
class HeaderCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            profile: {},
            show_edit: false
        };
    }

    componentDidMount() {
        AdminProfile.get().then((profile) => {
            this.props.admin.setProfile(profile);
        });
    }


    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        this.props.toggle && this.props.toggle();
    };

    logout = () => {
        Modal.confirm({
            title: '确定要退出吗?',
            content: null,
            onOk() {
                App.logout();
                App.go('/login');
            },
            onCancel() {
            },
        });
    };

    showEdit = (val) => {
        this.setState({ show_edit: val || false });
    };

    render() {

        let profile = this.props.admin.getProfile || {};
        let { admin = {} } = profile;
        let { name = 'S', img } = admin;
        return (<Header className='header-page'>
            <span className="trigger custom-trigger"
                onClick={this.toggleCollapsed}>
                {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu className='header-top-bar'
                mode="horizontal" style={{ lineHeight: '65px', float: 'right' }}>
                <SubMenu key={0}
                    title={<Avatar src={img} size={40} icon={<UserOutlined style={{ fontSize: '20px' }} />} />}>
                    <MenuItemGroup title="用户中心">
                        <Menu.Item key="pwd"><span onClick={AdminUtils.modAdminPwd}>修改密码</span></Menu.Item>
                        <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
            </Menu>
            {name && <span style={{ color: '#fff', float: 'right' }}>{name}</span>}

        </Header>

        )
    }
}

export default HeaderCustom;
