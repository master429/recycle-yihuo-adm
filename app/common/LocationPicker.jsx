import React from 'react';
import {Modal} from 'antd';
import {App, CTYPE, Utils} from './index';

const id_div = 'div-dialog-location-picker';

export default class LocationPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        let picker = document.getElementById('location_picker');
        if (picker) {
            window.addEventListener('message', (event) => {

                let loc = event.data;
                console.log(loc);
                if (loc && loc.module === 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    let {latlng = {}} = loc;

                    App.api(`/common/geocoder`, {
                        lat: latlng.lat,
                        lng: latlng.lng,
                        key: CTYPE.qqmapKey
                    }).then((ret) => {
                        let {result = {}} = ret;
                        let {ad_info = {}} = result;
                        let {adcode} = ad_info;
                        this.props.syncLocation(loc, adcode);
                    }).catch(() => {
                        this.props.syncLocation(loc);
                    });
                    this.close();
                }
            }, false);
        } else {
            setTimeout(() => this.load(), 1000);
        }
    };

    close = () => {
        Utils.common.closeModalContainer(id_div);
    };

    render() {
        return <Modal title="腾讯地图拾取器"
                      width='600px'
                      height='700px'
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      footer={null}
                      onCancel={this.close}>

            <iframe id="location_picker" width="100%" frameBorder="0" scrolling="no"
                    src={`//apis.map.qq.com/tools/locpicker?search=1&type=1&key=${CTYPE.qqmapKey}&referer=ysmz_picker`}
                    style={{width: '100%', height: '550px', border: 'none'}}>
            </iframe>

        </Modal>;
    }
}
