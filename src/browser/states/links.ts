export enum LinkTo {
    ACT,
    FILTER,
    ACCOUNT,
}

export interface Link {
    label: string;
    to: LinkTo;
}
export const links: Link[] = [
    {label:'活动中心', to: LinkTo.ACT},
    {label:'敏感词设置', to: LinkTo.FILTER},
    {label:'账号管理', to: LinkTo.ACCOUNT}
]