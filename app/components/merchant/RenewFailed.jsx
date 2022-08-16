import React from 'react';
import '../../assets/css/merchant/renew-detail.less';
import { Modal, Form, Button, Radio, message, Input } from 'antd';
import { App, CTYPE, U, Utils } from "../../common";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const id_div = 'div-modal-renew-failed';

export default class RenewDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renew: this.props.renew,
            tempStatus: 2,
            remark: '',
        }
    }
    componentDidMount() {
    }
    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    onOk = () => {
        let { renew = {}, tempStatus, remark } = this.state;
        console.log(tempStatus);
        if (U.str.isEmpty(remark) || remark.length < 4) {
            message.warn('备注最少四个字');
            return;
        }
        let tip = tempStatus == 3;
        Modal.confirm({
            title: `确认${tip ? '审核通过' : '审核失败'}吗？`,
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                App.api('adm/merchant/renew_audit', {
                    renew: JSON.stringify({
                        ...renew,
                        auditorId: App.getAdmProfile().id,
                        status: tempStatus,
                        remark,
                    })
                }).then(() => {
                    message.success(tip ? '审核通过，续费周期已到账' : '审核失败，请检查续期信息');
                    this.close();
                });
            }
        });

    }

    render() {

        let { renew = {}, tempStatus, remark } = this.state;
        return <Modal
            visible={true}
            title="账单审核"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onOk={this.onOk}
            onCancel={this.close}>
            <Form.Item
                {...CTYPE.dialogItemLayout}
                label={<span>审核结果</span>}
                required={true}
            >
                <Radio.Group value={tempStatus} onChange={(e) => {
                    this.setState({
                        tempStatus: e.target.value
                    });
                }}>
                    <Radio value={3}>通过</Radio>
                    <Radio value={2}>失败</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                {...CTYPE.dialogItemLayout}
                label={<span>失败原因</span>}
                required={true}
            >
                <Input className="money" placeholder="请填写失败原因" onChange={(e) => {
                    this.setState({ remark: e.target.value })
                }} />
            </Form.Item>

        </Modal>
    }
}