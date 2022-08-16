import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form, Input, message, Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import { CTYPE, OSSWrap, U } from "../../common";
import { inject, observer } from 'mobx-react'
import AdminProfile from "./AdminProfile";
import { SaveOutlined, FileAddOutlined } from '@ant-design/icons';


const Option = Select.Option;
const FormItem = Form.Item;

@inject('admin')
@observer
class AdminEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            admin: {},

            roles: [],
            loading: false
        }
    }

    componentDidMount() {
        App.api('adm/admin/roles').then((roles) => {
            if (roles.length === 0) {
                message.warn('请先设置管理组');
            } else {
                this.setState({ roles });
                let { id } = this.state;
                if (id !== 0) {
                    App.api('adm/admin/admin', { id }).then((admin) => {
                        this.setState({ admin });
                    })
                }
            }
        });
    }

    handleSubmit = () => {

        let { admin = {}, id } = this.state;

        let { mobile, name, roleId, password } = admin;
        if (!U.str.MobileLength(mobile)) {
            return message.warning("请填写正确的手机号")
        }
        if (!U.str.isChinaMobile(mobile)) {
            message.warn('请填写正确的手机号');
            return;
        }
        if (U.str.isEmpty(name)) {
            message.warn('请输入名称');
            return
        }
        if (id === 0 && U.str.isEmpty(password)) {
            message.warn("长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头");
            return;
        }
        if (roleId === 0) {
            message.warn('请选择管理组');
            return;
        }
        this.setState({ loading: true });
        App.api('adm/admin/save_admin', { 'admin': JSON.stringify(admin) }).then((res) => {
            AdminProfile.clear();
            this.setState({ loading: false });
            window.history.back();
            message.success("保存成功");
        }, () => this.setState({ loading: false }));
    };

    handleNewImage = e => {

        let { uploading = false, admin } = this.state;


        let img = e.target.files[0];

        if (!e.target.files[0] || !(e.target.files[0].type.indexOf('jpg') > 0 || e.target.files[0].type.indexOf('png') > 0 || e.target.files[0].type.indexOf('jpeg') > 0)) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }
        if (uploading) {
            message.loading('上传中');
            return;
        }
        this.setState({ uploading: true });
        OSSWrap.upload(img).then((result) => {
            this.setState({
                admin: {
                    ...admin,
                    img: result.url,
                },
                uploading: false
            });

        }).catch((err) => {
            message.error(err);
        });
    };

    render() {

        let { admin = {}, roles = [], id } = this.state;
        let { mobile, name, password, roleId = 0, img } = admin;

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link>}
                    second='编辑管理员' />}
                extra={<Button type="primary" icon={<SaveOutlined />} loading={this.state.loading}
                    onClick={() => {
                        this.handleSubmit()
                    }}
                    htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>


                <FormItem
                    {...CTYPE.formItemLayout}
                    label="手机号">
                    <Input value={mobile} maxLength={11} placeholder="请输入手机号" disabled={id !== 0}
                        style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                admin: {
                                    ...admin,
                                    mobile: e.target.value
                                }
                            })
                        }} />
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="名称">
                    <Input value={name} placeholder="请输入名称,最多十个字" maxLength={10} style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                admin: {
                                    ...admin,
                                    name: e.target.value
                                }
                            })
                        }} />
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="密码">
                    <Input value={password} placeholder="请输入密码" style={{ width: '300px' }} onChange={(e) => {
                        this.setState({
                            admin: {
                                ...admin,
                                password: e.target.value
                            }
                        })
                    }} />
                </FormItem>


                <FormItem
                    {...CTYPE.formItemLayout}
                    label="管理组">
                    <Select
                        style={{ width: '300px' }}
                        value={roleId.toString()}
                        onChange={(roleId) => {
                            this.setState({
                                admin: {
                                    ...admin,
                                    roleId: parseInt(roleId)
                                }
                            })
                        }}>
                        <Option value='0'>请选择</Option>
                        {roles.map((g, i) => {
                            return <Option key={i} value={g.id.toString()}>{g.name}</Option>
                        })}
                    </Select>
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="上传头像">
                    <div className="common-edit-page">
                        <div className='upload-img-preview' style={{ width: '100px', height: '100px' }}>
                            {img && <img src={img} style={{ width: '100px', height: '100px' }} />}
                        </div>
                        <div className='upload-img-tip' style={{ marginTop: '15px' }}>
                            <Button type="primary" icon={<FileAddOutlined />}>
                                <input className="file" type='file' onChange={this.handleNewImage} />
                                选择图片</Button>
                        </div>
                    </div>
                </FormItem>
            </Card>
        </div >
    }

}

export default AdminEdit;
