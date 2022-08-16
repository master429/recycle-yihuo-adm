import React from 'react'
import '../assets/css/common-component.less'
import PropTypes from 'prop-types';

class CrossTitle extends React.Component {

    static propTypes = {
        title: PropTypes.string
    };

    render() {
        return <div className="cross-title">
            <div className='block'>
                <div className='title'>{this.props.title}</div>
            </div>
        </div>
    }
}


export {CrossTitle}