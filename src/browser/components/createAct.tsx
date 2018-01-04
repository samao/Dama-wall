/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 10:24:01 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2018-01-04 10:24:01 
 */
import * as React from "react";
import axios from "axios";
import { connect } from "react-redux";

import { LinkTo } from "../states/links";
import Action, { act, linkTo } from "../actions";
import { hasTag } from "../utils/htmlParser";
import { error, log } from "../../utils/log";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";

interface CreateActDispatch {
	onCreate: () => any;
	onBack: () => any;
	created: (data: any) => any;
}

interface CreateActProps extends CreateActDispatch {
	disabled: boolean;
	[index: string]: any;
}

class CreateAct extends React.Component<CreateActProps> {
	constructor(
		props: CreateActProps,
		context: any,
		readonly minLen: number = 5,
		readonly maxLen: number = 12,
		private roomInput: HTMLInputElement | null = null,
		private titleInput: HTMLInputElement | null = null,
		private desInput: HTMLTextAreaElement | null = null
	) {
		super(props, context);

		this.onSubmit = this.onSubmit.bind(this);
	}

	async createAct(url: string, reqBody: any = {}) {
		const { data } = await axios.post(url, reqBody);
		return data;
	}

	onSubmit() {
		if (this.roomInput && this.titleInput && this.desInput) {
			const { onCreate, onBack, created } = this.props;
			const aid = this.roomInput.value;
			const reqData = {
				title: this.titleInput.value,
				description: this.desInput.value
			};

			if (!hasTag(aid)) {
				if (aid.length < this.minLen) {
					error("输入活动名称太短");
				} else if (aid.length > this.maxLen) {
					error("输入活动名称太长");
				} else {
					onCreate();
					this.createAct(
						`http://dama.cn:3000/api/activity/${aid}`,
						reqData
					).then((data: SuccessType | FailType) => {
						if (isSuccessType(data)) {
							log("创建成功");
							created({ ...reqData, rid: aid });
							onBack();
						} else {
							error(`创建活动错误：${data.reason}`);
						}
					});
				}
			} else {
				error("输入活动名称包含敏感内容");
			}
		}
	}

	render() {
		const { disabled, onBack } = this.props;
		return (
			<form
				role="form"
				id="create-act"
				className="form-horizontal"
				onSubmit={e => e.preventDefault()}
			>
				<fieldset disabled={disabled}>
					<div className="form-group">
						<label htmlFor="aid" className="col-sm-2 control-label">
							活动名称
						</label>
						<div className="col-sm-10">
							<input
								id="aid"
								type="text"
								placeholder="输入活动名称"
								required
								className="form-control"
								ref={input => {
									input && input.focus();
									this.roomInput = input;
								}}
								maxLength={this.maxLen}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="atitle" className="col-sm-2 control-label">
							活动标题
						</label>
						<div className="col-sm-10">
							<input
								id="atitle"
								type="text"
								placeholder="输入活动标题"
								className="form-control"
								required
								ref={input => (this.titleInput = input)}
							/>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="ades" className="col-sm-2 control-label">
							活动描述
						</label>
						<div className="col-sm-10">
							<textarea
								id="adescription"
								rows={5}
								name="ades"
								className="form-control"
								ref={textarea => (this.desInput = textarea)}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<div className="btns">
								<button id="cancel" className="btn btn-danger" onClick={onBack}>
									取消
								</button>
								<button
									id="submit"
									className="btn btn-primary"
									onClick={this.onSubmit}
								>
									创建
								</button>
							</div>
						</div>
					</div>
				</fieldset>
			</form>
		);
	}
}

function stateToProps(state: any): { disabled: boolean } {
	return { disabled: state.createAct };
}

function dispatchToProps(dispatch: (action: Action) => any): CreateActDispatch {
	return {
		onCreate: () => {
			dispatch(act.create);
		},
		onBack: () => {
			dispatch(linkTo(LinkTo.ACT));
		},
		created: (data: any) => {
			dispatch({ ...act.success, data });
		}
	};
}

export default connect(stateToProps, dispatchToProps)(CreateAct);
