import React from 'react';
import { App, Utils, U } from '../../common';
import { Modal, Form, Input, Row, Col, message, Spin, Select } from 'antd';

const id_div = 'div-modal-insert-merchant-admin';

export default class InsertMerchantAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchantId: this.props.merchantId,
            merchantName: this.props.merchantName,
            merchantAdmin: {},
            merchantRoles: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api('adm/merchant/merchant_roles', {
            merchantId: this.props.merchantId,
        }).then((merchantRoles) => {
            this.setState({
                merchantRoles
            });
        });
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    modMerchantAdmin = (field, val) => {
        let { merchantAdmin = {} } = this.state;
        merchantAdmin[field] = val;
        this.setState({ merchantAdmin });
    }

    onSave = () => {
        let { merchantAdmin = {}, merchantId } = this.state;
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
            merchantAdmin: JSON.stringify({
                ...merchantAdmin,
                merchantId
            })
        }).then(() => {
            message.success("商户管理员已创建成功");
            this.close();
        });

    }

    render() {
        let { merchantId, merchantName, merchantAdmin = {}, merchantRoles = [] } = this.state;
        console.log(merchantAdmin);
        let { name, mobile, password, roleId } = merchantAdmin;

        return <Modal
            visible={true}
            title="新增商户管理员"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onOk={this.onSave}
            onCancel={this.close}
        >
            <Row style={{ height: '45px' }}>
                <Col span={12}>商户名称：{merchantName}</Col>
                {/* <Col span={12}>商户ID：{id}</Col> */}
            </Row>

            <Form >
                <Form.Item label="姓名" required={true} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="请填入姓名" value={name} onChange={(e) => this.modMerchantAdmin('name', e.target.value)} />
                </Form.Item>
                <Form.Item label="手机号" required={true} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="请填入商户联系人" value={mobile} onChange={(e) => this.modMerchantAdmin('mobile', e.target.value)} />
                </Form.Item>
                <Form.Item label="密码" required={true} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Input placeholder="请填入密码" value={password} onChange={(e) => this.modMerchantAdmin('password', e.target.value)} />
                </Form.Item>
                <Form.Item label="权限组" style={{ marginBottom: 0 }} required={true} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                    <Select placeholder="请选择权限组" onChange={(val) => {
                        this.setState({
                            merchantAdmin: {
                                ...merchantAdmin,
                                roleId: val
                            }
                        });
                    }}>
                        {merchantRoles.map((item, index) => {
                            let { id, name } = item;
                            return <Select.Option key={id}>{name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>;
    }
}