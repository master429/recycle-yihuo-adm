let CTYPE = (() => {

    let maxlength = {title: 140, intro: 500};

    let minlength = {title: 1, intro: 1};


    let eidtMaxWidth = 1800;

    let eidtMinWidth = 900;


    let formStyle = {minWidth: eidtMinWidth, maxWidth: eidtMaxWidth, marginTop: '20px'};

    return {

        minprice: 0,
        maxprice: 1000000,

        eidtMaxWidth: 1800,

        eidtMinWidth: 900,

        maxVisitNum: 9999999,

        maxlength: maxlength,

        minlength: minlength,
        pagination: { pageSize: 20 },

        formStyle,

        commonPagination: { showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条` },

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        expirePeriods: [{ key: '1D', label: '一天' },
        { key: '3D', label: '三天' },
        { key: '1W', label: '一周' },
        { key: '1M', label: '一个月' },
        { key: '3M', label: '三个月' },
        { key: '6M', label: '六个月' },
        { key: '1Y', label: '一年' },
        { key: '2Y', label: '两年' },
        { key: '3Y', label: '三年' },
        { key: '5Y', label: '五年' },
        { key: '10Y', label: '十年' }],

        rentPeriods: [{ key: '1D', label: '一天', name: '日租' },
        { key: '1M', label: '一个月', name: '月付' },
        { key: '3M', label: '三个月', name: '季付' },
        { key: '6M', label: '六个月', name: '半年付' },
        { key: '1Y', label: '一年', name: '一年付' }],

        link: {
            admin_admins: { key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员' },
            admin_roles: { key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组' },

            user_users: { key: '/app/user/users', path: '/app/user/users', txt: '用户管理' },
            user_edit: { key: '/app/user/users-edit', path: '/app/user/user-edit', txt: '编辑用户' },

            merchant_edit: { key: '/app/merchant/merchants', path: '/app/merchant/merchants', txt: '商户管理' },
            finance_edit: { key: '/app/finance/finances', path: '/app/finance/finances', txt: '开户&续费' },

            category_edit: { key: '/app/product/categories', path: '/app/product/categories', txt: '分类管理' },

            setting_uis: { key: '/app/setting/uis/:type', path: '/app/setting/uis/1', txt: '首页管理' },
            ui_edit: { key: '/app/setting/ui_edit', path: '/app/setting/ui_edit', txt: '编辑模版' },

            content_articles: { key: '/app/content/articles', path: '/app/content/articles', txt: '文章管理' },

        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5217,
            rectangle_ad: 0.25,
            rectangle_cover: 0.75,
            rectangle_r: 0.4852
        },


        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        },
        dialogItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        },
        shortFormItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 4 },
                sm: { span: 3 }
            }
        },
        longFormItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 3
                }
            }
        },
        file: {
            posters: {
                maxSize: 1024 * 1024
            }
        },
        REGION_PATH: window.location.protocol + '//c1.wakkaa.com/assets/pca-code.json',

        redirectTypes: [{ value: 'NONE', label: '不跳转' }, {
            value: 'LINK',
            label: 'url跳转'
        }, {
            value: 'APARTMENTS', label: '单租列表'
        }, {
            value: 'APARTMENT', label: '单租房屋', withPayload: true
        }, {
            value: 'ROOMS', label: '合租列表'
        }, {
            value: 'ROOM', label: '合租房间', withPayload: true
        }, {
            value: 'ARTICLE', label: '文章单页', withPayload: true
        }],

        colors: ['#f50', '#2db7f5', '#87d068', '#108ee9'],

        tagColor: {
            success: '#52c41a',
            error: '#f50',
            wraning: '#fa8c16',
            processing: '#1890ff'
        },

        qqmapKey: 'LEHBZ-CAIAJ-MKTFI-FRZEA-GMUSJ-XYFSK',             //地图选址

        apartmentImgTabs: [{ key: 'floorPlan', label: '平面图', isRequired: true }, {
            key: 'entrance',
            label: '入户公共',
            isRequired: true
        }, {
            key: 'hall',
            label: '客餐厅',
            isRequired: false
        }, { key: 'kitchen', label: '厨房', isRequired: false }, { key: 'washroom', label: '客卫', isRequired: false }],

        orientations: ['东', '南', '西', '北', '东南', '东北', '西南', '西北'],

        roomTypes: [{ key: 'ROOM', label: '卧室' }, { key: 'HALL', label: '客餐厅' }, {
            key: 'KITCHEN',
            label: '厨房'
        }, { key: 'WASH', label: '卫生间' }],

        apartmentFeatureCodes: [{ label: '一室', key: '1ROOM' }, { label: '二室', key: '2ROOM' }, {
            label: '三室',
            key: '3ROOM'
        }, {
            label: '四室',
            key: '4ROOM'
        }, { label: '五室', key: '5ROOM' },
        { label: '无', key: '0HALL' }, { label: '一厅', key: '1HALL' }, { label: '二厅', key: '2HALL' }, {
            label: '三厅',
            key: '3HALL'
        },
        { label: '无', key: '0KITCHEN' }, { label: '一厨', key: '1KITCHEN' },
        { label: '无', key: '0WASH' }, { label: '一卫', key: '1WASH' }, { label: '二卫', key: '2WASH' }, {
            label: '三卫',
            key: '3WASH'
        }, {
            label: '四卫',
            key: '4WASH'
        }],

        roomStatus: [{ label: '未出租', val: 1, color: '#87d068' }, { label: '已出租', val: 2, color: '#f50' }, {
            label: '配置中',
            val: 3,
            color: '#FFC64B'
        }, {
            label: '下架',
            val: 4, color: '#BBBBBB'
        }],

        rentStatus: [{ label: '出租中', val: 1, color: '#87d068' }, { label: '租期结束', val: 2, color: '#BBBBBB' }, {
            label: '租期中止',
            val: 3,
            color: '#FFC64B'
        }],

        billStatus: [{ label: '未审核', val: 1, color: '#FFC64B' }, { label: '已审核', val: 2, color: '#87d068' }, {
            label: '已废弃',
            val: 3,
            color: '#BBBBBB'
        }]


    };

})();


export default CTYPE;
