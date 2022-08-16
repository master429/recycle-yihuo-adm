import React from 'react';
import { Avatar, Button, Card, Dropdown, Menu, message, Modal, Table, Tag } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import { CTYPE, U } from "../../common";
import AdminUtils from "./AdminUtils";
import { inject, observer } from 'mobx-react'
import AdminProfile from "./AdminProfile";
import { UserOutlined, DownOutlined } from '@ant-design/icons';

@inject('admin')
@observer
class Admins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false
        }
    }

    componentDidMount() {
        AdminProfile.get().then(profile => {
            this.props.admin.setProfile(profile);
        });
        this.loadData();
    }

    loadData = () => {
        this.setState({ loading: true });
        App.api('adm/admin/admins').then((admins) => {
            this.setState({
                list: admins,
                loading: false
            });
        });

    };

    edit = admin => {
        App.go(`/app/admin/admin-edit/${admin.id}`)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/admin/remove_admin', { id }).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    updateStatus = (id, status) => {
        let tip = status == 1 ? '解封' : '禁用';
        Modal.confirm({
            title: `确认${tip}操作?`,
            onOk: () => {
                App.api('adm/admin/admin_status', { id, status }).then(() => {
                    message.success(`${tip}成功`);
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let { list = [], loading } = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.admin_admins.txt} />

            <Card title={<Button type="primary" onClick={() => {
                this.edit({ id: 0 })
            }}>新增管理员</Button>}>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '头像',
                        dataIndex: 'img',
                        className: 'txt-center',
                        render: (img => {
                            return <Avatar shape="square" src={img} size={40} icon={<UserOutlined />} />
                        })
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center'
                    }, {
                        title: '管理组',
                        dataIndex: 'role.name',
                        className: 'txt-center',
                        render: (str, admin) => {
                            let { role = {} } = admin;
                            return <Tag color='blue'>{role.name}</Tag>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status, admin) => {
                            let { id } = admin;
                            let required = App.getAdmProfile().id == id;
                            return <Tag color={status == 1 ? (required ? '#ffd324' : '#87d068') : '#f50'}>{status == 1 ? (required ? '本机' : '正常') : '封禁'}</Tag>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, admin, index) => {
                            let { id, status } = admin;
                            let required = App.getAdmProfile().id == id;
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(admin)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider />
                                {!required && <Menu.Item key="2">
                                    <a onClick={() => this.updateStatus(id, status == 1 ? 2 : 1)}>{status == 1 ? '禁用' : '解封'}</a>
                                </Menu.Item>}
                                <Menu.Divider />
                                <Menu.Item key="3">
                                    <a onClick={() => AdminUtils.adminSessions(admin.id, admin.name)}>登录日志</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <DownOutlined />
                                </a>
                            </Dropdown>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading} />
            </Card>
        </div>
    }
}

export default Admins;
