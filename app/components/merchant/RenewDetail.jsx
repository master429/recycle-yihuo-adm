import React from 'react';
import '../../assets/css/merchant/renew-detail.less';
import {Modal, message} from 'antd';
import {App, U, Utils} from "../../common";
import {ExclamationCircleOutlined} from '@ant-design/icons';

const id_div = 'div-modal-renew-detail';

export default class RenewDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renew: this.props.renew,
            author: {},
            remark: '',
        }
    }

    componentDidMount() {
        this.getAuth();
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    getAuth() {
        this.setState({
            author: App.getAdmProfile(),
        });
    }

    onOk = (status) => {
        let {renew = {}, author = {}, remark} = this.state;
        let {proof = [], id, merchantId, reneworId, duration, renewedAt, uid} = renew;
        if (U.str.isEmpty(remark) || remark.length < 4) {
            message.warn('备注最少四个字');
            return;
        }
        let tip = status === 2 ? '审核不通过' : status === 3 ? '审核通过' : '';
        let alert = status === 2 ? '审核不通过' : status === 3 ? '审核通过，已续期' : '续费失败';
        Modal.confirm({
            title: `确认进行${tip}操作吗？`,
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                App.api('adm/merchant/renew_audit', {
                    renew: JSON.stringify({
                        id,
                        proof,
                        reneworId,
                        merchantId,
                        duration,
                        renewedAt,
                        remark,
                        auditorId: author.id,
                        status,
                        uid,
                    })
                }).then(() => {
                    message.success(alert);
                    this.close();
                });
            }
        });

    }

    render() {

        return <Modal
            visible={true}
            title="账单审核"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}>

        </Modal>
    }
}