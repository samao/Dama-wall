import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { LinkTo } from '../states/links';
import { createAct, linkTo } from '../actions';
import { hasTag } from '../utils/htmlParser';
import { error,log } from '../../utils/log';
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

interface CreateActProps {
    onCreate: any;
    onBack: any;
    disabled: boolean;
    created: any;
    [index: string]: any;
}

class CreateAct extends React.Component<CreateActProps> {
    
    private roomInput: HTMLInputElement|null;
    private titleInput: HTMLInputElement|null;
    private desInput: HTMLTextAreaElement|null;

    onSubmit() {
        if(this.roomInput && this.titleInput && this.desInput) {
            const { onCreate, onBack, created } = this.props;
            const aid = this.roomInput.value;
            const reqData = {
                title: this.titleInput.value,
                description: this.desInput.value
            }
            if(aid.length >= 5 && !hasTag(aid)) {
                onCreate();
                axios.post(`http://dama.cn:3000/api/activity/${aid}`,reqData).then(({data}:{data:SuccessType|FailType}) => {
                    if(isSuccessType(data)){
                        log('创建成功');
                        created({...reqData, rid: aid});
                        onBack();
                    }else{
                        error(data.reason)
                    }
                })
            }else{
                error('输入活动名称包含敏感内容');
            }
        }
    }

    render() {
        const { disabled, onBack } = this.props;
        return (
            <form className="form-horizontal" role="form" id="create-act" onSubmit={e => {
                    e.preventDefault();
                }}>
                <fieldset disabled={disabled}>
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
                            <textarea ref={ref => this.desInput = ref} id='adescription' rows={5} name="ades" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="btns">
                                <button id="cancel" className="btn btn-danger" onClick={() => {
                                    onBack();
                                }}>取消</button>
                                <button id="submit" className="btn btn-primary" onClick={() => {
                                    this.onSubmit();
                                }}>创建</button>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
        )
    }
}



export default connect((state: any) => {
    return {
        disabled: state.createAct
    }
},dispatch => {
    return {
        onCreate: () => {
            dispatch(createAct.create)
        },
        onBack: () => {
            dispatch(linkTo(LinkTo.ACT))
        },
        created: (data: any) => {
            console.log({...createAct.success, data})
            dispatch({...createAct.success, data})
        }
    }
})(CreateAct);