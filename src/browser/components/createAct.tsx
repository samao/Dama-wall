import * as React from 'react';
import { connect } from 'react-redux';

import { createAct } from '../actions';

class CreateAct extends React.Component<{onCreate: any}> {
    
    private roomInput: HTMLInputElement|null;
    private titleInput: HTMLInputElement|null;
    private desInput: HTMLTextAreaElement|null;


    onSubmit(){
        const {onCreate} = this.props;
        //数据校验
        console.log('去他们的提交了')
    }

    render() {
        return (
            <form className="form-horizontal" role="form" id="create-act" onSubmit={e => {
                    e.preventDefault();
                    this.onSubmit();
                }}>
                <div className="form-group">
                    <label htmlFor="aid" className="col-sm-2 control-label">活动名称</label>
                    <div className="col-sm-10">
                        <input ref={ref => {this.roomInput = ref; this.roomInput && this.roomInput.focus()}} id="aid" type="text" placeholder="输入活动名称" required className="form-control"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="atitle" className="col-sm-2 control-label">活动标题</label>
                    <div className="col-sm-10">
                        <input ref={ref => this.titleInput = ref} id="atitle" type="text" placeholder="活动标题" className="form-control"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="ades" className="col-sm-2 control-label">活动描述</label>
                    <div className="col-sm-10">
                        <textarea ref={ref => this.desInput = ref} id='adescription' name="ades" className="form-control" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <div className="btns">
                            <button id="cancel" className="btn btn-danger">取消</button>
                            <button id="submit" className="btn btn-primary">创建</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}



export default connect(null,dispatch => {
    return {
        onCreate: () => {
            dispatch(createAct)
        }
    }
})(CreateAct);