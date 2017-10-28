import { Board } from '../config/conf';

export async function obtain(board: string): Promise<any> {
    switch(board) {
        case Board.WELCOME:
        case Board.ACTI:
        default:
            return Promise.resolve({title: board, list: ['第一秒','老二','括号']})
    }
}