import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import {App, CTYPE, Utils, U} from '../../common';
import {Link} from 'react-router-dom';
import {Card, Button, Form, Input, TreeSelect, Cascader, message} from 'antd';
import {PosterEdit} from "../common/PosterEdit";
import {SaveOutlined, EnvironmentOutlined} from '@ant-design/icons';

const {SHOW_PARENT} = TreeSelect;
export default class MerchantEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            merchant: {},
            regions: [],
            categories: [],
        }
    }

    componentDidMount() {
        this.localData();
        Utils.addr.loadRegion(this);
        this.loadCategories();
    }

    localData = () => {
        let {id} = this.state;
        if (id !== 0) {
            App.api("adm/merchant/merchant", {id}).then((res) => {
                this.setState({merchant: res});
                this.transform1();
            });
        }
    }

    transform1 = () => {
        let { merchant } = this.state;
        let { scope } = merchant
        let temporary = [];

        scope.length > 0 && scope.map((item) => {
            if (U.str.endsWith(item, "0000")) {
                item = item.substr(0, 2);
            }
            if (U.str.endsWith(item, "00")) {
                item = item.substr(0, 4);
            }
            temporary.push(item);
        })

        merchant.scope = temporary;

    }

    loadCategories = () => {
        App.api('adm/category/merchant_categories').then((categories) => {
            this.setState({
                categories,
                vals: categories
            });
        });
    }

    initCategories = () => {
        let {categories = []} = this.state;
        categories.map((item1, index1) => {
            let {children = []} = item1;
            item1.value = item1.sequence;
            item1.title = item1.name;
            item1.disabled = !(item1.status && item1.status === 1);
            (children && children.length > 0) && children.map((item2, index2) => {
                let {children = []} = item2;
                item2.value = item2.sequence;
                item2.title = item2.name;
                item2.disabled = !(item2.status && item2.status === 1);
                (children && children.length > 0) && children.map((item3, index3) => {
                    item3.value = item3.sequence;
                    item3.title = item3.status && item3.name;
                    item3.disabled = item3.status !== 1;
                });
            });
        });
    }


    onSave = () => {
        let {id, merchant = {}} = this.state;
        let {name, logo, mobile, location = {},scope=[]} = merchant;
        let {code, detail, lat} = location;

        let create = id === 0;

        let _scope = [];
        scope.map((item) => {

            U.str.endsWith
            if (item.length === 2) {
                item = item + "0000";
            }
            if (item.length === 4) {
                item += "00";
            }
            _scope.push(item)
        })
        merchant.scope = _scope;

        if (U.str.isEmpty(name)) {
            message.warn('请填写商户名称');
            return;
        }
        if (U.str.isEmpty(logo)) {
            message.warn('请上传店铺LOGO');
            return;
        }
        if (U.str.isEmpty(mobile)) {
            message.warn('请输入店铺联系方式');
            return;
        }
        if (U.str.isEmpty(code)) {
            message.warn('请选择地区');
            return;
        }
        if (U.str.isEmpty(lat)) {
            message.warn('请使用地图选址');
            return;
        }
        if (U.str.isEmpty(detail)) {
            message.warn('请输入详细地址');
            return;
        }
        App.api('adm/merchant/save', {
            merchant: JSON.stringify(merchant),
        }).then(() => {
            message.success(create ? "新建商户成功" : "商户信息更新成功");
            App.go('/app/merchant/merchants');
        });
    }

    syncLocation = (loc, _code) => {

        let {merchant = {}} = this.state;
        let {latlng = {}, poiaddress, poiname, code} = loc;

        let {location = {}} = merchant;

        location = {
            ...location,
            lat: latlng.lat,
            lng: latlng.lng,
            poiaddress, poiname, code: _code || code
        };

        this.setState({
            merchant: {
                ...merchant,
                location
            }
        });
    };

    modMerchant = (field, val) => {
        let {merchant = {}} = this.state;
        merchant[field] = val;
        this.setState({merchant});
    }

    checked = (name) => {
        return name;
    }

    render() {
        let {id, merchant = {}, regions = [], categories = [],} = this.state;
        let {name, logo, mobile, location = {}, businessScope = [],scope=[]} = merchant;

        let {code, detail, poiaddress = '', poiname = ''} = location;

        let codes = Utils.addr.getCodes(code);

        let _regions = JSON.parse(JSON.stringify(regions));

        _regions.map((item) => {
            let { children = [] } = item;
            children.map((item) => {
                delete item.children
            })
        })

        this.initCategories();

        return <div className="common-edit-page">
            <BreadcrumbCustom first={<Link to={`/app/merchant/merchants`}>{CTYPE.link.merchant_edit.txt}</Link>}
                              second={id === 0 ? '创建商户' : '编辑商户'}/>
            <Card extra={<Button type="primary" icon={<SaveOutlined/>} onClick={this.onSave}
            >保存</Button>}>
                <Form>
                    <Form.Item
                        {...CTYPE.formItemLayout}
                        label="商户名称" required={true}>
                        <Input placeholder="请填入商户名称" value={name} onChange={(e) => {
                            this.modMerchant('name', e.target.value);
                        }}/>
                    </Form.Item>
                    <PosterEdit title='LOGO' required={true} type='s' img={logo} syncPoster={(url) => {
                        this.modMerchant('logo', url);
                    }}/>
                    <Form.Item label="经营范围"
                               {...CTYPE.formItemLayout}
                               required={true}>
                        <TreeSelect placeholder="请选择经营范围"
                                    treeDefaultExpandAll={false}
                                    value={[...businessScope]}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    treeData={categories}
                                    onChange={(value) => {
                                        this.setState({
                                            merchant: {
                                                ...merchant,
                                                businessScope: value
                                            }
                                        });
                                    }}>
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item label="商户联系方式" required={true} labelCol={{span: 3}} wrapperCol={{span: 4}}>
                        <Input placeholder="请填写手机号" value={mobile} onChange={(e) => {
                            this.modMerchant('mobile', e.target.value);
                        }}/>
                    </Form.Item>
                    <Form.Item required={true}
                               {...CTYPE.formItemLayout}
                               label='地图选址'>
                        <Input value={poiaddress + '' + poiname} disabled={true}
                               addonAfter={<EnvironmentOutlined onClick={() => {
                                   Utils.common.locationPicker(this.syncLocation);
                               }}/>}/>
                    </Form.Item>
                    <Form.Item required={true}
                               {...CTYPE.formItemLayout}
                               label='区域'>
                        <Cascader style={{width: '300px'}}
                                  value={codes}
                                  options={regions}
                                  placeholder="请选择省市区"
                                  onChange={(codes) => {
                                      location.code = codes[2];
                                      this.setState({
                                          merchant: {...merchant, location}
                                      });
                                  }}/>
                    </Form.Item>
                    <Form.Item
                        required={true}
                        {...CTYPE.formItemLayout} label='代理区域'>

                        <TreeSelect style={{ width: 300 }}
                                    treeData={_regions}
                                    treeDefaultExpandAll={false}
                                    value={scope}
                                    treeCheckable={true}
                                    showCheckedStrategy={SHOW_PARENT}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="请选择区域"
                                    allowClear
                                    onChange={(v) => {
                                        this.setState({
                                            merchant: {
                                                ...merchant,
                                                scope: v,
                                            }
                                        })
                                    }} />

                    </Form.Item>
                    <Form.Item required={true}
                               {...CTYPE.formItemLayout}
                               label='详细地址'>
                        <Input value={detail} onChange={(e) => {
                            location.detail = e.target.value;
                            this.setState({
                                merchant: {
                                    ...merchant,
                                    location
                                }
                            });
                        }}/>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    }
}