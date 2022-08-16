import React from 'react';
import '../assets/css/common/common-edit.less'
import CTYPE from "./CTYPE";

import {Button, Form, message, Radio, Select} from 'antd';
import {Utils} from "./index";

const {Option} = Select;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class PosterEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            type: this.props.type,
            img: this.props.img,
            required: this.props.required,
            withoutPreview: this.props.withoutPreview,
            _scale: this.props.scale
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            title: newProps.title,
            type: newProps.type,
            img: newProps.img,
            required: newProps.required,
            withoutPreview: newProps.withoutPreview
        })
    }


    showImgEditor = () => {
        let {type, img} = this.state;
        let scale = CTYPE.imgeditorscale.rectangle_h;
        if (type === 's') {
            scale = CTYPE.imgeditorscale.square;
        } else if (type === 'v') {
            scale = CTYPE.imgeditorscale.rectangle_v;
        } else if (type === 't') {
            scale = CTYPE.imgeditorscaleTrainer.avatar;
        } else if (type === 'c') {
            scale = CTYPE.imgeditorscaleTrainer.cover;
        }
        Utils.common.showImgEditor(scale, img, this.syncImg);
    };

    syncImg = (img) => {
        this.setState({img});
        message.success('上传成功');
        this.props.syncPoster(img);
    };

    render() {

        let {type, img, required = false, title, withoutPreview, _scale} = this.state;

        let scale = '750*422';
        let wh = {width: '187px', height: '106px'};
        if (type === 's') {
            scale = '750*750';
            wh = {width: '120px', height: '120px'};
        } else if (type === 'v') {
            scale = '750*1334';
            wh = {width: '187px', height: '333px'};
        } else if (type === 't') {
            scale = '70*90';
            wh = {width: '70px', height: '90px'};
        } else if (type === 'c') {
            scale = '375*220';
            wh = {width: '375px', height: '220px'};
        }

        _scale = _scale || scale;

        return <FormItem
            required={required}
            {...CTYPE.formItemLayout} label={title}>
            {!withoutPreview && <div className='upload-img-preview' style={wh} onClick={this.showImgEditor}>
                {img && <img src={img} style={wh}/>}
            </div>}
            <div className='upload-img-tip'>
                <Button type="primary" icon="file-jpg"
                        onClick={this.showImgEditor}>选择图片</Button>
                <br/>
                建议上传图片尺寸{_scale}，.jpg、.png格式，文件小于1M
            </div>
        </FormItem>

    }
}

export {PosterEdit};
