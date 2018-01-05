/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:20:47 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-05 16:41:32
 */

import * as React from "react";
import { connect } from "react-redux";
import Sensitive from "./sensitive";
import Action, { sensitive } from "../actions";
import axios from "axios";
import { SuccessType, FailType, isSuccessType } from "../../utils/feedback";
import { log, error } from "../../utils/log";

class SensitiveBox extends React.Component<{ uBans: string[] }> {
	constructor(props: any) {
		super(props);
		this.post = this.post.bind(this);
		this.submit = this.submit.bind(this);
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

	render() {
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
}

function stateToProps(state: any) {
	return {
		uBans: state.banwords.uBans
	};
}

export default connect(stateToProps)(SensitiveBox);
