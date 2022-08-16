import React from 'react';
import '../../assets/css/setting/uis-page.less';
import {App, CTYPE, U} from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Card, Button, Tabs, Table, Dropdown, Menu, Modal, message, Tag} from 'antd';
import {FileAddOutlined, DownOutlined} from '@ant-design/icons';
import SettingUtils from './SettingUtils';


export default class Uis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: parseInt(this.props.match.params.type),
            list: [],
            loading: false,

            productCategories: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type
        });
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {type} = this.state;
        this.setState({loading: true});
        App.api('adm/ui/uis', {
            uiQo: JSON.stringify({
                type
            })
        }).then((list) => {
            this.setState({
                list,
                loading: false
            });
        });
    };

    edit = ui => {
        App.go(`/app/setting/ui-edit/${ui.type}/${ui.id}`);
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/ui/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    }, () => {
                        this.loadData();
                    });
                });
            },
            onCancel() {
            },
        });
    };

    setDefault = (id, type) => {
        Modal.confirm({
            title: `确认操作?`,
            onOk: () => {
                App.api('adm/ui/set_default', {id, type}).then(() => {
                    message.success(`设置成功`);
                    this.loadData();
                });
            },
            onCancel() {
            },
        });
    };

    render() {

        let {type = 1, list = [], loading} = this.state;

        return <div className="uis-page">
            <BreadcrumbCustom first={CTYPE.link.setting_uis.txt}/>
            <Card
                extra={<Button type="primary" onClick={() => this.edit({id: 0, type})}><FileAddOutlined/>新建模版</Button>}>
                <Tabs onChange={(v) => {
                    this.setState({
                        type: parseInt(v),
                        list: []
                    }, () => {
                        this.loadData();
                    });
                }} defaultActiveKey={type.toString()}>
                    {SettingUtils.UITypes.map((t, i) => {
                        let {type, label, disabled} = t;
                        return <Tabs.TabPane disabled={disabled} tab={label} key={type}/>;
                    })}
                </Tabs>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '名称',
                        dataIndex: 'title',
                        className: 'txt-center'
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'isDefault',
                        className: 'txt-center',
                        render: (isDefault) => {
                            if (isDefault === 1) {
                                return <Tag color="#2db7f5">启用</Tag>;
                            } else {
                                return <Tag color='red'>停用</Tag>;
                            }
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, ui, index) => {
                            let {id, isDefault} = ui;
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(ui)}>编辑</a>
                                </Menu.Item>
                                {isDefault !== 1 &&
                                <Menu.Item key="2">
                                    <a onClick={() => this.setDefault(id, type)}>启用</a>
                                </Menu.Item>}
                                {isDefault !== 1 && <Menu.Item key="3">
                                    <a onClick={() => this.setDefault(id, type)}>设为默认</a>
                                </Menu.Item>}
                                {isDefault !== 1 && <Menu.Item key="4">
                                    <a onClick={() => this.remove(id, index)}>删除</a>
                                </Menu.Item>}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <DownOutlined/>
                                </a>
                            </Dropdown>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    loading={loading}/>

            </Card>
        </div>
    }
}