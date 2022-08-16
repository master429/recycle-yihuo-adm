import React from 'react';
import { Button, Card, Form, Input, InputNumber, message } from 'antd';
import { App, CTYPE, U } from "../../common";
import { Link } from 'react-router-dom';
import BreadcrumbCustom from "../BreadcrumbCustom";
import { PosterEdit } from "../../common/CommonEdit";
import '../../assets/css/content/articles-page.less';
import HtmlEditor from "../../common/HtmlEditor";
import { SaveOutlined } from '@ant-design/icons';


export default class ArticleEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            article: {},
            loading: false
        }
    }
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { id } = this.state;
        if (id) {
            App.api('/adm/article/article', { id }).then(article => {
                this.setState({ article });
            });
        }
    };

    handleSubmit = () => {
        let { article = {} } = this.state;
        let { title, descr, cover } = article;
        if (U.str.isEmpty(title)) {
            message.warn('请添加标题');
        } else if (title.length > 40) {
            message.warn('标题长度不能超过40');
        } else if (descr.length > 140) {
            message.warn('简介长度不能超过140');
        } else if (U.str.isEmpty(descr)) {
            message.warn('请添加简介');
        } else if (U.str.isEmpty(cover)) {
            message.warn('请添加封面图');
        } else {
            this.setState({ loading: true });
            App.api('/adm/article/save', { article: JSON.stringify(article) }).then(() => {
                message.success('保存成功');
                this.setState({ loading: false });
                App.go('/app/content/articles');
            }, () => this.setState({ loading: false }));
        }
    };

    render() {
        let { article = {}, loading } = this.state;
        let { id, title, descr, content, cover, pv, collectNum } = article;

        return <div className="article-edit">
            <BreadcrumbCustom first={<Link to={`/app/content/articles`}>{CTYPE.link.content_articles.txt}</Link>} second={id == 0 ? '新建文章' : '编辑文章'} />
            <Card extra={<Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => {
                this.handleSubmit();
            }}>保存</Button>}>

                <Form.Item
                    required={true}
                    {...CTYPE.formItemLayout} label='文章标题'>
                    <Input placeholder="请输入文章标题" maxLength={40}
                        value={title}
                        onChange={(e) => {
                            this.setState({
                                article: {
                                    ...article,
                                    title: e.target.value
                                }
                            });
                        }} />
                </Form.Item>

                <Form.Item
                    required={true}
                    {...CTYPE.formItemLayout} label='文章简介'>
                    <Input.TextArea rows={4} placeholder="请输入文章简介" maxLength={140}
                        value={descr}
                        onChange={(e) => {
                            this.setState({
                                article: {
                                    ...article,
                                    descr: e.target.value
                                }
                            });
                        }} />
                </Form.Item>


                <PosterEdit title='封面图' type='s' scale={'750*750'} img={cover} required={true} syncPoster={(url) => {
                    article.cover = url;
                    this.setState({
                        article
                    });
                }} />

                <Form.Item
                    {...CTYPE.formItemLayout} label='浏览量'>
                    <InputNumber value={pv} min={0} maxLength={8} precision={0}
                        style={{ width: '190px' }}
                        onChange={value => this.setState({
                            article: {
                                ...article,
                                pv: value
                            }
                        })} />
                </Form.Item>

                <Form.Item
                    {...CTYPE.formItemLayout} label='收藏量'>
                    <InputNumber value={collectNum} min={0} maxLength={8}
                        style={{ width: '190px' }}
                        onChange={value => this.setState({
                            article: {
                                ...article,
                                collectNum: value
                            }
                        })} />
                </Form.Item>

                <Form.Item
                    {...CTYPE.formItemLayout} label="文章内容">
                    <HtmlEditor content={content} syncContent={(content) => {
                        this.setState({
                            article: {
                                ...article,
                                content
                            }
                        });
                    }} />
                </Form.Item>
            </Card>

        </div>
    }
}