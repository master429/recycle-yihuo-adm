import React from 'react';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Card, Button, Tabs, Table, Dropdown, Menu, Modal, message, Tag } from 'antd';
import { FileAddOutlined, DownOutlined } from '@ant-design/icons';


export default class Articles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0
            },
            sortPropertyName: 'id',
            sortAscending: false,
            adminId: 0
        };
    }

    componentDidMount() {
        this.loadData();
    }

    handleTableChange = (pagination, filters, sorter) => {
        let { field, order } = sorter;
        this.setState({
            pagination,
            sortPropertyName: order ? field : 'id',
            sortAscending: order === 'ascend'
        }, () => this.loadData());
    };

    loadData = () => {
        let { pagination = {}, sortPropertyName, sortAscending, title, adminId, lastModified = {} } = this.state;
        this.setState({ loading: true });
        App.api('/adm/article/articles', {
            articleQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                sortPropertyName,
                sortAscending,
                title, adminId, lastModified
            })
        }).then(result => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    reloadData = () => {
        let { pagination } = this.state;
        this.setState({
            pagination: {
                ...pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        });
    };


    updateStatus = (id, status, index) => {
        let opt = status === 2 ? '??????' : '??????';
        let _status = status === 1 ? 2 : 1;
        Modal.confirm({
            title: `??????${opt}???????`,
            onOk: () => {
                App.api('/adm/article/update_status', { id, status: _status }).then(() => {
                    let { list = [] } = this.state;
                    list[index].status = _status;
                    this.setState({ list });
                    message.success(`${opt}??????`);
                });
            },
            onCancel() {
            }
        });
    };

    edit = (id) => {
        App.go(`/app/content/article-edit/${id}`);
    };

    render() {

        let { list = [], loading, pagination = {} } = this.state;
        let imgs = [];
        list.map((item) => {
            imgs.push(item.cover);
        });

        let { ARTICLE_EDIT } = Utils.adminPermissions;

        return <div className="articles-page">
            <BreadcrumbCustom first={CTYPE.link.content_articles.txt} />
            <Card extra={ARTICLE_EDIT && <Button type="primary" onClick={() => this.edit(0)}><FileAddOutlined />????????????</Button>}>
                <Table columns={[{
                    title: '??????',
                    dataIndex: 'index',
                    align: 'center',
                    render: (text, item, index) => Utils.pager.getRealIndex(pagination, index)
                }, {
                    title: '??????',
                    dataIndex: 'cover',
                    align: 'center',
                    render: (cover, item, index) => {
                        return <img key={cover} className='article-img' src={cover} onClick={() => {
                            Utils.common.showImgLightbox(imgs, index);
                        }} />;
                    }
                }, {
                    title: '??????',
                    dataIndex: 'title',
                    width: 250,
                    render: (title) => {
                        return <div className="article-title">{title}</div>;
                    }
                }, {
                    title: '??????',
                    dataIndex: 'admin',
                    align: 'center',
                    render: (admin = {}) => {
                        return admin.name;
                    }
                }, {
                    title: '?????????',
                    dataIndex: 'pv',
                    align: 'center',
                    width: 100,
                    sorter: true
                }, {
                    title: '?????????',
                    dataIndex: 'collectNum',
                    align: 'center',
                    width: 100,
                    sorter: true
                }, {
                    title: '????????????',
                    dataIndex: 'createdAt',
                    align: 'center',
                    render: (createdAt) => {
                        return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                    }
                }, {
                    title: '????????????',
                    dataIndex: 'lastModified',
                    align: 'center',
                    sorter: true,
                    render: (lastModified) => {
                        return U.date.format(new Date(lastModified), 'yyyy-MM-dd HH:mm');
                    }
                }, {
                    title: '??????',
                    dataIndex: 'status',
                    className: 'txt-center',
                    align: 'center',
                    width: 60,
                    render: (obj, c) => {
                        return <div className="state">
                            {c.status === 1 ? <span>??????</span> :
                                <span style={{ color: 'red' }}>??????</span>}
                        </div>;
                    }
                }, {
                    title: '??????',
                    dataIndex: 'opt',
                    align: 'center',
                    width: 100,
                    render: (obj, article, index) => {
                        let { id, title, img, status } = article;
                        return <Dropdown overlay={ARTICLE_EDIT ? <Menu>

                            <Menu.Item key="1">
                                <a onClick={() => this.updateStatus(id, status, index)}>{status === 1 ? '??????' : '??????'}</a>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="4">
                                <a onClick={() => this.edit(id)}>??????</a>
                            </Menu.Item>
                        </Menu> : <Menu />} trigger={['click']}>
                            <a className="ant-dropdown-link">?????? <DownOutlined />
                            </a>
                        </Dropdown>;
                    }
                }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />

            </Card>
        </div>
    }
}