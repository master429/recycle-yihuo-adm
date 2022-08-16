import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import { Form, Input, message, Modal } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'

const id_div = 'div-dialog-mod-mch-pwd';

export default class ModMerchantAdminPwd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            flag: true,
            password: '',
            id: this.props.id,
        };
    }

    updatePassword = () => {
        let { password, id } = this.state;
        this.setState({ loading: true });
        App.api('adm/merchant/update_password', {
            id,
            password: password,
        }).then(() => {
            this.setState({ loading: false });
            message.success("密码重置成功");
            this.close();
        })
    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        return <Modal title={'重置密码'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            confirmLoading={this.state.loading}
            onOk={this.updatePassword}
            onCancel={this.close}>
            <Form
                name="modPassword"
                scrollToFirstError
                onValuesChange={(a, allVal) => {
                    let { password } = allVal;
                    this.setState({
                        password,
                    });
                }}
            >
                <Form.Item
                    {...CTYPE.longFormItemLayout}
                    name="password"
                    label="请输入新密码"
                    rules={[
                        {
                            required: true,
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            whitespace: true,
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

            </Form>
        </Modal >
    }
}

