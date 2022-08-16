import React from 'react';
import { App, CTYPE, U, Utils } from '../../common'
import { Modal } from 'antd';

const id_div = 'div-modal-renew-upload-proof';

export default class RenewUploadProof extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchant: this.props.merchant,
            renew: {}
        }
    }

    componentDidMount() {

    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    render() {
        return <Modal
            width='700px'
            visible={true}
            title="续期上传凭证"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}>

        </Modal>
    }
}