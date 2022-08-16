import React from 'react';
import {Spin} from 'antd';

export default function Spinning(WrapContent) {

    return class extends React.Component {
        state = {
            loading: false,
        };

        startLoading = () => {
            this.setState({
                loading: true,
            })
        };

        stopLoading = () => {
            setTimeout(() => {
                this.setState({
                    loading: false,
                })
            }, 100);

        };

        render() {
            return <Spin spinning={this.state.loading}>
                <WrapContent
                    startLoading={this.startLoading}
                    stopLoading={this.stopLoading}
                    {...this.props}/>
            </Spin>
        }
    }
}
