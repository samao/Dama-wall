/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 14:20:35 
 * @Last Modified by:   iDzeir 
 * @Last Modified time: 2017-11-08 14:20:35 
 */

import * as $ from 'jquery';

export function loadPug(container: JQuery<HTMLElement>, url: string, data?: any): void {
    const template = `/template/${url}`;
    $.get(template).done(text => {
        container.html(text);
    })
}