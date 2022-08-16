import React from 'react';
import '../assets/css/common/img-editor.less';
import OSSWrap from '../common/OSSWrap.jsx';

import ReactAvatarEditor from 'react-avatar-editor'
import {message, Progress, Radio} from 'antd';
import U from "./U";
import {ImgToBase64} from "./index";

const RadioGroup = Radio.Group;

const scale_min = 1;
const scale_max = 2;

export default class ImgEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: {x: 0.5, y: 0.5},
            scale: 1,
            rotate: 0,
            compression: 0.8,
            preview: null,
            width: 0,
            height: 0,
            aspectRatio: this.props.aspectRatio,
            image: null,
            upload_progress: 0,
            uploading: false
        };
    }

    close = () => {
        let e = document.getElementById('div-img-editor');
        if (e) {
            document.body.removeChild(e);
        }
    };

    handleImgSaved = (img) => {
        this.props.syncImg(img);
        this.close();
    };

    componentDidMount() {

        let width = 900;
        let height = 900 * this.state.aspectRatio;

        this.setState({
            width: width,
            height: height
        });

        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.style.marginTop = '-' + ((height / 4) - 50) + 'px';

        let img = this.props.img;
        if (false && img) {
            ImgToBase64({url: img}, (base64) => {
                let img = U.base64.getBlobBydataURI(base64, 'image/png');
                let file = new File([img], "load_canvasfile_" + Date.parse(new Date()) + ".png");
                this.setState({
                    image: file
                })
            });
        }
    }

    handleNewImage = e => {
        if (!e.target.files[0] || e.target.files[0].type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false,
            });
            return;
        }
        this.setState({image: e.target.files[0], uploading: false})
    };

    handleSave = () => {

        let {image, uploading, compression} = this.state;

        if (U.str.isEmpty(image)) {
            message.info('请选择图片');
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});

        const base64 = this.editor.getImageScaledToCanvas().toDataURL('image/png', compression);

        let img = U.base64.getBlobBydataURI(base64, 'image/png');
        img.name = "canvasfile_" + Date.parse(new Date()) + ".png";

        OSSWrap.upload(img).then((result) => {
            this.setState({upload_progress: 100});
            this.handleImgSaved(result.url);
        }).catch((err) => {
            message.error(err);
        });
    };

    rotateLeft = (e) => {
        e.preventDefault();
        this.setState({
            rotate: this.state.rotate - 90,
            width: this.state.height,
            height: this.state.width
        })
    };

    modRange = (add) => {
        let scale = this.state.scale;
        if (add) {
            scale = Math.min(scale + 0.1, scale_max);
        } else {
            scale = Math.max(scale - 0.1, scale_min);
        }
        message.info('x ' + scale.toFixed(1), 1, null, false);
        this.setState({
            scale: scale
        })
    };

    setEditorRef = editor => {
        if (editor) this.editor = editor
    };

    handlePositionChange = position => {
        this.setState({position})
    };

    render() {

        let {upload_progress, aspectRatio, scale, width, height, position, image, rotate, compression} = this.state;

        let _height = 450 * aspectRatio + 180;

        return <div className="img-editor" style={{height: _height + 'px'}}>

            {upload_progress > 0 && upload_progress < 100 &&
            <Progress percent={upload_progress} strokeWidth={1} showInfo={false}/>}
            <div className="close" onClick={this.close}/>

            <ReactAvatarEditor
                ref={this.setEditorRef}
                scale={parseFloat(scale)}
                width={width}
                height={height}
                border={[1, 1]}
                color={[255, 255, 255, 0.8]}
                position={position}
                onPositionChange={this.handlePositionChange}
                rotate={parseFloat(rotate)}
                onSave={this.handleSave}
                image={image}/>

            <div className="control">

                <div className="bar">
                    <i className="lessen" onClick={() => {
                        this.modRange(false);
                    }}/>
                    <input type='range' onChange={e => {
                        const scale = parseFloat(e.target.value);
                        clearTimeout(this.timer_scale);
                        this.timer_scale = setTimeout(() => {
                            message.info('x ' + scale, 1, null, false);
                        }, 300);
                        this.setState({scale});
                    }} value={scale}
                           min={scale_min} max={scale_max} step='0.1' className="range"/>
                    <i className="largen" onClick={() => {
                        this.modRange(true);
                    }}/>
                </div>

                <RadioGroup onChange={(e) => {
                    this.setState({compression: e.target.value})
                }} value={compression}>
                    <Radio value={0.6}>普通(60%压缩)</Radio>
                    <Radio value={0.8}>清晰(80%压缩)</Radio>
                    <Radio value={1}>原图(无压缩)</Radio>
                </RadioGroup>

                <div className="btns">
                    <p className="uploader">
                        <input className="file"
                               type='file' onChange={this.handleNewImage}/>
                    </p>
                    <p className="i-rotate" onClick={this.rotateLeft}/>
                    <p className="submit" onClick={this.handleSave}/>
                </div>

            </div>
        </div>
    }

}
