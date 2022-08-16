import React from 'react';
import { App, CTYPE, U, Utils } from '../../common';
import { Drawer, Button, Form, Input, InputNumber, Tabs, Row, Col, Radio, message } from 'antd';
import '../../assets/css/category/categories-page.less';
import Proptypes from 'prop-types';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import classnames from 'classnames';

const id_div = 'div-modal-category-quotation';

export default class CategoryQuotationEdit extends React.Component {

    static propTypes = {
        category: Proptypes.object.isRequired,
        loadData: Proptypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            category: JSON.parse(JSON.stringify(this.props.category)),
        }
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    save = () => {
        let { category = {} } = this.state;
        App.api('adm/category/save_category', {
            category: JSON.stringify({
                ...category
            })
        }).then(() => {
            message.success("估价完成");
            this.props.loadData();
            this.close();
        });
    }

    modCategoryQuotation = (filed, val) => {
        let { category = {} } = this.state;
        let { quotation = {} } = category;
        quotation[filed] = val;
        this.setState({
            category: {
                ...category,
                quotation
            }
        });
    }
    modQuotationItem = (items = [], field, val, index) => {
        let { category = {} } = this.state;
        let { quotation = {} } = category;
        items[index][field] = val;
        quotation.quotationItem = items;
        this.setState({
            category: {
                ...category,
                quotation,
            }
        });
    }

    modQuotationPriceItems = (quotationItem = [], items = [], field, val, index, i) => {
        let { category = {} } = this.state;
        let { quotation = {} } = category;
        items[i][field] = val;
        quotationItem[index].quotationPriceItems = items;
        quotation.quotationItem = quotationItem;
        this.setState({
            category: {
                ...category,
                quotation,
            }
        });
    }
    tabsAction = (items = []) => {
        let { category = {} } = this.state;
        let { quotation = {} } = category;
        quotation.quotationItem = items;
        if (items.length < 1) {
            message.error('至少需要一个属性');
            return;
        }
        if (items.length >= 9) {
            message.error('至多八个属性');
            return;
        }
        this.setState({
            category: {
                ...category, quotation
            }
        });
    }
    modAttr = (quotationItem = [], items = [], index) => {
        let { category = {} } = this.state;
        let { quotation = {} } = category;
        quotationItem[index].quotationPriceItems = items
        quotation.quotationItem = quotationItem;
        this.setState({
            category: {
                ...category, quotation
            }
        });
    }

    render() {
        let { category = {} } = this.state;

        let { quotation = {} } = category;
        let { maxPrice = 0, minPrice = 0, quotationItem = [{ label: '属性1', priority: 1, type: 1, status: 1 }] } = quotation

        return <Drawer
            visible={true}
            width='50vw'
            getContainer={() => Utils.common.createModalContainer(id_div)}
            title="编辑报价明细"
            onClose={this.close}
            placement="right"
            key="right"
            closable={false}
            footer={<div className="quota-foot">
                <Button type="primary" onClick={this.save}>确定</Button>
                <Button type="primary" onClick={this.close}>取消</Button>
            </div>}>

            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>最高价</span>}
                required={true}
            >
                <InputNumber value={maxPrice / 1000}
                    min={0} max={CTYPE.maxPrice} precision={2}
                    onChange={(value) => {
                        this.modCategoryQuotation("maxPrice", value * 1000);
                    }} />
            </Form.Item>
            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>最低价</span>}
                required={true}
            >
                <InputNumber value={minPrice / 1000}
                    min={0} max={CTYPE.maxPrice} precision={2}
                    onChange={(value) => {
                        this.modCategoryQuotation("minPrice", value * 1000);
                    }} />
            </Form.Item>

            <Form.Item
                {...CTYPE.formItemLayout}
                wrapperCol={16}
                label={<span>规格</span>}
                required={true}
            >
                <Tabs
                    hideAdd={true}
                    type="editable-card"
                    tabBarExtraContent={<Button type="primary" style={{ width: '32px' }}
                        onClick={() => {
                            quotationItem.push({ label: `属性${quotationItem.length + 1}`, type: 1, status: 1 });
                            this.tabsAction(quotationItem)
                        }}>
                        <PlusOutlined style={{ marginLeft: '-6px' }} />
                    </Button>}
                    onEdit={(key) => {
                        quotationItem = U.array.remove(quotationItem, key);
                        this.tabsAction(quotationItem);
                    }}>
                    {quotationItem.map((item, index) => {
                        let { label, priority = 1, type = 1, status = 1, quotationPriceItems = [{ label: '', price: '' }] } = item;
                        return <Tabs.TabPane tab={label} key={index}>
                            <Form.Item
                                {...CTYPE.dialogItemLayout}
                                label={<span>属性名称</span>}
                                required={true}>
                                <Col span={10}>
                                    <Input placeholder='请输入属性名称' value={label} onChange={e => {
                                        this.modQuotationItem(quotationItem, 'label', e.target.value, index);
                                    }} />
                                </Col>
                            </Form.Item>

                            <Form.Item
                                {...CTYPE.dialogItemLayout}
                                label={<span>权重</span>}
                                required={true}
                            >
                                <InputNumber value={priority} min={1} max={100} onChange={val => {
                                    this.modQuotationItem(quotationItem, 'priority', val, index);
                                }} />
                            </Form.Item>
                            <Form.Item
                                {...CTYPE.dialogItemLayout}
                                label={<span>类型</span>}
                                required={true}
                            >
                                <Radio.Group value={type} onChange={e => {
                                    this.modQuotationItem(quotationItem, 'type', e.target.value, index);
                                }}>
                                    <Radio value={1}>单选</Radio>
                                    <Radio value={2}>多选</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                {...CTYPE.dialogItemLayout}
                                label={<span>状态</span>}
                                required={true}
                            >
                                <Radio.Group value={status} onChange={e => {
                                    this.modQuotationItem(quotationItem, 'status', e.target.value, index);
                                }}>
                                    <Radio value={1}>启用</Radio>
                                    <Radio value={2}>停用</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                {...CTYPE.dialogItemLayout}
                                label={<span>参数</span>}
                                required={true}
                            >
                                {quotationPriceItems.map((it, i) => {
                                    let { label, price } = it;
                                    return <Input.Group key={i}>
                                        <Row>
                                            <Col span={10}>
                                                <Input placeholder="属性描述"
                                                    className="input-extra"
                                                    value={label} onChange={e => {
                                                        this.modQuotationPriceItems(quotationItem, quotationPriceItems, 'label', e.target.value, index, i);
                                                    }} />
                                            </Col>
                                            <Col span={4.1}>
                                                <InputNumber
                                                    className="input-number-extra"
                                                    placeholder="折旧价"
                                                    min={0} max={maxPrice / 1000} precision={2}
                                                    value={price / 1000} onChange={value => {
                                                        this.modQuotationPriceItems(quotationItem, quotationPriceItems, 'price', value * 1000, index, i);
                                                    }} />
                                            </Col>
                                            <Col span={8}>
                                                <Button type='primary' icon={<ArrowUpOutlined />} disabled={i === 0} onClick={() => {
                                                    quotationPriceItems = U.array.swap(quotationPriceItems, i, i - 1);
                                                    this.modAttr(quotationItem, quotationPriceItems, index)
                                                }} />
                                                <Button type='primary' icon={<ArrowDownOutlined />} disabled={i === quotationPriceItems.length - 1} onClick={() => {
                                                    quotationPriceItems = U.array.swap(quotationPriceItems, i, i + 1);
                                                    this.modAttr(quotationItem, quotationPriceItems, index)
                                                }} />
                                                {quotationPriceItems.length !== 1 &&
                                                    <Button type='danger' icon={<MinusOutlined />} className={classnames("button-type", { 'minus': quotationPriceItems.length > 1 })} onClick={() => {
                                                        quotationPriceItems = U.array.remove(quotationPriceItems, i);
                                                        this.modAttr(quotationItem, quotationPriceItems, index)
                                                    }} />}
                                                {i === quotationPriceItems.length - 1 &&
                                                    <Button type='primary' icon={<PlusOutlined />} className="button-type" onClick={() => {
                                                        quotationPriceItems.push({ label: ``, price: '' });
                                                        this.modAttr(quotationItem, quotationPriceItems, index)
                                                    }} />}
                                            </Col>
                                        </Row>
                                    </Input.Group>
                                })}
                            </Form.Item>
                        </Tabs.TabPane>
                    })}

                </Tabs>
            </Form.Item>


        </Drawer>
    }
}