import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { App, CTYPE, Utils, U } from '../../common';
import { Card, Tabs, Button, Table, Row, Col, Dropdown, Menu, Modal, Form, Input, message } from 'antd';
import RenewBills from './RenewBills';

export default class Finances extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renewStatus: [],
            renews: [],
            status: 0,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0
            },
            sortPropertyName: 'id',
            sortAscending: false,
        }
    }

    componentDidMount() {
        this.loadStatus();
        this.loadRenews();
    }

    loadStatus = () => {
        App.api('adm/merchant/renew_status').then(result => {
            this.setState({ renewStatus: result });
        })
    }
    loadRenews = () => {
        this.setState({ loading: true });
        let { pagination = {}, sortPropertyName, sortAscending, status } = this.state;
        if (status === 0) {
            status = null;
        }

        App.api('adm/merchant/renews', {
            renewQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                sortPropertyName,
                sortAscending,
                status,
            })
        }).then(result => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                renews: content,
                pagination,
                loading: false
            });
        });
    }

    tabClick = (v) => {
        this.setState({
            status: parseInt(v),
            renews: []
        }, () => {
            this.loadRenews();
        });

    }

    render() {
        let { renewStatus = [], renews = [], status, loading, pagination = {} } = this.state;
        return <div className="finances=page">
            <BreadcrumbCustom first={CTYPE.link.finance_edit.txt} />
            <Card>
                <Tabs onChange={this.tabClick} activeKey={status.toString()}>
                    {renewStatus.map((item, index) => {
                        return <Tabs.TabPane tab={item.val} key={item.key} />;
                    })}
                </Tabs>
                <RenewBills renews={renews} loading={loading} status={status} loadRenews={this.loadRenews} pagination={pagination} />
            </Card>
        </div>
    }
}