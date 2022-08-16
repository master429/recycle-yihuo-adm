import React from 'react';
import {Input, message, Modal} from 'antd';
import jrQrcode from 'jr-qrcode';
import Utils from "../../common/Utils";
import copy from 'copy-to-clipboard';

const id_div = 'div-dialog-qrcode';

export default class DialogQRCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: this.props.avatar,
            url: this.props.url,
            title: this.props.title,
            copyStr: this.props.copyStr,
            qrCode: jrQrcode.getQrBase64(this.props.url, {
                padding: 10,   // 二维码四边空白（默认为10px）
                width: 300,  // 二维码图片宽度（默认为256px）
                height: 300,  // 二维码图片高度（默认为256px）
                correctLevel: jrQrcode.QRErrorCorrectLevel.M,    // 二维码容错level（默认为高）
                reverse: false,        // 反色二维码，二维码颜色为上层容器的背景颜色
                background: "#ffffff",    // 二维码背景颜色（默认白色）
                foreground: "#000000"     // 二维码颜色（默认黑色）
            })
        };
    }

    render() {

        let {qrCode, avatar, title, copyStr, url} = this.state;
        console.log(copyStr);
        console.log(url);
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            title={"手机扫码"}
            width='330px'
            onCancel={() => Utils.common.closeModalContainer(id_div)}
            footer={null}>
            <div className='dialog-qrcode'>
                {qrCode && <img id='dialog-qrcode-top' className='qrcode' src={qrCode}/>}
                {avatar && <div className='img'>
                    <img src={avatar} alt=""/></div>}
            </div>
            <div className="qrcode-wrap"><Input className="qrcode-input" disabled={true} value={copyStr}/>
                <div className="qrcode-copy" onClick={() => {
                    copy(copyStr);
                    message.success('已复制到剪切面板')
                }}>复制
                </div>
            </div>


        </Modal>

    }
}
