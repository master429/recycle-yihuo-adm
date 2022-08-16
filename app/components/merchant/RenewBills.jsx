import React from 'react';
import { App, CTYPE, U, Utils } from '../../common'
import '../../assets/css/merchant/renew-bills.less'
import { Modal, Table, Dropdown, Menu, message } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import MerhantUtils from './MerchantUtils';

export default class RenewBills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renews: [],
            loading: false,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0
            }
        }
    }

    initData = (renews) => {
        renews.map((item, index) => {
            item.index = index + 1;
        });
    }

    byAudit = (renew) => {
        Modal.confirm({
            title: `确认审核通过吗？`,
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                App.api('adm/merchant/renew_audit', {
                    renew: JSON.stringify({
                        ...renew,
                        auditorId: App.getAdmProfile().id,
                    })
                }).then(() => {
                    message.success("审核通过，续费周期已到账")
                    this.props.loadRenews();
                });
            }
        });
    }

    render() {
        let {
            MERCHANT_FINANCE,
            MERCHANT_RENEW,
            RENEW_AUDIT,
        } = Utils.adminPermissions;
        let withFinanceAndRenew = MERCHANT_FINANCE && MERCHANT_RENEW && RENEW_AUDIT;
        let { renews = [], loading } = this.props;
        let { pagination = {} } = this.state;
        this.initData(renews);
        return <Table rowKey={row => row.id}
            loading={loading}
            dataSource={renews}
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                },
                {
                    title: '商户名称',
                    dataIndex: 'merchantId',
                    align: 'center',
                    render: (merchantId, renew, index) => {
                        let { merchant = {} } = renew;
                        let { name } = merchant;
                        return <span style={{ cursor: 'pointer' }}>{name}</span>;
                    }
                },
                {
                    title: '费用金额（元）',
                    dataIndex: 'amount',
                    align: 'center',
                    render: (amount, renew, index) => {
                        return U.num.formatPrice(amount);
                    }
                },
                {
                    title: '续费周期',
                    dataIndex: 'duration',
                    align: 'center',
                    render: (duration, renew, index) => {
                        return <span style={{ cursor: 'pointer' }} onClick={() => MerhantUtils.genRenewDetail(renew, this.props.loadRenews)}>{U.date.duration2Str(duration)}</span>;
                    }
                },
                {
                    title: '交易凭证',
                    dataIndex: 'proof',
                    align: 'center',
                    render: (proof = [], renew, index) => {
                        let imgs = [];
                        proof.map((item) => {
                            imgs.push(item);
                        });
                        return <div className="proof">
                            {proof.map((img, i) => {
                                return <img src={img} key={img} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, i);
                                }} />
                            })}
                        </div>
                    }
                },
                {
                    title: '交易时间',
                    dataIndex: 'createdAt',
                    align: 'center',
                    render: (createdAt, renew, index) => {
                        return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                    }
                },
                {
                    title: '交易状态',
                    dataIndex: 'status',
                    align: 'center',
                    render: (status, renew, index) => {
                        return MerhantUtils.renewStatus(status);
                    }
                },
                {
                    title: '订单备注',
                    dataIndex: 'remark',
                    align: 'center',
                },
                {
                    title: '录单操作人员',
                    dataIndex: 'auditorId',
                    align: 'center',
                    render: (auditorId, renew, index) => {
                        let { auditor = {} } = renew;
                        let { name } = auditor;
                        return auditorId ? name : '暂无';
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    render: (text, renew, index) => {
                        let { status } = renew;
                        return <Dropdown
                            disabled={status != 1 ? true : false}
                            overlay={<Menu>
                                {(status == 1 && withFinanceAndRenew) && <Menu.Item key="1">
                                    <a onClick={() => this.byAudit(renew)}>审核通过</a>
                                </Menu.Item>}
                                {(status == 1 && withFinanceAndRenew) && <Menu.Item key="2">
                                    <a onClick={() => { MerhantUtils.renewFailed(renew) }}>审核失败</a>
                                </Menu.Item>}
                            </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">
                                操作 <DownOutlined />
                            </a>
                        </Dropdown>
                    }
                }
            ]}
            pagination={{
                ...CTYPE.commonPagination,
                ...pagination,
            }}

            onChange={(pagination) => {
                this.setState({
                    pagination,
                    loading: false,
                }, this.props.loadData);
            }}></Table>
    }
}