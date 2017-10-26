export const HOST = 'http://dama.cn';

export const secret = "idzeir$";
export const ports:{web:number,ws:number,db:number} = {
    web: 3000,
    ws: 8080,
    db: 27017
}
export const adminPage = [
    {title: '欢迎', template: 'welcome'},
    {title: '导航配置', template: 'nav-manager'},
    {title: '活动管理', template: 'acti-manager'},
    {title: '弹幕表情', template: 'emotion-manager'},
    {title: '用户管理', template: 'user-manager'},
    {title: '敏感词', template: 'filter-manager'}
];