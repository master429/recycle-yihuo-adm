import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import CTYPE from "../common/CTYPE";
import { Utils } from "../common";
import {
    HomeOutlined, ShopOutlined,
    UsergroupAddOutlined,
    AccountBookOutlined,
    AppstoreOutlined,
    UserOutlined,
    SettingOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];
        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }
        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        });
    };

    render() {

        let {
            ROLE_LIST,
            ROLE_EDIT,
            ADMIN_LIST,
            MERCHANT_EDIT,
            MERCHANT_FINANCE,
            PRODUCT_CATEGORY_EDIT,
            PRODUCT_EDIT,
            USER_EDIT,
            USER_LIST,
            SETTING_EDIT,
            HOME_EDIT,
            CONTENT_EDIT,
            BANNER_EDIT,
            ARTICLE_EDIT,
            ARTICLE_LIST,
        } = Utils.adminPermissions;

        let withAdmin = ADMIN_LIST || ROLE_LIST || ROLE_EDIT;

        let withMerchant = MERCHANT_EDIT;

        let withFinance = MERCHANT_FINANCE;

        let withProduct = PRODUCT_EDIT || PRODUCT_CATEGORY_EDIT;

        let withUser = USER_EDIT || USER_LIST;

        let withSetting = SETTING_EDIT || HOME_EDIT;

        let withContent = CONTENT_EDIT || BANNER_EDIT || ARTICLE_EDIT || ARTICLE_LIST;

        let { firstHide, selectedKey, openKey } = this.state;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'} />
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><HomeOutlined /><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>

                    {withMerchant && <SubMenu key='/app/merchant'
                        title={<span><ShopOutlined /><span
                            className="nav-text">商户管理</span></span>}>
                        {MERCHANT_EDIT && <Menu.Item key={CTYPE.link.merchant_edit.key}><Link
                            to={CTYPE.link.merchant_edit.path}>{CTYPE.link.merchant_edit.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withFinance && <SubMenu key='/app/finance'
                        title={<span><AccountBookOutlined /><span
                            className="nav-text">财务管理</span></span>}>
                        {MERCHANT_FINANCE && <Menu.Item key={CTYPE.link.finance_edit.key}><Link
                            to={CTYPE.link.finance_edit.path}>{CTYPE.link.finance_edit.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withProduct && <SubMenu key='/app/product'
                        title={<span><AppstoreOutlined /><span
                            className="nav-text">产品管理</span></span>}>
                        {PRODUCT_CATEGORY_EDIT && <Menu.Item key={CTYPE.link.category_edit.key}><Link
                            to={CTYPE.link.category_edit.path}>{CTYPE.link.category_edit.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withUser && <SubMenu key='/app/user'
                        title={<span><UserOutlined /><span
                            className="nav-text">用户管理</span></span>}>
                        {(USER_LIST || USER_EDIT) && <Menu.Item key={CTYPE.link.user_users.key}><Link
                            to={CTYPE.link.user_users.path}>{CTYPE.link.user_users.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withSetting && <SubMenu key='/app/setting'
                        title={<span><SettingOutlined /><span
                            className="nav-text">基础配置</span></span>}>
                        {SETTING_EDIT && <Menu.Item key={CTYPE.link.setting_uis.key}><Link
                            to={CTYPE.link.setting_uis.path}>{CTYPE.link.setting_uis.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withContent && <SubMenu key='/app/content'
                        title={<span><FileDoneOutlined /><span
                            className="nav-text">内容管理</span></span>}>
                        {(ARTICLE_EDIT || ARTICLE_LIST) && <Menu.Item key={CTYPE.link.content_articles.key}><Link
                            to={CTYPE.link.content_articles.path}>{CTYPE.link.content_articles.txt}</Link></Menu.Item>}
                    </SubMenu>}


                    {withAdmin && <SubMenu key='/app/admin'
                        title={<span><UsergroupAddOutlined /><span
                            className="nav-text">管理&权限</span></span>}>
                        {ADMIN_LIST && <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>}
                        {ROLE_LIST && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}
                    </SubMenu>}

                </Menu>
            </Sider>
        );
    }
}

export default SiderCustom;
