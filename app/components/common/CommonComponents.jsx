import React from 'react'
import PropTypes from 'prop-types';
import {InputNumber, Select} from 'antd';
import U from "../../common/U";
import CTYPE from "../../common/CTYPE";

const Option = Select.Option;

class CommonPeriodSelector extends React.Component {

    static propTypes = {
        period: PropTypes.string.isRequired,
        periods: PropTypes.array.isRequired,
        maxPeriod: PropTypes.string,
        syncPeriod: PropTypes.func.isRequired,
        withoutManual: PropTypes.bool,
        withNull: PropTypes.bool,
        withForever: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            period: this.props.period,
            periods: this.props.periods,
            maxPeriod: this.props.maxPeriod,
            withoutManual: this.props.withoutManual,
            withNull: this.props.withNull,
            withForever: this.props.withForever,

            num: 1,
            unit: 'W',
            maxNums: [],
            disableYear: false,
            manual: false
        }
    }

    componentWillReceiveProps(newProps) {
        let {period} = this.state.period;
        let newPeriod = newProps.period;
        if (newPeriod === period) {
            return;
        }
        this.setState({
            period: newProps.period
        }, () => {
            this.init();
            this.setMaxNum();
        })
    }

    componentDidMount() {
        this.init();
        this.setMaxNum();
    }

    syncPeriod = () => {
        let {period, manual, num, unit, withNull, withForever} = this.state;

        let p = manual ? num + unit : period;
        if (withNull && p.charAt(0) === '0') {
            p = '';
        }
        if (withForever && p.charAt(0) === '0') {
            p = '0Y';
        }
        this.props.syncPeriod(p);
    };

    setPeriod = (period) => {
        if (period === '-1') {
            this.setState({manual: true, num: 1, unit: 'W'}, this.syncPeriod)
        } else {
            this.setState({period}, this.syncPeriod);
        }
    };

    init = () => {
        let {periods, period, num, unit, manual, withNull, withForever} = this.state;

        if (withNull) {
            //未传入，传入1S时转化本地0N
            if (U.str.isEmpty(period) || period === '1S' || period === '0N') {
                period = '0N';
                manual = false;
            }
        }

        //约定0Y为永久，但是后期传入0开头的一些时间段，需兼容
        if (withForever) {
            if (period.length === 2 && period.charAt(0) === '0') {
                period = '0Y';
                manual = false;
            }
        }

        if (U.str.isNotEmpty(period) && period.length > 1) {
            if (!manual) {
                if (periods.find(p => p.key === period)) {
                    manual = false;
                } else {
                    manual = true;
                }
            }
            if (manual) {
                let length = period.length;
                unit = period.substring(length - 1);
                num = parseInt(period.substring(0, length - 1));
            }
        }
        this.setState({period, num, unit, manual});
    };

    //TODO 此方法与后台同步，仅限以下情景，如有变更，需同步
    // memberGrades max 200Y, prelinkPeriod,protectionPeriod 1M, question.expireIn 1Y
    setMaxNum = () => {
        let {maxPeriod} = this.state;
        if (maxPeriod) {
            if (U.str.isNotEmpty(maxPeriod) || maxPeriod.length > 1) {
                let length = maxPeriod.length;
                let _unit = maxPeriod.substring(length - 1);
                let _num = parseInt(maxPeriod.substring(0, length - 1));
                let disableYear = false;
                let maxNums = {
                    'I': CTYPE.maxprice,
                    'H': CTYPE.maxprice,
                    'D': CTYPE.maxprice,
                    'W': CTYPE.maxprice,
                    'M': CTYPE.maxprice,
                    'Y': CTYPE.maxprice
                };
                switch (_unit) {
                    case 'M':
                        maxNums = {
                            'I': _num * 60 * 24 * 30,
                            'H': _num * 24 * 30,
                            'D': _num * 30,
                            'W': _num * 4,
                            'M': _num,
                            'Y': 0
                        };
                        disableYear = true;
                        break;
                    case 'Y':
                        maxNums = {
                            'I': _num * 60 * 24 * 365,
                            'H': _num * 24 * 365,
                            'D': _num * 365,
                            'W': _num * 53,
                            'M': _num * 12,
                            'Y': _num
                        };
                        break;
                }
                this.setState({maxNums, disableYear});
            }
        }
    };

    render() {

        let {period, periods, manual, num, unit, maxNums = [], disableYear, withoutManual} = this.state;

        return <div>

            {!manual && <Select value={period} style={{width: 100, float: 'left'}} onChange={v => {
                this.setPeriod(v);
            }}>
                {periods.map((u) => {
                    return <Option key={u.key}>{u.label}</Option>
                })}
                {!withoutManual && <Option key='-1'>自定义</Option>}
            </Select>}

            {manual && <div>
                <InputNumber
                    precision={0} value={parseInt(num)}
                    min={0}
                    max={maxNums[unit]}
                    onChange={(v) => {
                        if (U.str.isEmpty(v)) {
                            v = 1;
                        }
                        if (/^\d+$/.test(v)) {
                            this.setState({num: parseInt(v)}, this.syncPeriod);
                        }
                    }}
                    style={{marginRight: 10, float: 'left'}}
                    placeholder=""/>
                <Select
                    value={unit}
                    style={{width: 80, float: 'left'}}
                    onChange={(v) => {
                        this.setState({unit: v}, this.syncPeriod);
                    }}>
                    <Option value="I">分钟</Option>
                    <Option value="H">小时</Option>
                    <Option value="D">天</Option>
                    <Option value="W">周</Option>
                    <Option value="M">个月</Option>
                    <Option value="Y" disabled={disableYear}>年</Option>

                </Select>
            </div>}
        </div>
    }
}

export {CommonPeriodSelector}
