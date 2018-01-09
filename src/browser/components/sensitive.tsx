/*
 * @Author: iDzeir 
 * @Date: 2018-01-04 17:25:59 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2018-01-08 18:05:31
 */
import * as React from "react";
import { connect } from "react-redux";

import Action, { sensitive } from "../actions";
import Word from "./word";

interface SensitiveDispatch {
	add: (word: string) => any;
	pop: () => void;
}

export interface SensitiveProps extends SensitiveDispatch {
	words: { sBans: string[]; uBans: string[] };
	disabled: boolean;
}

//键盘码
enum KEY {
	//删除
	DELETE = 8,
	//回车
	ENTER = 13,
	//逗号
	COMMA = 188
}

class Sensitive extends React.Component<SensitiveProps> {
	private input: HTMLInputElement | null;

	constructor(props: SensitiveProps) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	onKeyUp({ keyCode }: React.KeyboardEvent<HTMLInputElement>) {
		if (this.input && (keyCode === KEY.COMMA || keyCode === KEY.ENTER)) {
			const word = this.input.value.trim();
			if (word.length === 0) return;
			const tag =
				keyCode === KEY.COMMA &&
				[",", "，"].indexOf(word.charAt(word.length - 1)) != -1
					? word.slice(0, -1)
					: word;
			this.input.value = "";
			//生成tag
			const { add } = this.props;
			add(tag);
		}
	}

	onKeyDown({ keyCode }: React.KeyboardEvent<HTMLInputElement>) {
		if (this.input && keyCode === KEY.DELETE) {
			const word = this.input.value.trim();
			if (word.length === 0) {
				//删除前面tag
				const { pop } = this.props;
				pop();
			}
		}
	}

	render() {
		const { disabled } = this.props;
		const words = disabled ? this.props.words.sBans : this.props.words.uBans;
		return (
			<fieldset disabled={disabled}>
				{disabled && words.length === 0 ? (
					<h2 className="text-center">暂无数据</h2>
				) : (
					<div className="filter-box">
						{words.map(e => {
							return <Word disabled={disabled} word={e} />;
						})}
						{!disabled ? (
							<input
								ref={input => (this.input = input)}
								onKeyUp={this.onKeyUp}
								onKeyDown={this.onKeyDown}
								maxLength={5}
							/>
						) : null}
					</div>
				)}
			</fieldset>
		);
	}
}

function stateToProps({ banwords: { data: words } }: any) {
	return {
		words
	};
}

function dispatchToProps(dispatch: (action: Action) => any) {
	return {
		add: (word: string) => {
			dispatch(sensitive.add(word));
		},
		pop: () => {
			dispatch(sensitive.pop);
		}
	};
}

export default connect(stateToProps, dispatchToProps)(Sensitive);
