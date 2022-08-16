import React from 'react';
import { App, U } from '../../common';
import { message, Select, Spin } from 'antd';
import '../../assets/css/common/common-list.less';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const iconClose = require('../../assets/image/common/btn_close.png');

const configs = [{
    key: 'estate',
    qo: 'estateQo',
    qoKey: 'name',
    api: 'adm/estate/estates',
    defaultLabel: '请输入小区关键词',
    width: '240px'
}, {
    key: 'housekeeper',
    qo: 'housekeeperQo',
    qoKey: 'nameOrMobile',
    api: 'adm/housekeeper/housekeepers',
    defaultLabel: '请输管家入姓名或手机号',
    width: '300px'
}, {
    key: 'user',
    qo: 'userQo',
    qoKey: 'nameOrMobile',
    api: 'adm/user/users',
    defaultLabel: '请输入用户姓名或手机号',
    width: '300px'
}];

export default class SuggestItems extends React.Component {

    static propTypes = {
        type: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        syncItem: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.doFetch = debounce(this.doFetch, 800);
        this.state = {

            type: this.props.type,
            config: configs.find(item => item.key === this.props.type),

            fetching: false,
            list: [],
            item: {},
            itemId: ''
        };
    }

    doFetch = (str) => {
        let { config = {} } = this.state;
        let { qo, qoKey, api } = config;
        if (U.str.isEmail(str)) {
            message.info('请输入搜索内容');
            return;
        }

        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({
            list: [],
            fetching: true
        });

        let obj = {};
        obj[qoKey] = str;
        let param = {};
        param[qo] = JSON.stringify({ ...obj });
        App.api(api, {
            ...param
        }).then((ret) => {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            let { content = [] } = ret;
            this.setState({ list: content, fetching: false });
        });
    };

    renderItem = (type, item) => {
        if (type === 'estate') {
            let { id, imgs = [], name, location = {} } = item;
            let { poiname } = location;
            return <Select.Option key={id}>
                <div className="search-estate-ll">
                    <img className='img' src={imgs[0]} />
                    <div className="name-ll">
                        <p>{name}</p>
                        <p>{poiname}</p>
                    </div>
                </div>
            </Select.Option>;
        } else if (type === 'housekeeper') {
            let { id, avatar, name, mobile } = item;
            return <Select.Option key={id}>
                <div className="search-housekeeper-ll">
                    <img className='img' src={avatar} />
                    <div className="name-ll">
                        <p>{name}</p>
                        <p>{mobile}</p>
                    </div>
                </div>
            </Select.Option>;
        } else if (type === 'user') {
            let { id, name, mobile } = item;
            return <Select.Option key={id}>
                <div className="search-housekeeper-ll">
                    <div className="name-ll">
                        <p>{name}</p>
                        <p>{mobile}</p>
                    </div>
                </div>
            </Select.Option>;
        }
    };

    render() {
        let { type, config = {}, list = [], fetching, itemId, item = {} } = this.state;
        let { placeholder, syncItem } = this.props;

        let label = placeholder || config.defaultLabel;
        if (itemId) {
            if (type === 'estate') {
                label = item.name;
            } else if (type === 'housekeeper') {
                label = item.name + ' - ' + item.mobile;
            } else if (type === 'user') {
                label = item.name + ' - ' + item.mobile;
            }
        }

        return <Select
            suffixIcon={itemId ? <img
                onClick={() => {
                    this.setState({
                        itemId: '',
                        list: []
                    });
                    syncItem({});
                }}
                src={iconClose}
                style={{
                    width: '12px',
                    heigt: '12px'
                }}
            /> : <div />}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
            value={label}
            showSearch={true}
            onSearch={this.doFetch}
            style={{
                width: config.width,
                marginRight: '20px'
            }}
            onChange={(itemId) => {
                let item = list.find(item => item.id === itemId);
                if (item) {
                    this.setState({ item, itemId, fetching: false });
                    syncItem(item);
                }
            }}>
            {list.length > 0 && list.map((item) => {
                return this.renderItem(type, item);
            })}
        </Select>;
    }
}


