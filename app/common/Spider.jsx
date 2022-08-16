import React from 'react';
import {Input, message, Modal} from 'antd';
import {App, ImgToBase64, OSSWrap, U, Utils} from './index';

const {TextArea} = Input;
let id_div_article_content = 'tmp-article-content';

const id_div = 'div-dialog-xiumi';

export default class Spider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show_input: false,
            url: '',
            article: {},
            imgs: []
        };
    }

    saveArticle = () => {
        message.destroy();
        this.props.onSpiderOK(this.state.article);
    };

    doFetchPage = () => {
        let url = this.state.url;
        if (U.str.isUrl(url)) {
            this.close();
            message.loading('正在抓取页面...', 0);
            App.api('common/fetch_article', {url}, {defaultErrorProcess: false}).then((article) => {
                this.setState({
                    article
                }, () => {
                    this.saveArticle();
                });
            }, (err) => {
                message.destroy();
                message.error(err.msg);
            });
        } else {
            message.destroy();
            message.error('链接地址错误');
        }
    };

    close = () => {
        Utils.common.closeModalContainer(id_div);
    };

    render() {
        let {url} = this.state;
        return <Modal
            title="请输入链接地址"
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            onOk={this.doFetchPage}
            onCancel={this.close}>
            <TextArea style={{height: '100px'}} value={url} placeholder='输入微信文章地址' onChange={(e) => {
                this.setState({url: e.target.value});
            }}/>
        </Modal>;
    }
}

export const turnImportImg = (content, fn) => {
    let detachImgs = (content) => {

        //强制清除同名div
        let e = document.getElementById(id_div_article_content);
        if (e) {
            document.body.removeChild(e);
        }

        //创建div并输入内容
        let div = document.createElement("div");
        div.setAttribute('id', id_div_article_content);
        div.style.display = 'none';
        div.innerHTML = content;
        document.body.appendChild(div);

        let imgs = [];
        let objs = document.getElementById(id_div_article_content).getElementsByTagName("img");
        for (let i = 0; i < objs.length; i++) {
            let img = objs[i];
            let rand = U.str.randomString(6);
            img.setAttribute('id', rand);
            imgs.push({id: rand, src: img.src || img.dataset.src});
        }
        return imgs;
    };


    let imgs = detachImgs(content);
    let downloadImg = (url, i, time = 0) => {
        time++;
        if (time > 5) {
            console.error('访问次数过多');
            return;
        }
        ImgToBase64({
            url
        }, (base64) => {
            let file = U.base64.toFile(base64);
            OSSWrap.upload(file).then((result) => {
                imgs[i].oss = result.url;
            }).catch((err) => {
                message.error(err);
            });
        }, () => {
            setTimeout(() => {
                downloadImg(url, i, time);
            }, (imgs.length + time) * 550);
        });
    };


    let downloadImgs = (imgs) => {
        imgs.map((img, i) => {
            setTimeout(() => {
                downloadImg(img.src, i);
            }, i * 550);
        });
    };
    let downloadImgTimer = (t = 0) => {
        if (t > 120) {
            return;
        }
        t++;
        let _imgs = imgs.filter(img => !img.oss);
        if (_imgs && _imgs.length > 0) {
            setTimeout(() => {
                downloadImgTimer(t);
            }, 2000);
        } else {
            replaceImgs();
        }
    };
    let replaceImgs = () => {

        let div = document.getElementById(id_div_article_content);
        let objs = div.getElementsByTagName("img");
        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];
            let id = obj.id;
            imgs.map((img, i) => {
                if (img.id === id) {
                    obj.src = img.oss;
                    delete obj.dataset.src;
                    obj.style.width = 'auto';
                    obj.style.height = 'auto';
                    obj.style = '';
                }
            });
        }
        fn && fn(div.innerHTML);
        return div.innerHTML;
    };
    if (imgs.length > 0) {
        downloadImgs(imgs);
        downloadImgTimer(0);
    }

};
