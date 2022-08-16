import React from 'react';

import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

class Page extends React.Component {
    render() {
        return (
            <ConfigProvider locale={zhCN} style={{height: '100%'}}>
                {this.props.children}
            </ConfigProvider>



        )

    }
}

export default Page;