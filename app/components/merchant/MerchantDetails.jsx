import React from 'react';
import '../../assets/css/merchant/merchant-details.less';
import { App, CTYPE, U, Utils } from '../../common';
import { Modal, message, Divider } from 'antd';
import MerchantAdmins from './MerchantAdmins';

const id_div = 'div-modal-merchant-details';

export default class MerChantDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchant: JSON.parse(JSON.stringify(this.props.merchant))
        }
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    render() {
        let { MERCHANT_EDIT, MERCHANT_RENEW, MERCHANT_ADMIN_LIST } = Utils.adminPermissions;
        let { merchant = {} } = this.state;
        let { id, logo, name, status, expireAt, location = {}, merchantAdmins = [] } = merchant;
        let { code, detail, lat, lng, poiaddress = '', poiname = '' } = location;
        let dayDiffDuration = U.date.daysDiff(expireAt, new Date().getTime());

        return <Modal
            width="800px"
            visible={true}
            footer={null}
            title="商户详情"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}>
            <div className="top">
                <div className="logo">
                    <img src={logo} />
                </div>
                <div className="summary">
                    <div className="line">
                        <label>商户ID</label>
                        {id}
                    </div>
                    <div className="line">
                        <label>商户名称</label>
                        {name}
                    </div>
                    <div className="line">
                        <label>商户状态</label>
                        {status === 1 ? '正常' : status === 2 ? <div style={{ display: 'inline-block', color: '#C4381B' }}>封禁</div> : <div style={{ color: '#ff3a33', display: 'inline-block' }}>逾期</div>}
                        {/* {MERCHANT_EDIT && <span className="action" onClick={() => this.updateStatus(id, status)}>
                            {status == 1 ? '封禁商户' : status == 2 ? <p style={{ color: "#C4381B" }}>解封商户</p> : ''}
                        </span>} */}
                    </div>
                    <div className="line">
                        <label>到期时间</label>
                        <div className="line-time">
                            <p>{U.date.format(new Date(expireAt), 'yyyy-MM-dd HH:mm')}</p>
                            <p style={{ marginLeft: '20px' }}>
                                剩余{dayDiffDuration <= 0 ? 0 : dayDiffDuration}天
                            </p>
                        </div>
                        {/* {MERCHANT_RENEW && <span onClick={() => MerhantUtils.merchantRenew(merchant, this.props.cb)}>续期</span>} */}
                    </div>
                    <div className="line">
                        <label>地址</label>
                        {poiaddress} {poiname}
                    </div>
                </div>
            </div>
            <Divider>管理员</Divider>
            {MERCHANT_ADMIN_LIST && <MerchantAdmins list={merchantAdmins} />}
        </Modal>
    }
}