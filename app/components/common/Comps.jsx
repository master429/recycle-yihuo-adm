import React from 'react';
import '../../assets/css/common/comps.less';
import { Carousel } from 'antd';

class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.banners,
            key: this.props.typeKey,
        }
    }

    render() {
        let { key } = this.state;

        console.log(key);
        let isBanner = key == 'BANNER';
        let isAd = key == 'AD';
        let list = this.props.banners;

        return <div className="carousel">
            {isBanner && <div className="my-carousel">
                {list.length > 0 && <Carousel autoplay={true}>
                    {list.map((item, index) => {
                        let { img, act, payload } = item;
                        return <img src={img} key={index} />
                    })}
                </Carousel>}
                {list.length < 2 && <img src={require('../../assets/image/common/icon_upload_img.png')} />}
            </div>}
            {isAd && <div className="my-ad">
                {list.length > 0 ? list.map((it, i) => {
                    let { img, act, payload } = it;
                    return <img src={img} key={i} />
                })
                    : <span>请添加广告图片</span>}
            </div>}
        </div>
    }
}

export {
    Banner,
}