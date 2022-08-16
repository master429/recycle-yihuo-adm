import React, {Component} from 'react';
import {Layout, message} from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import './assets/css/common.less'
import './assets/css/common/common-edit.less'
import App from "./common/App";
import {Utils} from "./common";

const {Content, Footer} = Layout;

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            permissionsLoaded: false
        };
    }

    componentDidMount() {
        if (window.location.hash.indexOf('login') < 0) {
            let adm = App.getAdmProfile();
            if (!adm.id) {
                App.logout();
                App.go('/login');
            } else {
                this.loadPermissions(0);
            }
        }
    }

    loadPermissions = (count) => {

        let timer = null;
        if (!Utils.adminPermissions) {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                this.loadPermissions(count + 1);
            }, 500);

            if (count > 3) {
                clearTimeout(timer);
                App.logout();
                App.go('/login');
            }
            Utils.adm.initPermissions();
        } else {
            this.setState({
                permissionsLoaded: true
            });
            message.destroy();
        }
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        let {permissionsLoaded, collapsed} = this.state;
        if (permissionsLoaded) {

            return <Layout className="ant-layout-has-sider">
                <SiderCustom collapsed={collapsed}/>
                <Layout>
                    <Content style={{margin: '0 16px', overflow: 'initial'}}>
                        {this.props.children}
                    </Content>
                    {/*<Footer style={{textAlign: 'center'}}>*/}
                    {/*</Footer>*/}
                </Layout>
            </Layout>
        } else {
            return <div/>
        }
    }

}
