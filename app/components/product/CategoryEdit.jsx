import React from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import { App, CTYPE, Utils, OSSWrap, U } from '../../common';
import '../../assets/css/category/categories-page.less';
import Proptypes from 'prop-types';

const id_div = 'div-modal-category-edit';

export default class CategoryEdit extends React.Component {

    static propTypes = {
        category: Proptypes.object.isRequired,
        parent: Proptypes.object.isRequired,
        loadData: Proptypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category,
            parent: this.props.parent,
            length: this.props.length,
            uploading: false,
        }
    }

    close = () => {
        Utils.common.closeModalContainer(id_div);
    }

    handleNewImage = e => {

        let { uploading = false, category } = this.state;


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
                category: {
                    ...category,
                    icon: result.url,
                },
                uploading: false
            });

        }).catch((err) => {
            message.error(err);
        });
    };

    modCategory = (field, val) => {
        let { category = {} } = this.state;
        category[field] = val;
        this.setState({ category });
    }

    genSequence = (level, length = 0, parent = {}) => {
        let seq = '';
        let _length = length + 1 < 1 || length + 1 > 99 ? '00' : (length < 9 ? `0${length + 1}` : length + 1);
        let { sequence = '000000' } = parent;
        if (level == 1) {
            seq = _length + '0000';
        } else if (level == 2) {
            seq = sequence.substr(0, 2) + _length + '00';
        } else {
            console.log(sequence);
            seq = sequence.substr(0, 4) + _length;
        }
        return seq;
    }

    save = () => {
        let { category = {}, parent = {}, length } = this.state;
        console.log(length)
        let { id, level, icon, name, priority, sequence, } = category;
        if (U.str.isEmpty(name)) {
            message.warn('名称不能为空');
        }
        if ((level == 1 || level == 3) && U.str.isEmpty(icon)) {
            message.warn('图标不能为空');
        }
        if (!id) {
            let { id = 0 } = parent;
            category.parentId = id;
            console.log(level, parent);
            category.sequence = this.genSequence(level, length, parent);
        }
        if (!priority) {
            category.priority = 1;
        }
        console.log(category);

        delete category.title;
        delete category.children;

        App.api('adm/category/save_category', {
            category: JSON.stringify({
                ...category
            })
        }).then(() => {
            message.success("分类保存成功");
            this.close();
            this.props.loadData();
        });

    }

    render() {
        let { category = {}, uploading, parent = {}, length } = this.state;
        console.log(length);
        let { id, name, icon, priority = 1, level } = category;
        console.log(category);
        return <Modal
            visible={true}
            title={`${id == 0 ? '新建' : '编辑'}分类`}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            onCancel={this.close}
            onOk={this.save}
        >

            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>名称</span>}
                required={true}
            >
                <Input placeholder="请填写分类名称"
                    value={name}
                    onChange={(e) => this.modCategory('name', e.target.value)} />
            </Form.Item>
            {level != 2 && <Form.Item
                {...CTYPE.formItemLayout}
                label="图标"
                required={true}
            >
                <Spin spinning={uploading}>
                    <div className="categoty-icon">
                        <div className='upload-img'>
                            {icon && <img src={icon} />}
                            <input className="file" type='file' onChange={this.handleNewImage} />
                        </div>
                    </div>
                </Spin>
            </Form.Item>}
            <Form.Item
                {...CTYPE.formItemLayout}
                label={<span>权重</span>}
                required={true}
            >
                <Input
                    value={priority}
                    style={{ width: '120px' }}
                    onChange={e => this.modCategory('priority', e.target.value)} />
            </Form.Item>
        </Modal>
    }
}