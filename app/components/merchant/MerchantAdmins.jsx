import React from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { App, CTYPE, Utils, U } from '../../common';
import { DownOutlined } from '@ant-design/icons';
import MerchantUtils from './MerchantUtils';

export default class MserchantAdmins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchantAdmins: this.props.list
        }
    }

    render() {
        let { MERCHANT_EDIT } = Utils.adminPermissions;
        let { merchantAdmins = [] } = this.state;
        return <Table
            pagination={false}
            dataSource={merchantAdmins}
            columns={[
                {
                    title: '序号',
                    dataIndex: 'id',
                    align: 'center',
                },
                {
                    title: '手机号',
                    dataIndex: 'mobile',
                    align: 'center',
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    render: (text, item, index) => {
                        let { id, name } = item;
                        return <Dropdown overlay={<Menu>
                            {MERCHANT_EDIT && <Menu.Item key="1">
                                <a onClick={() => {
                                    MerchantUtils.modMerchantAdminPwd(id);
                                }}>重置密码</a>
                            </Menu.Item>}
                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">
                                操作 <DownOutlined />
                            </a>
                        </Dropdown>
                    }
                }
            ]}
            rowKey={record => record.id} />
    }
}