import React from 'react';
import { App, CTYPE, Utils, U } from '../../common';
import '../../assets/css/user/users-page.less';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Button, Modal, Card, Dropdown, Table, message, Menu } from 'antd';
import { UserAddOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';


export default class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user: {},
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0
            },
            sortPropertyName: 'id',
            sortAscending: false,
        }
    }

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = () => {
        this.setState({ loading: true });
        let { pagination = {}, sortPropertyName, sortAscending } = this.state;
        App.api('adm/user/users', {
            userQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                sortPropertyName,
                sortAscending,
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                users: content,
                pagination,
                loading: false
            });
        });
    }

    updateStatus = (id, status) => {
        let tip = status === 1 ? '封禁' : '解封';
        let _status = status === 1 ? 2 : 1;
        Modal.confirm({
            title: `确认进行${tip}操作吗？`,
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                App.api('/adm/user/user_status', { id, status: _status }).then(() => {
                    let { user = {} } = this.state;
                    user.status = _status;
                    this.setState({ user });
                    message.success(`${tip}成功`);
                    this.loadUsers();
                });
            }
        });
    }

    edit = user => {
        App.go(`/app/user/user-edit/${user.id}`)
    };

    render() {

        let { USER_EDIT, USER_LIST } = Utils.adminPermissions;

        let { users = [], loading, pagination = {} } = this.state;

        let imgs = [];
        users.map((item) => {
            imgs.push(item.avatar);
        });

        return <div className="users-page">
            <BreadcrumbCustom first={CTYPE.link.user_users.txt} />
            <Card>
                <div className="top">
                    <Button type="primary" onClick={() => {
                        this.edit({ id: 0 });
                    }}><UserAddOutlined />新建用户</Button>
                </div>
                <Table dataSource={users} loading={loading}
                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            align: 'center',
                            render: (id, user, index) => {
                                return index + 1;
                            }
                        }, {
                            title: '头像',
                            dataIndex: 'avatar',
                            align: 'center',
                            render: (img, item, index) => {
                                return <img key={img} style={{ width: '50px', cursor: 'pointer', borderRadius: '50%' }} src={img} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, index);
                                }} />;
                            }
                        }, {
                            title: '名称',
                            dataIndex: 'nick',
                            align: 'center',
                            render: (text, item, index) => {
                                return <div style={{ cursor: 'pointer' }}>{text}</div>
                            }
                        }, {
                            title: '手机号',
                            dataIndex: 'mobile',
                            align: 'center',
                        }, {
                            title: '创建时间',
                            dataIndex: 'createdAt',
                            align: 'center',
                            render: (createdAt, item) => {
                                return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                            }
                        }, {
                            title: '状态',
                            dataIndex: 'status',
                            align: 'center',
                            render: (status, item, index) => {
                                return status == 1 ? <span>正常</span> : <span style={{ color: '#C4381B' }}>封禁</span>
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'action',
                            align: 'center',
                            render: (text, user, index) => {
                                let { id, status } = user;
                                return <Dropdown overlay={<Menu>
                                    {USER_EDIT && <Menu.Item key="1">
                                        <a onClick={() => this.edit(user)}>编辑</a>
                                    </Menu.Item>}

                                    {USER_EDIT && <Menu.Item key="2">
                                        <a onClick={() => this.updateStatus(id, status)}>{status == 1 ? '封禁' : '解封'}</a>
                                    </Menu.Item>}

                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <DownOutlined />
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]}
                    rowKey={record => record.id}
                    pagination={{
                        ...CTYPE.commonPagination,
                        ...pagination,
                    }}

                    onChange={(pagination) => {
                        this.setState({
                            pagination,
                            loading: false,
                        }, this.loadUsers);
                    }}
                >

                </Table>
            </Card>
        </div>
    }
}