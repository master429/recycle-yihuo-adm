import React from 'react';

import '../../assets/css/setting/setting-comps.less';
import { App, CTYPE, U, Utils } from "../../common";
import { Modal, Form, message, Spin, Select, Input, Row, Col, Table, Tag } from 'antd';
import SettingUtils from './SettingUtils';
import MerchantUtils from '../merchant/MerchantUtils'

const id_div_banner = 'div-dialog-mod-banner';
class BannerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: SettingUtils.acts,
            banner: this.props.banner,
            list: [],
        }
    }

    close = () => {
        Utils.common.closeModalContainer(id_div_banner)
    };

    syncImg = (url) => {
        this.setState({ spinning: true });
        let { banner = {} } = this.state;
        this.setState({
            banner: {
                ...banner,
                img: url
            },
            spinning: false
        });
    };

    pick = (act, item) => {
        let isMerchant = act === 'MERCHANT';

        if (isMerchant) {
            SettingUtils.merchantPicker([item], this.syncPayload, false);
        }
    };

    syncPayload = (items) => {
        let banner = this.state.banner;
        this.setState({
            banner: {
                ...banner,
                payload: items[0]
            }
        });
    };



    doSave = () => {
        let { banner = {} } = this.state;
        let { img, act, payload = {} } = banner;

        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }

        if (act === 'LINK' && U.str.isEmpty(payload.url)) {
            message.warn('请填写跳转地址');
            return;
        }

        if (act !== 'NONE' && act !== 'LINK' && !payload.id) {
            message.warn('请选择关联明细');
            return;
        }

        this.props.syncBanner(banner);
        this.close();
    }



    render() {
        let { banner = {}, list = [], spinning = false, actions = [] } = this.state;
        let { act = 'NONE', payload = { id: 0, title: '', url: '' }, img, type } = banner;

        let showLink = act === 'LINK';
        let showPicker = act !== 'NONE' && act !== 'LINK';

        let isAd = type == 'AD';
        let isBanner = type == 'BANNER';

        console.log(banner);

        let txt = '轮播图';
        let ratio = isBanner ? CTYPE.imgeditorscale.rectangle_h : CTYPE.imgeditorscale.rectangle_ad;
        console.log(isBanner);
        if (isAd) {
            txt = '广告位'
        }

        return <Modal
            width='1000px'
            title={<span>{`编辑${txt}`}</span>}
            getContainer={() => Utils.common.createModalContainer(id_div_banner)}
            visible={true}
            onCancel={this.close}
            onOk={this.doSave}>
            {(isAd || isBanner) && <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>图片</span>}
                required={true}>

                <Spin spinning={spinning}>
                    <div className='upload-img-h' style={{ width: '345px', height: `${isAd ? '87px' : '180px'}` }}
                        onClick={() => Utils.common.showImgEditor(ratio, img, this.syncImg)}>
                        {img && <img src={img} className="img" />}
                    </div>
                </Spin>
                <span className="txt">
                    建议上传图片尺寸{isAd ? '345 * 87' : '345 * 180'}，.jpg、.png格式，文件小于1M
                </span>
            </Form.Item>}
            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>跳转类型</span>}
                required={true}>

                <Select
                    showSearch
                    optionFilterProp="children"
                    value={act}
                    onChange={(act) => {
                        this.setState({
                            banner: {
                                ...banner,
                                act,
                            }
                        })
                    }}>
                    {actions.map((act) => {
                        return <Select.Option key={act.key}><span
                            className={act.disabled ? 'font-red' : ''}>{act.name}</span></Select.Option>
                    })}
                </Select>

            </Form.Item>

            {showLink && <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>链接</span>}
                required={true}>
                <Input.TextArea placeholder="请填入跳转链接" className="textarea" />
            </Form.Item>}

            {showPicker && <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>关联明细</span>}
                required={true}>
                {!payload.id && <a onClick={() => {
                    this.pick(act, {});
                }}>选择</a>}
                {payload.id > 0 && <span>{payload.title}&nbsp;&nbsp;<a onClick={() => {
                    this.pick(act, payload);
                }}>修改</a></span>}

            </Form.Item>}
        </Modal >
    }
}

const id_div_recycle_category_edit = 'div-dialog-recycle-category-edit';
class RecycleCategoryEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recyCate: this.props.recyCate,
            spinning: false,
            categories: [],
        }
    }

    componentDidMount() {
        this.loadCategories();
    }
    loadCategories = () => {
        App.api('adm/category/categories_first').then((categories => {
            this.setState({ categories });
        }));
    }

    syncImg = (url) => {
        this.setState({ spinning: true });
        let { recyCate = {} } = this.state;
        console.log(recyCate);
        this.setState({
            recyCate: {
                ...recyCate,
                img: url
            },
            spinning: false
        });
    };

    doSave = () => {
        let { recyCate = {} } = this.state;
        let { img, category = {} } = recyCate;

        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }
        if (!category) {
            message.warn('请选择一级分类');
            return;
        }

        this.props.syncItem(recyCate);
        this.close();
    }

    close = () => {
        Utils.common.closeModalContainer(id_div_recycle_category_edit)
    };

    render() {
        let { recyCate = {}, spinning, categories = [] } = this.state;
        console.log(recyCate);
        let { img, category = {}, index, cindex, type } = recyCate;
        console.log(cindex, type)
        let ratio = !index || index < 0 ? CTYPE.imgeditorscale.square : CTYPE.imgeditorscale.rectangle_r;

        return <Modal
            width='1000px'
            title={<span>{`编辑回收分类`}</span>}
            getContainer={() => Utils.common.createModalContainer(id_div_recycle_category_edit)}
            visible={true}
            onCancel={this.close}
            onOk={this.doSave}>
            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>图片</span>}
                required={true}>

                <Spin spinning={spinning}>
                    <div className='upload-img-h' style={{ width: '165px', height: `${!index || index < 0 ? '165px' : '82px'}` }}
                        onClick={() => Utils.common.showImgEditor(ratio, img, this.syncImg)}>
                        {img && <img src={img} className="img" />}
                    </div>
                </Spin>
                <span className="txt">
                    建议上传图片尺寸{!index || index < 0 ? '165 * 165' : '165 * 82'}，.jpg、.png格式，文件小于1M
                </span>
            </Form.Item>
            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>关联一级分类</span>}
                required={true}>

                <Select
                    value={category.name}
                    placeholder="请选择一级分类"
                    onChange={(val) => {
                        this.setState({
                            recyCate: {
                                ...recyCate,
                                category: categories.find(it => it.id == val),
                            }
                        })
                    }}
                >
                    {categories.map((recy, recyIndex) => {
                        return <Select.Option key={recy.id}>{recy.name}</Select.Option>
                    })}
                </Select>

            </Form.Item>

        </Modal >
    }
}

const id_div_merchant = 'div-dialog-merchant-picker';
class MerchantPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            items: this.props.items,
            multi: this.props.multi,

            list: [],

            pagination: { pageSize: CTYPE.pagination.pageSize, current: 1, total: 0 },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { pagination = {}, name } = this.state;
        this.setState({ loading: true });
        App.api('adm/merchant/search', {
            merchantQo: JSON.stringify({
                name,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_merchant);
    };

    render() {

        let { items = [], multi = false, list = [], pagination, loading } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_merchant)}
            visible={true}
            title={'请选择商家'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={12}>
                        <Input.Search
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询" />
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => Utils.pager.getRealIndex(pagination, i)
                    }, {
                        title: 'LOGO',
                        dataIndex: 'logo',
                        className: 'txt-center ',
                        render: (logo, item, index) => {
                            return <img key={index} className='square-logo' src={logo + '@!120-120'} />
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        render: (name, merchant, index) => {
                            return <a
                                onClick={() => MerchantUtils.genDetailModal(merchant, this.syncMerchant)}>{name}</a>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return '正常';
                                case 2:
                                    return '禁用';
                                case 3:
                                    return '逾期';
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, merchant, index) => {
                            let has = items.find(item => item.id === merchant.id) || {};
                            merchant.title = merchant.name;
                            return <span>
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(merchant);
                                    } else {
                                        this.singleClick(merchant);
                                    }
                                }}>选择</a>}
                            </span>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>
    }

}



const id_div_article = 'div-dialog-article-picker';

class ArticlePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            list: [],
            pagination: { pageSize: CTYPE.pagination.pageSize, current: 1, total: 0 },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { pagination = {}, title } = this.state;
        this.setState({ loading: true });
        App.api('/adm/article/articles', {
            articleQo: JSON.stringify({
                title,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_article);
    };

    singleClick = (item) => {
        let { items = [] } = this.state;
        delete item.content;
        delete item.admin;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {

        let { items = [], list = [], pagination, loading } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_article)}
            visible={true}
            title={'请选择文章'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={12}>
                        <Input.Search
                            onChange={(e) => {
                                this.setState({
                                    title: e.target.value,
                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询" />
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, item, index) => index + 1
                    }, {
                        title: '图片',
                        dataIndex: 'cover',
                        align: 'center',
                        render: (cover) => {
                            return <img key={cover} className='square-logo' src={cover + '@!120-120'} />
                        }
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        width: 350,
                        render: (title) => {
                            return <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{title}</div>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return <Tag color="#2db7f5">启用</Tag>;
                                case 2:
                                    return <Tag color="red">停用</Tag>;
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, article, index) => {
                            let has = items.find(item => item.id === article.id) || {};
                            return <span>
                                {!has.id && <a onClick={() => {
                                    this.singleClick(article)
                                }}>选择</a>}
                            </span>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>
    }
}



const id_div_flow = 'div-dialog-flow-edit';

class FlowEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flow: this.props.flow
        }
    }

    syncImg = (url) => {
        let flow = this.state.flow;
        this.setState({
            flow: {
                ...flow,
                icon: url
            }
        });
    };

    doSave = () => {

        let flow = this.state.flow;
        let { icon, txt } = flow;
        if (U.str.isEmpty(icon)) {
            message.warn('请上传图标');
            return;
        }

        if (U.str.isEmpty(txt)) {
            message.warn('标题');
            return;
        }

        this.props.syncBanner(flow);
        this.close();

    };

    close = () => {
        Utils.common.closeModalContainer(id_div_flow);
    };

    render() {
        let { flow = {} } = this.state;
        let { icon, txt } = flow;

        let ratio = CTYPE.imgeditorscale.square;
        const style = { width: '100px', height: '100px' };
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_flow)}
            visible={true}
            title={`编辑回收流程`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>
            <div className='common-edit-page'>
                <div className='form'>

                    <div className="line">
                        <div className="p required">图标</div>

                        <div className='upload-img-preview' style={style}
                            onClick={() => Utils.common.showImgEditor(ratio, icon, this.syncImg)}>
                            {icon && <img src={icon} className="img" />}
                        </div>
                    </div>

                    <div className="line">
                        <div className='p required'>名称</div>
                        <Input style={{ width: '200px' }} maxLength={10} value={txt}
                            placeholder='请输入名称'
                            onChange={(e) => this.setState({
                                flow: {
                                    ...flow,
                                    txt: e.target.value
                                }
                            })} />
                    </div>
                </div>
            </div>
        </Modal >

    }
}

const id_div_guarantee = 'div-dialog-guarantee-edit';

class GuaranteeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guarantee: this.props.guarantee
        }
    }

    syncImg = (url) => {
        let guarantee = this.state.guarantee;
        this.setState({
            guarantee: {
                ...guarantee,
                icon: url
            }
        });
    };

    doSave = () => {

        let guarantee = this.state.guarantee;
        let { icon, title, desc } = guarantee;
        if (U.str.isEmpty(icon)) {
            message.warn('请上传图标');
            return;
        }

        if (U.str.isEmpty(title)) {
            message.warn('请填写标题');
            return;
        }

        this.props.syncBanner(guarantee);
        this.close();

    };

    close = () => {
        Utils.common.closeModalContainer(id_div_guarantee);
    };

    render() {
        let { guarantee = {} } = this.state;
        let { icon, title, desc } = guarantee;

        let ratio = CTYPE.imgeditorscale.square;
        const style = { width: '100px', height: '100px' };
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_guarantee)}
            visible={true}
            title={`编辑保障`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>
            <div className='common-edit-page'>
                <div className='form'>

                    <div className="line">
                        <div className="p required">图标</div>

                        <div className='upload-img-preview' style={style}
                            onClick={() => Utils.common.showImgEditor(ratio, icon, this.syncImg)}>
                            {icon && <img src={icon} className="img" />}
                        </div>
                    </div>

                    <div className="line">
                        <div className='p required'>标题</div>
                        <Input style={{ width: '200px' }} maxLength={10} value={title}
                            placeholder='请输入标题'
                            onChange={(e) => this.setState({
                                guarantee: {
                                    ...guarantee,
                                    title: e.target.value
                                }
                            })} />
                    </div>
                    <div className="line">
                        <div className='p required'>描述</div>
                        <Input style={{ width: '200px' }} maxLength={20} value={desc}
                            placeholder='请输入描述'
                            onChange={(e) => this.setState({
                                guarantee: {
                                    ...guarantee,
                                    desc: e.target.value
                                }
                            })} />
                    </div>
                </div>
            </div>
        </Modal >

    }
}





export {
    BannerEdit, MerchantPicker, ArticlePicker, FlowEdit, GuaranteeEdit, RecycleCategoryEdit
};