import React from 'react';
import '../../assets/css/merchant/merchant-renew.less';
import { App, CTYPE, U, OSSWrap, Utils } from '../../common';
import { Modal, message, Row, Col, Select, Input, Form, Upload, Button, Spin } from 'antd';
import { CommonPeriodSelector } from '../common/CommonComponents'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const id_div = 'div-modal-merchant-renew';

export default class MerchantRenew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchant: this.props.merchant,
            duration: '6M',
            author: {},
            renew: {},
            proof: [],
            remark: '',
            amount: 0,
            uploading: false,
        };
    }

    componentDidMount() {
        this.getAuth();
    }

    getAuth() {
        this.setState({
            author: App.getAdmProfile(),
        });
    }

    submit = () => {
        let { merchant = {}, duration, author = {}, proof = [], remark, amount } = this.state;
        let { id } = merchant;
        if (U.str.isEmpty(remark) || remark.length < 4) {
            message.warn('备注最少四个字');
            return;
        }
        if (proof.length < 1) {
            message.warn('凭证至少需要一个');
            return;
        }
        App.api('adm/merchant/renew', {
            renew: JSON.stringify({
                merchantId: id,
                reneworId: author.id,
                duration,
                proof,
                remark,
                amount,
            }),
        }).then(() => {
            message.success('续期申请已发出，等待审核中');
            this.close();
        });
    };


    close = () => {
        Utils.common.closeModalContainer(id_div);
        this.props.cb();
    }

    handleNewImage = e => {

        let { uploading = false, proof, remark, spinning } = this.state;

        let img = e.target.files[0];

        if (!e.target.files[0] || !(e.target.files[0].type.indexOf('jpg') > 0 || e.target.files[0].type.indexOf('png') > 0 || e.target.files[0].type.indexOf('jpeg') > 0)) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false,
            });
            return;
        }
        if (uploading) {
            message.loading('上传中');
            return;
        }
        this.setState({ uploading: true });
        OSSWrap.upload(img).then((result) => {
            proof.push(result.url);
            this.setState({
                proof,
                uploading: false,
            });

        }).catch((err) => {
            message.error(err);
        });
    };

    render() {
        let { duration, merchant = {}, admin = {}, proof = [], uploading } = this.state;
        let imgs = [];
        proof.map((item) => {
            imgs.push(item);
        });
        return <Modal
            width='676px'
            visible={true}
            title="商户续期"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}
            onOk={this.submit}
        >
            <Form>
                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={<span>续费周期</span>}
                    required={true}
                >
                    <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                        syncPeriod={(val) => {
                            this.setState({
                                duration: val
                            })
                        }} />
                </Form.Item>
                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={<span>费用金额</span>}
                    required={true}
                >
                    <Input className="money" placeholder="请填写金额" onChange={(e) => {
                        this.setState({ amount: e.target.value })
                    }} addonBefore={<span>¥</span>} style={{ width: "150px" }} />
                </Form.Item>

                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label="支付凭证"
                    required={true}
                >
                    <div className="upload-wrapper">
                        <Spin spinning={uploading}>
                            {proof.map((img, index) => {
                                return <div key={index} className="upload-img" loading={uploading.toString()}>
                                    <div className="cover">
                                        <EyeOutlined onClick={() => {
                                            Utils.common.showImgLightbox(imgs, index);
                                        }} />
                                        <DeleteOutlined onClick={() => {
                                            proof.splice(proof.findIndex((it, i, arr) => i == index), 1);
                                            this.setState({
                                                proof
                                            })
                                        }} />
                                    </div>
                                    {img && <img key={index} src={img} style={{ width: '100px', height: '100px', cursor: 'pointer' }} />}
                                </div>
                            })}
                            <div className='upload-img-tip'>
                                <Button type="primary" >
                                    <input className="file" type='file' onChange={this.handleNewImage} />
                                </Button>
                            </div>
                        </Spin>
                    </div>
                </Form.Item>
                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={<span>备注</span>}
                    required={true}
                >
                    <Input.TextArea placeholder="请填写备注" onChange={(e) => {
                        this.setState({ remark: e.target.value })
                    }} style={{ height: '80px' }} />
                </Form.Item>
            </Form>

        </Modal>
    }
}