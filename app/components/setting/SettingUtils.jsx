import React from 'react';
import { Utils } from "../../common";

import {
    BannerEdit, MerchantPicker, RecycleCategoryEdit, CategoryPicker, ArticlePicker, FlowEdit, GuaranteeEdit
} from './SettingComps';

let SettingUtils = {
    bannerEdit: (banner, syncBanner) => {
        Utils.common.renderReactDOM(<BannerEdit banner={banner} syncBanner={syncBanner} />);
    },
    merchantPicker: (merchant, syncItems) => {
        Utils.common.renderReactDOM(<MerchantPicker merchant={merchant} syncItems={syncItems} />);
    },
    RecycleCategoryEdit: (recyCate, syncItem) => {
        Utils.common.renderReactDOM(<RecycleCategoryEdit recyCate={recyCate} syncItem={syncItem} />);
    },
    articlePicker: (items, syncItems) => {
        Utils.common.renderReactDOM(<ArticlePicker items={items} syncItems={syncItems} />);
    },
    recycleFlow: (flow, syncBanner) => {
        Utils.common.renderReactDOM(<FlowEdit flow={flow} syncBanner={syncBanner} />);
    },
    guaranteeEdit: (guarantee, syncBanner) => {
        Utils.common.renderReactDOM(<GuaranteeEdit guarantee={guarantee} syncBanner={syncBanner} />);
    },
    UITypes: [{ type: 1, label: '首页', disabled: false }, { type: 2, label: '商城首页', disabled: false }],
    UIComponentTypes: [
        {
            "key": "AD",
            "name": "广告位"
        },
        {
            "key": "BANNER",
            "name": "轮播图"
        },
        {
            "key": "SLOGAN",
            "name": "宣言"
        },
        {
            "key": "RECYCLE_CATEGORY",
            "name": "回收分类"
        },
        {
            "key": "RECYCLE_FLOW",
            "name": "回收流程"
        },
        {
            "key": "ARTICLE",
            "name": "回收攻略"
        },
        {
            "key": "GUARANTEE",
            "name": "为什么选择我们"
        },


    ],
    acts: [
        {
            "key": "NONE",
            "name": "无"
        },
        {
            "key": "LINK",
            "name": "链接"
        },
        {
            "key": "MERCHANT",
            "name": "商户"
        },
        // {
        //     "key": "PRODUCT",
        //     "name": "商品详细"
        // }
    ],
    parseAct: (item) => {
        let act = '';
        if (item.act === 'NONE') {
            act = '不跳转';
        } else if (item.act === 'LINK') {
            act = '跳转链接';
        } else {
            if (item.payload) {
                act = item.payload.title
            } else {
                act = (SettingUtils.acts.find(it => it.key === item.act) || {}).name;
            }
        }
        return act;
    }
}
export default SettingUtils;