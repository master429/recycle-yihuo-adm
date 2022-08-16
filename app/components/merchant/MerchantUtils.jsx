import React from 'react';
import { App, CTYPE, Utils, U } from '../../common';
import { Tag } from 'antd';
import MerchantDetails from './MerchantDetails';
import InsertMerchantAdmin from './InsertMerchantAdmin';
import MerchantRenew from './MerchantRenew';
import RenewUploadProof from './RenewUploadProof';
import MerchantBill from './MerchantBill';
import RenewDetail from './RenewDetail';
import RenewFailed from './RenewFailed';
import ModMerchantAdminPwd from './ModMerchantAdminPwd';

let MerhantUtils = {
    genDetailModal: (merchant, cb) => {
        Utils.common.renderReactDOM(<MerchantDetails merchant={merchant} cb={cb} />);
    },
    genBillModal: (merchant) => {
        Utils.common.renderReactDOM(<MerchantBill merchant={merchant} />);
    },
    insertMerchantAdmin: (id, name) => {
        Utils.common.renderReactDOM(<InsertMerchantAdmin merchantId={id} merchantName={name} />);
    },
    merchantRenew: (merchant, cb) => {
        Utils.common.renderReactDOM(<MerchantRenew merchant={merchant} cb={cb} />);
    },
    renewUploadProof: (merchant) => {
        Utils.common.renderReactDOM(<RenewUploadProof merchant={merchant} />);
    },
    genRenewDetail: (renew) => {
        Utils.common.renderReactDOM(<RenewDetail renew={renew} />);
    },
    renewFailed: (renew) => {
        Utils.common.renderReactDOM(<RenewFailed renew={renew} />);
    },
    modMerchantAdminPwd: (id) => {
        Utils.common.renderReactDOM(<ModMerchantAdminPwd id={id} />);
    },
    renewStatus: (status) => {
        if (status == 1) {
            return <Tag color={CTYPE.tagColor.wraning}>待审核</Tag>
        } else if (status == 2) {
            return <Tag color={CTYPE.tagColor.error}>审核未通过</Tag>
        } else if (status == 3) {
            return <Tag color={CTYPE.tagColor.success}>续费成功</Tag>
        }
    }

}

export default MerhantUtils;
