import React from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

class BreadcrumbCustom extends React.Component {
    static propTypes = {
        first: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
        second: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
        third: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
    };

    render() {
        const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        const third = <Breadcrumb.Item>{this.props.third}</Breadcrumb.Item> || '';
        return (
            <Breadcrumb>
                <Breadcrumb.Item><Link to={'/app/dashboard/index'}>首页</Link></Breadcrumb.Item>
                {first}
                {second}
                {third}
            </Breadcrumb>
        )
    }
}

export default BreadcrumbCustom;
