import React from 'react';
import { App, CTYPE, Utils } from '../../common';
import '../../assets/css/category/categories-page.less';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Button, Modal, notification, Empty, Tree, Card, Tag } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import ProductUtils from './ProductUtils';

const { TreeNode } = Tree;

export default class Categories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        }
    }
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api('adm/category/categories').then((categories) => {
            console.log(categories);
            this.setState({
                categories
            });
        });
    }

    updateStatus = (id, status) => {
        let txt = status === 1 ? '下架' : '上架';
        Modal.confirm({
            title: `确认${txt}?`,
            onOk: () => {
                App.api('adm/category/update_status', { id, status: status === 1 ? 2 : 1 }).then(() => {
                    notification['success']({
                        message: '提示',
                        description: `${txt} 成功`,
                    });
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    renderTitle = (category, parent, level, index) => {
        let { id, name, icon, priority, status, children = [] } = category;
        let length = children.length;
        category.level = level;
        category.index = index;

        let _cate = JSON.parse(JSON.stringify(category));
        delete _cate.title;
        delete _cate.children;

        let icons = [icon]
        return <div className={`tree-node-menu-open item-${level}`}>
            <div className="badge">{level}</div>
            {level !== 2 && <img src={icon} onClick={() => {
                icons.map((item, index) => {
                    Utils.common.showImgLightbox(icons, index);
                });
            }} />}
            <div className="detail">
                <div className="name">{name}</div>
                <div className="wrapper">
                    <span className="priority">权重：{priority}</span>
                    <span className="halt-tag">{status == 2 && <Tag color="#f50">已下架</Tag>}</span>
                </div>

            </div>
            <div className="action">
                <div className="edit" onClick={() => ProductUtils.genCategoryEdit(category, parent, this.loadData, length)}>编辑</div>
                {level == 3 && <div onClick={() => ProductUtils.genCategoryQuotationEdit(_cate, this.loadData)}>报价</div>}
                {level !== 3 && <div className="add" onClick={() => {
                    ProductUtils.genCategoryEdit({
                        id: 0,
                        level: level + 1,
                        index: children.length + 1
                    }, category, this.loadData, length);
                }}>新建子分类</div>}
                <div className="handle" onClick={() => this.updateStatus(id, status)}>{status == 2 ? '上架' : '下架'}</div>
            </div>
        </div>
    }

    initTreeData = () => {
        let { categories = [] } = this.state;
        categories.map((item1, index1) => {
            let { children = [] } = item1;
            item1.key = `${index1}`;
            item1.title = this.renderTitle(item1, { id: 0 }, 1, index1 + 1);
            children.map((item2, index2) => {
                let { children = [] } = item2;
                item2.key = `${index1}-${index2}`;
                item2.title = this.renderTitle(item2, item1, 2, index2 + 1);
                children.map((item3, index3) => {
                    item3.key = `${index1}-${index2}-${index3}`;
                    item3.title = this.renderTitle(item3, item2, 3, index3 + 1);
                });
            });
        });
    }

    render() {
        let { PRODUCT_CATEGORY_EDIT } = Utils.adminPermissions;
        let { categories = [] } = this.state;
        categories.sort((a, b) => {
            return a.sequence.localeCompare(b.sequence);
        });
        this.initTreeData();


        return <div className="categories-page">
            <BreadcrumbCustom first={CTYPE.link.category_edit.txt} />
            <div className="categories">
                {PRODUCT_CATEGORY_EDIT && <div className="top">
                    <Button type='primary'
                        onClick={() => ProductUtils.genCategoryEdit({ id: 0, level: 1 }, { id: 0, sequence: '' }, this.loadData, categories.length)}>
                        <PlusSquareOutlined />
                        新建一级分类
                    </Button>
                </div>}
                <div className="categories-content">
                    <Card>
                        {categories.length <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {categories.length > 0 && <Tree treeData={categories} defaultExpandAll={true} />}
                    </Card>
                </div>
            </div>
        </div>
    }
}