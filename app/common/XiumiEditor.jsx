import React from 'react'
import {Utils} from './index'
import {Modal} from 'antd';

const id_div = 'div-dialog-xiumi';

export default class XiumiEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        let xiumi = document.getElementById('xiumi');

        if (xiumi) {

            let xiumi_url = "http://xiumi.us";
            xiumi.onload = () => {
                console.log("postMessage");
                xiumi.contentWindow.postMessage('ready', xiumi_url);
            };
            window.addEventListener('message', (event) => {
                if (event.origin === xiumi_url) {
                    this.close();
                    this.props.syncContentWrap(event.data);
                    // editor.execCommand('insertHtml', event.data);
                    // editor.fireEvent("catchRemoteImage");
                    // dialog.close();
                }
            }, false);
        } else {
            setTimeout(() => this.load(), 1000);
        }
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        return <Modal title="秀米编辑器"
                      className='xiumi-dialog'
                      width={width}
                      height={height}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      style={{top: 0}}
                      visible={true}
                      footer={null}
                      onCancel={this.close}>

            <iframe id="xiumi" src="http://xiumi.us/studio/v5#/paper"
                    style={{width: '100%', height: height - 50 + 'px', border: 'none'}}></iframe>


        </Modal>
    }
}
