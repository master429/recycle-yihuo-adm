import React from 'react';
import { App, CTYPE, U, Utils } from '../../common'
import { Modal, Table, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import MerchantUtils from './MerchantUtils';

const id_div = 'div-modal-renew-bill';

export default class MerchantBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchant: this.props.merchant,
            renews: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0
            },
            sortPropertyName: 'id',
            sortAscending: false,
        }
    }

    componentDidMount() {
        this.locaData();
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    locaData = () => {
        this.setState({ loading: true });
        let { pagination = {}, sortPropertyName, sortAscending, merchant } = this.state;
        let { id } = merchant;
        App.api('adm/merchant/renews', {
            renewQo: JSON.stringify({
                merchantId: id,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                sortPropertyName,
                sortAscending,
            })
        }).then(result => {
            let { content } = result;
            let index = 0;
            content.map((item, index) => {
                item.index = index + 1;
            });
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                renews: content,
                pagination,
                loading: false
            });
        })
    }

    render() {
        let { renews = [], merchant = {} } = this.state;
        console.log(renews);
        return <Modal
            width='800px'
            visible={true}
            title="续费订单记录"
            footer={null}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}>
            <Table rowKey={row => row.id}
                dataSource={renews}
                columns={[
                    {
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                    },
                    {
                        title: '期限',
                        dataIndex: 'duration',
                        align: 'center',
                        render: (duration, renew, index) => {
                            return U.date.duration2Str(duration);
                        }
                    },
                    {
                        title: '续期操作人员',
                        dataIndex: 'renewor',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        align: 'center',
                        render: (status, renew, index) => {
                            return MerchantUtils.renewStatus(status);
                        }
                    },
                    {
                        title: '订单记录创建时间',
                        dataIndex: 'createdAt',
                        align: 'center',
                        render: (createdAt, renew, index) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: 'center',
                        render: (text, item, index) => {
                            let { id, name } = item;
                            return <Dropdown overlay={<Menu>
                                {<Menu.Item key="1">
                                    <a>续费记录详情</a>
                                </Menu.Item>}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <DownOutlined />
                                </a>
                            </Dropdown>
                        }
                    }
                ]}
            ></Table>
        </Modal>
    }
}