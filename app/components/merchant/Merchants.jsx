import React from 'react';
import classnames from 'classnames';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { App, CTYPE, Utils, U } from '../../common';
import MerchantUtils from './MerchantUtils';
import { Card, Button, Table, Row, Col, Dropdown, Menu, Modal, Select, Input, message, Form, Spin } from 'antd';
import { DownOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import '../../assets/css/merchant/merchants.less';

const id_div = 'div-modal-insert-merchant-admin';

export default class MerChants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchants: [],
            merchantAdmin: {},
            merchantQo: {},
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
        this.loadData();
    }
    loadData = () => {
        this.setState({ loading: true });
        let { pagination = {}, sortPropertyName, sortAscending, status, searchVal } = this.state;
        App.api('adm/merchant/merchants', {
            merchantQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                sortPropertyName,
                sortAscending,
                status: status == 0 ? '' : status,
                name: searchVal,
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                merchants: content,
                pagination,
                loading: false
            });
        });
    }

    edit = (id) => App.go(`/app/merchant/merchant-edit/${id}`)

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    modMerchantAdmin = (field, val) => {
        let { merchantAdmin = {} } = this.state;
        merchantAdmin[field] = val;
        this.setState({ merchantAdmin });
    }

    onSave = () => {
        let { merchantAdmin = {} } = this.state;
        let { name, mobile, password } = merchantAdmin;
        if (U.str.isEmpty(name)) {
            message.warn('请填写商户的管理员名称');
            return;
        }
        if (U.str.isEmpty(mobile)) {
            message.warn('请填写商户的管理员手机号');
            return;
        }
        if (U.str.isEmpty(password)) {
            message.warn('请填写商户的管理员的密码');
            return;
        }

        App.api('adm/merchant/save_merchant_admin', {
            merchantAdmin: JSON.stringify(merchantAdmin)
        }).then(() => {
            message.success("商户管理员已创建成功");
            this.close();
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
                App.api('/adm/merchant/update_status', { id, status: _status }).then(() => {
                    let { merchant = {} } = this.state;
                    merchant.status = _status;
                    this.setState({ merchant });
                    message.success(`${tip}成功`);
                    this.loadData();
                });
            }
        });
    }

    render() {
        let { MERCHANT_EDIT, MERCHANT_RENEW } = Utils.adminPermissions;
        let { merchants = [], loading, pagination = {} } = this.state;
        let imgs = [];
        merchants.map((item) => {
            imgs.push(item.logo);
        });
        return <div className="merchants">
            <BreadcrumbCustom first={CTYPE.link.merchant_edit.txt} />
            <Card>
                <Row style={{}}>
                    <Col span={2}><Button type="primary" onClick={() => this.edit(0)}>创建商户</Button></Col>
                    <Col span={22}>
                        <div className="search-bar">
                            <Select defaultActiveFirstOption defaultValue='状态'
                                onChange={(val) => {
                                    this.setState({
                                        status: val,
                                    }, this.loadData);
                                }}>
                                <Select.Option key={0}>状态</Select.Option>
                                <Select.Option key={1}>正常</Select.Option>
                                <Select.Option key={2}>禁用</Select.Option>
                                <Select.Option key={3}>逾期</Select.Option>
                            </Select>
                            <div className="search">
                                <Input placeholder="输入名称查询" suffix={<SearchOutlined onClick={() => this.loadData()} />}
                                    onChange={(e) => {
                                        this.setState({
                                            searchVal: e.target.value,
                                        });
                                    }} />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Spin spinning={loading}>

                    <Table dataSource={merchants} loading={loading}
                        columns={[
                            {
                                title: '序号',
                                dataIndex: 'id',
                                align: 'center',
                                render: (id, merchant, index) => {
                                    return index + 1;
                                }
                            }, {
                                title: 'LOGO',
                                dataIndex: 'logo',
                                align: 'center',
                                render: (img, item, index) => {
                                    return <img key={img} style={{ width: '60px', cursor: 'pointer' }} src={img} onClick={() => {
                                        Utils.common.showImgLightbox(imgs, index);
                                    }} />;
                                }
                            }, {
                                title: '名称',
                                dataIndex: 'name',
                                align: 'center',
                                render: (text, item, index) => {
                                    let { id } = item;
                                    return <div style={{ cursor: 'pointer' }} onClick={() => MerchantUtils.genDetailModal(item, this.loadData)}>{text}</div>
                                }
                            }, {
                                title: '套餐期限',
                                dataIndex: 'expireAt',
                                align: 'center',
                                render: (expireAt, item) => {
                                    let { status } = item;
                                    let isOverdue = status == 3 && expireAt < new Date().getTime();
                                    return <span className={classnames({ 'overdue': isOverdue })}>{U.date.format(new Date(expireAt), 'yyyy-MM-dd HH:mm')}</span>;
                                }
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
                                    return status == 1 ? <span>正常</span>
                                        : status == 2 ? <span style={{ color: '#C4381B' }}>封禁</span>
                                            : <span style={{ color: '#ff3a33' }}>逾期</span>;
                                }
                            }, {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                render: (text, merchant, index) => {
                                    let { id, name, merchantAdmins = [], status, expireAt } = merchant;
                                    let isOverdue = status == 3 && expireAt < new Date().getTime();
                                    let isBan = status == 2;
                                    return <Dropdown overlay={<Menu>
                                        {MERCHANT_EDIT && <Menu.Item key="1">
                                            <a onClick={() => this.edit(id)}>编辑</a>
                                        </Menu.Item>}
                                        {(!isBan && MERCHANT_RENEW) && <Menu.Item key="2">
                                            <a onClick={() => {
                                                MerchantUtils.merchantRenew(merchant, this.loadData);
                                            }}>续期</a>
                                        </Menu.Item>}
                                        {(!isOverdue && MERCHANT_EDIT) && <Menu.Item key="3">
                                            <a onClick={() => {
                                                this.updateStatus(id, status)
                                            }}>{status == 1 ? '封禁' : '解封'}</a>
                                        </Menu.Item>}
                                        <Menu.Item key="4">
                                            <a onClick={() => {
                                                MerchantUtils.genDetailModal(merchant, this.loadData)
                                            }}>商户详情</a>
                                        </Menu.Item>
                                        {MERCHANT_EDIT && <Menu.Item key="5">
                                            <a onClick={() => {
                                                MerchantUtils.insertMerchantAdmin(id, name);
                                            }}>新增商户管理员</a>
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
                            }, this.loadData);
                        }}
                    >

                    </Table>

                </Spin>
            </Card >
        </div >
    }
}