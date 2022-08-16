import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../assets/css/home/home.less';
import { Card, Col, Row } from 'antd';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        let { count, validThru } = this.state;
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />

                <Card>
                    <div className='home-page'>

                        <Row gutter={16}>
                            <Col span={12}>
                                商户套餐即将到期
                            </Col>
                        </Row>

                    </div>
                </Card>

            </div>
        );
    }
}

export default Dashboard;
