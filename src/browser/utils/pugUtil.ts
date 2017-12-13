/*
 * @Author: iDzeir 
 * @Date: 2017-11-08 14:20:35 
 * @Last Modified by: iDzeir
 * @Last Modified time: 2017-12-13 17:15:28
 */

import * as $ from 'jquery';
import { join } from 'path';

export function loadPug(container: JQuery<HTMLElement>, url: string, data?: any): void {
    const template = join('template',url);
    $.get(template).done(text => {
        container.html(text);
    })
}