import React from 'react';
import '../../assets/css/setting/ui-edit.less';
import {App, CTYPE, U} from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Link} from 'react-router-dom';
import {Card, Button, Input, Tag, Modal, message} from 'antd';
import {SaveOutlined, CloseOutlined, EditOutlined} from '@ant-design/icons';
import SettingUtils from './SettingUtils';
import Sortable from 'sortablejs';
import classnames from 'classnames';


export default class UiEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: parseInt(this.props.match.params.type),
            id: parseInt(this.props.match.params.id),
            ui: {},
            uiComponentTypes: SettingUtils.UIComponentTypes,
            homeComps: [],
            currCompIndex: -1,
            currCompKey: '',
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

        let {id} = this.state;
        if (!id) {
            return;
        }
        App.api('/adm/ui/ui', {id}).then((result) => {
                this.setState({
                    title: result.title,
                    homeComps: result.components,
                }, () => {
                    this.filterHomeCompes();
                });
            }
        );
    };

    save = () => {

        let error = false;
        let {id, type, title, homeComps = []} = this.state;
        for (let i = 0, flag = true; i < homeComps.length; flag ? i++ : i) {

            flag = true;
            let am = homeComps[i];
            let key = am.key;
            if ((key === 'BANNER' || key === 'AD') && (!am.list || am.list.length === 0)) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getCompByKey(key, i).name + ' 自定义内容未设置');
                error = true;
            } else if (U.str.isEmpty(am.title)) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getCompByKey(key, i).name + ' 标题未填写');
                error = true;
            } else if (!am.list || am.list.length === 0) {
                message.error('序号为' + (i + 1) + ' 的组件 ' + this.getCompByKey(key, i).name + ' 自定义内容未设置');
                error = true;
            }

            if (error) {
                return;
            }
        }
        this.setState({homeComps});

        let restbuy = homeComps.find(value => value.key === 'BESTBUY') || {};
        if (restbuy.list && restbuy.list.length % 2 !== 0) {
            message.error(`添加${restbuy.title}的数量应为偶数`);
            return;
        }
        let sales = homeComps.find(value => value.key === 'SALES') || {};
        if (sales.list && sales.list.length < 3) {
            message.error(`添加${sales.title}的数量不应小于3`);
            return;
        }
        let atlas = homeComps.find(value => value.key === 'ATLAS') || {};
        if (atlas.list && atlas.list.length % 3 !== 0) {
            message.error(`添加的${atlas.title}数量应为3的倍数`);
            return;
        }
        App.api('/adm/ui/save', {
            ui: JSON.stringify({
                id,
                type,
                title,
                components: homeComps
            })
        }).then(() => {
            message.success('首页配置已保存');
            App.go(`/app/setting/uis/${type}`)
        });
    };


    addHomeComp = (uiComp) => {
        let {homeComps = []} = this.state;

        homeComps = U.array.insert(homeComps, homeComps.length, {...uiComp, title: uiComp.name});


        this.setState({
            homeComps,
        }, () => {
            this.filterHomeCompes();
            this.show(true, uiComp.key, homeComps.length - 1, true);
        });

    }

    show = (common, key, index, val) => {
        if (key === 'SLOGAN') {
            let comp = this.getCompByKey('SLOGAN', index);
            comp.list = [{img: require('../../assets/image/ui/bg_slogan.png')}]
            this.setComp(comp, index);
        }
        this.setState({
            currCompIndex: index,
            currCompKey: key,
            [key]: !common ? (val ? val : false) : false,
        }, () => {
            if (['BANNER', 'AD', 'BRAND', 'MERCHANT', 'CATEGORY', 'SALES', 'BESTBUY', 'NAV', 'CASE', 'ATLAS', 'ARTISAN', 'ARTICLE'].includes(key) && val) {
                this.compSortListener(index);
            }
        });
    }

    compSortListener = (index) => {
        let banerComp = document.getElementById(`comp_sorter_${index}`);
        if (banerComp) {
            let sortable = Sortable.create(banerComp, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {
                        let list = this.getCompByKey(null, index).list || [];
                        let sort = [];
                        list.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        return sort;

                    },
                    set: (sortable) => {
                        let sort = sortable.toArray();
                        let list = [];
                        sort.map((s) => {
                            list.push(JSON.parse(s));
                        });
                        let comp = this.getCompByKey(null, index);
                        comp.list = list;
                        this.setComp(comp, index);
                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let list = this.getCompByKey(null, index).list || [];
                        let sort = [];
                        list.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        sortable.sort(sort);
                    }, 10);
                },

            });
        }
    }

    getCompByKey = (k, index) => {
        let {homeComps = []} = this.state;
        let comp = {};
        if (index > -1) {
            return homeComps[index];
        } else {
            homeComps.map((c) => {
                let {key} = c;
                if (key === k) {
                    comp = c;
                }
            });
        }
        return comp;
    };

    removeHomeComp = (index) => {
        Modal.confirm({
            title: `确认删除组件?`,
            onOk: () => {
                let {homeComps = []} = this.state;
                if (homeComps.length === 1) {
                    message.info('请最少保留一个类别');
                    return;
                }
                this.setState({
                    homeComps: U.array.remove(homeComps, index),
                    currCompIndex: -1,
                    currCompKey: ''
                }, () => {
                    this.filterHomeCompes();
                })
            },
            onCancel: () => {
            },
        });
    }

    setComp = (comp, index) => {
        let {homeComps = []} = this.state;
        if (index > -1) {
            homeComps[index] = comp;
        } else {
            homeComps.map((c) => {
                if (c.key === comp.key) {
                    c = comp;
                }
            });
        }
        this.setState({
            homeComps
        })
    };

    filterHomeCompes = () => {
        let {homeComps = [], uiComponentTypes = []} = this.state;

        uiComponentTypes.map((am) => {
            homeComps.map((m) => {
                if (am.key === m.key) {
                    m.name = am.name;
                    //防止广告位被强制写入标题
                    if (m.key !== 'AD') {
                        m.title = m.title || am.name;
                    }
                    m.rand = U.str.randomString(4);//!!!加入随机码防止comp相同时sort组件挂掉
                }
            });
        });

        homeComps.map((m, i) => {
            m.listStyle = m.listStyle || 1;
            m.commonComp = !['AD', 'BANNER'].includes(m.key);
            m.withStyle = ['BESTBUY'].includes(m.key);
            m.withTitle = ['MERCHANT', 'SALES', 'BRAND', 'RECYCLE_FLOW', 'ARTICLE', 'ARTISAN', 'GUARANTEE', 'ATLAS'].includes(m.key);
            m.withMore = ['SALES', 'BRAND', 'BESTBUY', 'ARTICLE', 'ARTISAN', 'CASE', 'ATLAS'].includes(m.key);
            m.withSortName = ['MERCHANT'].includes(m.key);
        });

        this.setState({
            homeComps
        }, () => {
            this.homeCompsSortListener();
        })
    };

    homeCompsSortListener = () => {
        let home_comps = document.getElementById('home_comps');
        if (home_comps) {
            let sortable = Sortable.create(home_comps, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {
                        let {homeComps = []} = this.state;
                        let sort = [];
                        homeComps.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        return sort;
                    },
                    set: (sortable) => {
                        let sort = sortable.toArray();
                        let homeComps = [];
                        sort.map((s) => {
                            homeComps.push(JSON.parse(s));
                        });
                        this.setState({
                            homeComps,
                            //强制清理组件当前选定值，防止窜数据
                            currCompIndex: -1, currCompKey: '',
                        });
                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let {homeComps = []} = this.state;
                        let sort = [];
                        homeComps.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        sortable.sort(sort);
                    }, 10);
                },
            });
        }
    };


    syncBanner = (obj) => {
        let cindex = obj.cindex;
        let comp = this.getCompByKey(null, cindex) || {};

        let {list = []} = comp;

        if (obj.index === -1) {
            list.push(obj);
        } else {
            list[obj.index] = obj;
        }

        comp.list = list;

        this.setComp(comp, cindex);

    }

    syncItems = (items) => {
        let {homeComps = [], currCompIndex} = this.state;
        let item = homeComps[currCompIndex];
        item.list = items;
        this.setState({
            homeComps
        })
    };


    render() {
        let {id, uiComponentTypes = [], homeComps = [], currCompIndex, currCompKey, title} = this.state;

        let isBanner = currCompKey === 'BANNER';
        let isAd = currCompKey === 'AD';
        let isRecycleCategory = currCompKey === 'RECYCLE_CATEGORY';
        let isSlogan = currCompKey === 'SLOGAN';

        let isArticle = currCompKey === 'ARTICLE';

        let isRecycleFlow = currCompKey === 'RECYCLE_FLOW';

        let isGuarantee = currCompKey === 'GUARANTEE';

        let currComp = this.getCompByKey(currCompKey, currCompIndex) || {};

        let {list = []} = currComp;

        console.log(currComp);

        console.log(list);

        return <div className="ui-edit">
            <BreadcrumbCustom first={<Link to={`/app/setting/uis`}>{CTYPE.link.setting_uis.txt}</Link>}
                              second={id == 0 ? '新建模版' : '编辑模版'}/>
            <Card extra={<Button type="primary" onClick={() => this.save()}><SaveOutlined/>保存配置</Button>}>
                <div className="inner">
                    <div className="components">
                        <Card title={<span>添加组件</span>}>
                            <label>页面名称</label>
                            <Input placeholder='请输入页面的名称' value={title} onChange={(e) => {
                                title = e.target.value;
                                this.setState({title});
                            }}/>
                            <label>内容组件</label>
                            <div className="c-components">
                                {uiComponentTypes.map((item, index) => {
                                    let {key, name} = item;
                                    return <Tag key={key} onClick={() => this.addHomeComp(item)}>
                                        <span>{name}</span>
                                        <i/>
                                    </Tag>
                                })}
                            </div>
                        </Card>
                    </div>
                    <div className="tel">
                        <ul className="components-preview" id="home_comps">
                            {homeComps.map((comp, index) => {
                                let {key, list = []} = comp;
                                let bg_className = comp.key;
                                if (comp.withStyle) {
                                    bg_className += '-' + comp.listStyle;
                                }
                                let className = currCompIndex === index ? ' highlightborder' : '';

                                return <li key={index}
                                           data-id={JSON.stringify(comp)}
                                           className={className}
                                           onClick={() => {
                                               this.show(true, key, index, true);
                                           }}>
                                    {currCompIndex === index &&
                                    < CloseOutlined className="close" onClick={() => this.removeHomeComp(index)}/>}
                                    {/* {comp.withTitle &&
                                        <div className='sub-title'><p>{comp.title}</p>{comp.withMore &&
                                            <a className='more'>查看更多</a>}</div>} */}
                                    <div className={bg_className}/>
                                </li>
                            })}
                        </ul>
                    </div>
                    {currCompIndex > -1 && <div className="form">
                        <Card title={<span>{currComp.name}</span>}>
                            {currComp.withTitle && <div className='line'>
                                <p className='required'>显示标题</p>
                                <Input value={currComp.title} maxLength={24} className='input-wide' onChange={(e) => {
                                    currComp.title = e.target.value;
                                    this.setComp(currComp, currCompIndex);
                                }}/>
                            </div>}
                            <Button type="primary"
                                    disabled={(isAd || isSlogan) && list.length === 1 || (isRecycleCategory && list.length === 3)}
                                    onClick={() => {
                                        if (isBanner || isAd) {
                                            let banner = {
                                                index: -1,
                                                cindex: currCompIndex,
                                                act: 'NONE',
                                                type: currCompKey
                                            };
                                            SettingUtils.bannerEdit(banner, this.syncBanner);
                                        } else if (isRecycleCategory) {
                                            let recyCate = {
                                                index: list || list.length > -1 ? list.length : 0,
                                                cindex: currCompIndex,
                                                type: currCompKey
                                            }
                                            SettingUtils.RecycleCategoryEdit(recyCate, this.syncBanner);
                                        } else if (isArticle) {
                                            SettingUtils.articlePicker(list, this.syncItems)
                                        } else if (isRecycleFlow) {
                                            let flow = {
                                                index: -1,
                                                cindex: currCompIndex,
                                            };
                                            SettingUtils.recycleFlow(flow, this.syncBanner)
                                        } else if (isGuarantee) {
                                            let guarantee = {
                                                index: -1,
                                                cindex: currCompIndex,
                                            };
                                            SettingUtils.guaranteeEdit(guarantee, this.syncBanner)
                                        }
                                    }}>添加内容</Button>

                            {isSlogan && <ul
                                className={classnames("banners-list", {'clear-ul-space': list.length < 1})}
                                id={`comp_sorter_${currCompIndex}`}>
                                {list.map((item, index) => {
                                    let {img} = item;
                                    return <li key={index} data-id={JSON.stringify(item)} style={{width: '100%'}}>
                                        <div className="img" style={{height: '28px'}}>
                                            {/* <EditOutlined className="icon edit" onClick={() => {
                                                SettingUtils.bannerEdit(item, this.syncItems);
                                            }} /> */}
                                            <img src={img} alt={img}/>
                                        </div>
                                    </li>
                                })}
                            </ul>}

                            {(isBanner || isAd) && <ul
                                className={classnames("banners-list", {'clear-ul-space': list.length < 1})}
                                id={`comp_sorter_${currCompIndex}`}>
                                {list.map((item, index) => {
                                    let {img} = item;
                                    return <li key={index} data-id={JSON.stringify(item)}>
                                        <div className="img">
                                            <CloseOutlined className="icon close" onClick={() => {
                                                currComp.list = U.array.remove(list, index);
                                                this.setComp(currComp, currCompIndex);
                                            }}/>
                                            <EditOutlined className="icon edit" onClick={() => {
                                                item.index = index;
                                                item.cindex = currCompIndex;
                                                item.type = currCompKey;
                                                SettingUtils.bannerEdit(item, this.syncBanner);
                                            }}/>
                                            <img src={img} alt={img}/>
                                        </div>
                                        <p style={{marginTop: '8px'}}>跳转链接：{SettingUtils.parseAct(item)}</p>
                                    </li>
                                })}
                            </ul>}

                            {isRecycleCategory &&
                            <ul className={classnames("recycle-category-list", {'clear-ul-space': list.length < 1})}>
                                {list.map((item, index) => {
                                    let {img, category = {}} = item;
                                    return <li key={index} data-id={JSON.stringify(item)}
                                               style={{width: '100%', height: `${index > 0 ? '60px' : '100%'}`}}>
                                        <div style={{
                                            width: '120px',
                                            position: 'relative',
                                            height: `${index > 0 ? '60px' : '120px'}`
                                        }}>
                                            <EditOutlined className="icon edit" onClick={() => {
                                                item.index = index;
                                                item.cindex = currCompIndex;
                                                item.type = currCompKey;
                                                SettingUtils.RecycleCategoryEdit(item, this.syncBanner);
                                            }}/>
                                            <img src={img}
                                                 style={{width: '120px', height: `${index > 0 ? '60px' : '120px'}`}}/>
                                        </div>
                                        <div className='title'>
                                            {category.name}
                                        </div>
                                    </li>
                                })}
                            </ul>}

                            {(isArticle || isGuarantee) &&
                            <ul className={classnames("recycle-category-list", {'clear-ul-space': list.length < 1})}
                                id={`item_sorter_${currCompIndex}`}>
                                {list.map((b, i) => {
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <img src={(b.cover || b.img || b.icon) + '@!120-120'}/>
                                        <div className='title'>
                                            <p className="t">{b.title}</p>
                                            <p className="desc">{b.desc}</p>
                                        </div>
                                        <a className='opt' onClick={() => {
                                            currComp.list = U.array.remove(list, i);
                                            this.setComp(currComp, currCompIndex);
                                        }}>删除</a>
                                    </li>
                                })}

                            </ul>}

                            {(isRecycleFlow) &&
                            <ul className={classnames("banners-list categories", {'clear-ul-space': list.length < 1})}
                                id={`item_sorter_${currCompIndex}`}>
                                {list.map((b, i) => {
                                    return <li key={i} data-id={JSON.stringify(b)}>
                                        <div className='img'><img
                                            src={b.logo || b.icon || b.avatar || (b.imgs && b.imgs[0])}/>
                                            <CloseOutlined className="icon close" onClick={() => {
                                                currComp.list = U.array.remove(list, i);
                                                this.setComp(currComp, currCompIndex);
                                            }}/>
                                        </div>
                                        {(isRecycleFlow) && <p>
                                            {b.txt}
                                        </p>}
                                    </li>
                                })}
                            </ul>}


                        </Card>
                    </div>}
                </div>
            </Card>
        </div>
    }
}