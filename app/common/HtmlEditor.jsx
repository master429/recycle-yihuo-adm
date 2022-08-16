import React from 'react';
import 'froala-editor/js/froala_editor.pkgd.min';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/languages/zh_cn.js';
import FroalaEditor from 'react-froala-wysiwyg';
import '../assets/css/common/html-editor.less';
import Spinning from './Spinning';
import {OSSWrap, U, Utils} from "./index";
import EditorUtils from "./EditorUtils";
import {turnImportImg} from "./Spider";

@Spinning
export default class HtmlEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: this.props.content,
            index: this.props.index
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            model: newProps.content,
        });
    }

    componentDidMount() {
        // document.getElementsByClassName('fr-element')[0].style.minHeight = '600px';
    }

    imageBeforeUpload = (e, editor, images) => {
        if (images.length) {

            let hash = new Date().getTime() + U.str.randomString(6);
            let image = images[0];
            if (!image.name) {
                //blob对象，来自拷贝
                let reader = new FileReader();
                reader.onload = (e) => {
                    let base64 = e.target.result;
                    image.name = hash + '.jpg';
                    OSSWrap.upload(image).then((result) => {
                        let imgs = document.getElementsByTagName("img");
                        if (imgs && imgs.length > 0) {
                            for (let i = 0; i < imgs.length; i++) {
                                let img = imgs[i];
                                if (img.src === base64) {
                                    img.src = result.url;
                                }
                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                };
                reader.readAsDataURL(image);
            } else {
                //文件本地上传模式
                OSSWrap.upload(image).then((result) => {
                    editor.image.insert(result.url);
                });
            }
        }
        return false;
    };


    /*
     * delHtmlTag('<div> <li>1</li> </div>','div')  => '<li>1</li>'
     * delHtmlTag('<div> <li>1</li> </div>',['div','li'])  => '1'
     * */
    delHtmlTag(str, reg) {
        if (reg) {
            if (typeof reg === 'string') {
                let pattern = new RegExp('(<' + reg + '>|</' + reg + '>)', 'g');
                return str.replace(pattern, "");
            }

            if (reg instanceof Array) {
                reg.forEach((item) => {
                    str = this.delHtmlTag(str, item);
                });
                return str;
            }
        }
        return true;//默认
    }

    pasteCleanUp = (e, editor, clipboard_html) => {
        return this.delHtmlTag(clipboard_html, editor.opts.regCleano);
    };

    handleModelChange = (model) => {
        this.props.syncContent(model, this.state.index);
    };

    videoBeforeUpload = (e, editor, $video) => {
        this.props.startLoading();
        OSSWrap.upload($video[0], {}).then((result) => {
            editor.video.insert(`<video preload="auto"  style='object-fit:fill;width:100%' controls="true" webkit-playsinline="true"  x-webkit-airplay="allow" x5-video-player-type="h5" playsinline="true"  autoplay="true" src="${result.url}" style="width:100%"></video>`);
            this.props.stopLoading();
        }).catch((err) => {
            console.log(err);
            this.props.stopLoading();
        });
        return false;
    };

    syncContentWrap = (content) => {
        // 处理外部编辑器导入的内容
        this.setState({spinning: true}, () => {
            EditorUtils.parseContent(content, {namespace: 'course-content'}, (converted) => {
                this.setState({spinning: false});
                this.props.syncContent(converted, this.state.index);
            });
        });
    };

    onSpiderOK = (article) => {
        this.setState({
            spinning: true
        });
        turnImportImg(article.content, (content) => {
            this.props.syncContent(content, this.state.index);
            this.setState({
                spinning: false
            });
        });
    };

    render() {

        let {model = ''} = this.state;
        let {wh = {}} = this.props;

        return (
            <div className="html-editor">
                <FroalaEditor
                    config={{
                        language: 'zh_cn',
                        width: wh.width || '410px',
                        height: wh.height || '600px',
                        regCleanPaste: ['pre'],
                        // toolbarButtons: ['undo', 'redo', '|', 'bold', 'color', 'fontSize', 'align', 'insertImage', 'insertVideo', 'html'],

                        toolbarButtons: [
                            'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', 'bold', 'italic', 'underline', 'strikeThrough',
                            'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '|', 'selectAll', 'clearFormatting',
                            'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'html', 'fullscreen',
                        ],

                        quickInsertButtons: ['image'],
                        fontSize: ['12', '14', '16', '18', '24', '30', '36'],
                        fontSizeDefaultSelection: '13',
                        fontSizeSelection: true,
                        placeholderText: '',
                        imageUpload: true,
                        imageEditButtons: ['imageAlign', 'imageRemove', 'imageCaption', 'imageLink'],
                        events: {
                            'froalaEditor.image.beforeUpload': this.imageBeforeUpload,
                            'froalaEditor.paste.afterCleanup': this.pasteCleanUp,
                            'froalaEditor.video.beforeUpload': this.videoBeforeUpload,
                        },
                        imageInsertButtons: ['imageUpload',]
                    }}
                    model={model}
                    onModelChange={this.handleModelChange}/>

                {false && <ul className='cz-addon'>
                    <li>
                        <a className='xiumi' onClick={() => {
                            Utils.common.xiumiEditor(this.syncContentWrap);
                        }}><i/>秀米插件</a>
                    </li>

                    <li>
                        <a className='wx' onClick={() => {
                            Utils.common.wxSpider(this.onSpiderOK);
                        }}><i/>微信文章导入</a>
                    </li>

                </ul>}
            </div>
        );
    }
}
