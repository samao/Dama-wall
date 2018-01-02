import { combineReducers } from "redux";

const links = [
    {label:'活动中心',to:'0'},
    {label:'敏感词设置',to:'1'},
    {label:'账号管理',to:'2'}
]

function navlinks(state:{} = links,action:{}): {} {
    return state
}

function rooms(state:{} = {}, action:{}):{} {
    return state;
}

function views(state:{} = {} ,action: {}): {} {
    return {};
}

export default combineReducers({ navlinks, rooms, views })