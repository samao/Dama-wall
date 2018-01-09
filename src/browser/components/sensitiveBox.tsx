/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:20:47 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 18:51:45
 */

import * as React from "react";
import { connect } from "react-redux";
import Sensitive from "./sensitive";
import Action, { sensitive, bansReady } from "../actions";
import axios from "axios";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";
import { log, error } from "../../utils/log";

interface SensitiveBoxProps {
	ready: boolean;
	uBans: string[];
	onData: (data: { uBans: string[]; sBans: string[] }) => any;
}

class SensitiveBox extends React.Component<SensitiveBoxProps> {
	constructor(props: any) {
		super(props);
		this.post = this.post.bind(this);
		this.submit = this.submit.bind(this);
	}

	async getBans(): Promise<{ uBans: string[]; sBans: string[] }> {
		const { data } = await axios.get("http://dama.cn:3000/api/word");
		if (isSuccessType(data)) return data.data;
		return { uBans: [], sBans: [] };
	}

	componentWillMount() {
		const { onData, ready } = this.props;
		if (ready) return;
		this.getBans()
			.then(data => {
				onData(data);
			})
			.catch(reason => error(`请求敏感词失败: ${reason}`));
	}

	async post() {
		const bans = this.props.uBans;
		const { data } = await axios.post("http://dama.cn:3000/api/word", {
			word: bans
		});
		if (isSuccessType(data)) return true;
		return false;
	}

	submit() {
		this.post()
			.then(bool => {
				if (bool) log("提交成功");
				else error("提交失败");
			})
			.catch(reason => error("更新失败", reason));
	}

	createBody() {
		return (
			<div className="container-fluid">
				<h4>系统敏感词</h4>
				<Sensitive disabled />
				<hr className="line" />
				<h4>用户自定义敏感词</h4>
				<Sensitive disabled={false} />
				<button className="btn btn-primary pull-right" onClick={this.submit}>
					应用
				</button>
			</div>
		);
	}

	render() {
		const { ready, uBans } = this.props;
		return !ready ? (
			<h2 className="text-center">加载中...</h2>
		) : (
			this.createBody()
		);
	}
}

function stateToProps({ banwords: { data: { uBans }, ready } }: any) {
	return {
		uBans,
		ready
	};
}

function dispatchToProps(dispatch: (action: Action) => any) {
	return {
		onData: (data: { uBans: string[]; sBans: string[] }) => {
			dispatch(bansReady(data));
		}
	};
}

export default connect(stateToProps, dispatchToProps)(SensitiveBox);
