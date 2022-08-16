import React from 'react';
import '../../assets/css/user/user-edit.less'
import { App, CTYPE, Utils, U } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Link } from 'react-router-dom';
import { PosterEdit } from "../common/PosterEdit";
import { Button, Card, message, Form, Input } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

export default class UserEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            user: {},
        }
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser = () => {
        let { id } = this.state;
        if (id > 0) {
            App.api('adm/user/user', { id }).then(user => {
                this.setState({ user });
            });
        }
    }

    modUser = (field, val) => {
        let { user = {} } = this.state;
        user[field] = val;
        this.setState({ user });
    }

    saveUser = () => {
        let { user = {} } = this.state;
        let { nick, mobile, avatar } = user;

        if (U.str.isEmpty(nick)) {
            message.warn('请填写用户昵称');
            return;
        }
        if (U.str.isEmpty(mobile)) {
            message.warn('请填写用户手机号');
            return;
        }
        if (U.str.isEmpty(avatar)) {
            message.warn('请上传用户头像');
            return;
        }
        App.api('adm/user/save_user', {
            user: JSON.stringify(user)
        }).then(() => {
            message.success("用户创建成功");
            App.go('/app/user/users');
        });
    }

    render() {
        let { id, user = {} } = this.state;
        let { avatar, mobile, nick } = user;
        return <div className="user-edit">
            <BreadcrumbCustom first={<Link to={`/app/user/users`}>{CTYPE.link.user_users.txt}</Link>} second={id == 0 ? '新建用户' : '编辑用户'} />
            <Card
                extra={<Button
                    type="primary" icon={<UserAddOutlined />}
                    onClick={this.saveUser}>
                    保存
                </Button>}>

                <PosterEdit title='头像' required={true} type='s' img={avatar} syncPoster={(url) => {
                    this.modUser('avatar', url);
                }} />

                <Form.Item
                    {...CTYPE.userFormItemLayout}
                    label="手机号" required={true}>
                    <Input placeholder="请填入用户手机号" value={mobile} onChange={(e) => this.modUser("mobile", e.target.value)} />
                </Form.Item>

                <Form.Item
                    {...CTYPE.userFormItemLayout}
                    label="昵称" required={true}>
                    <Input placeholder="请填入用户昵称" value={nick} onChange={(e) => this.modUser("nick", e.target.value)} />
                </Form.Item>

            </Card>
        </div>
    }
}