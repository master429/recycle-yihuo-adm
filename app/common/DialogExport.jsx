import React from 'react';
import {message, Modal, Progress} from 'antd';
import '../assets/css/common/common-export.less';
import {App, Utils} from "./index";

const id_div = 'div-dialog-export';

export default class DialogExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            api_query: this.props.api_query,
            suffix: this.props.suffix
        };
    }

    componentDidMount() {
        this.queryTask();
    }

    queryTask = () => {
        let {task, api_query} = this.state;
        App.api(api_query, {id: task.id, secret: task.secret}).then((t) => {

            task.progress = t.progress;
            task.status = t.status;

            let status = t.status;
            if (status === 1) {
                setTimeout(() => {
                    this.queryTask();
                }, 1000);
            } else if (status === 2) {
                this.props.loadData && this.props.loadData();
                message.success('请下载文件');
                task.progress = 100;
                task.output = t.output;
            } else if (status === 3) {
                message.error('导出失败');
            }

            this.setState({task});
        });
    };

    render() {

        let {task, suffix = 'excel'} = this.state;

        let name = suffix === 'excel' ? '表格' : '日志';

        return <Modal title={`导入${name}`}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'350px'}
                      onCancel={() => Utils.common.closeModalContainer(id_div)}
                      footer={null}>
            <div className='common-modal-export'>
                {task.status === 1 && <Progress type="circle" percent={task.progress}/>}
                {task.status === 2 && <div className={`i-${suffix}`}/>}
                {task.status === 3 && <Progress type="circle" percent={task.progress} status="exception"/>}

                {task.status === 1 && <div className='tip'>系统正在生成{name}...</div>}
                {task.status === 2 &&
                <a className='tip download' download href={task.output} target='blank'>请点击下载{name}</a>}
                {task.status === 3 && <div className='tip'>系统生成{name}失败！</div>}
            </div>

        </Modal>;


    }
}
