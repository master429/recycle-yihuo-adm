import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import { Form, Input, message, Modal, notification } from 'antd';
import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'


const FormItem = Form.Item;
const id_div = 'div-dialog-mod-pwd';

export default class ModAdminPwd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            flag: true,
            password: '',
            newPassword: '',
            repeatPassword: '',
        };
    }

    updatePassword = () => {
        let { password, repeatPassword, oldPassword } = this.state;
        if (password !== repeatPassword) {
            message.warn("请检查输入的新密码是否一致");
            return;
        }
        this.setState({ loading: true });
        App.api('adm/admin/update_password', {
            password: password,
            repeatPassword: repeatPassword,
            oldPassword: oldPassword
        }).then(res => {
            this.setState({ loading: false });
            this.close();
            notification.success({ message: "修改密码", description: "操作成功,请重新登录" });
            App.logout();
            App.go("/login");
        }, () => this.setState({ loading: false }))
    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let { flag, password, repeatPassword } = this.state;

        return <Modal title={'修改密码'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'600px'}
            confirmLoading={this.state.loading}
            onOk={this.updatePassword}
            onCancel={this.close}>
            <Form
                name="modPassword"
                scrollToFirstError
                onValuesChange={(a, allVal) => {
                    let { password, oldPassword, repeatPassword } = allVal;
                    this.setState({
                        password,
                        oldPassword,
                        repeatPassword,
                    });
                }}
            >
                <Form.Item
                    {...CTYPE.midFormItemLayout}
                    name="oldPassword"
                    rules={[{
                        type: 'string',
                        required: true,
                        message: '请输入当前密码',
                        whitespace: true,
                    }]}
                    label={(
                        <span>当前密码</span>
                    )}
                    hasFeedback>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    {...CTYPE.midFormItemLayout}
                    name="password"
                    label="新密码"
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
                <Form.Item
                    {...CTYPE.midFormItemLayout}
                    name="repeatPassword"
                    label="确认新密码"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('两次输入密码不一致'));
                            },
                        }),

                    ]}
                    hasFeedback
                >

                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal >
    }
}

