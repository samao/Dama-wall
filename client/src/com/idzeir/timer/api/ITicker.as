/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Jun 16, 2015 10:44:56 AM			
 * ===================================
 */

package com.idzeir.timer.api
{
	/**
	 * 计时器接口
	 */	
	public interface ITicker
	{
		/**
		 * 增加计时器
		 * @param delay 延迟时间
		 * @param handler 执行的方法
		 * @param times 执行的次数
		 * @param frame 是否以帧刷新，默认为秒刷新
		 * @param arg 执行时的参数
		 */		
		function call(delay:uint, handler:Function, times:uint=0, frame:Boolean = false, ...arg):void
		/**
		 * 删除计时器
		 * @param handler
		 */		
		function remove(handler:Function):void;
		/**
		 * 判断计时器是否已经在执行
		 * @param handler
		 * @return 
		 */		
		function has(handler:Function):Boolean;
		//function start():void;
		//function stop():void;
		//function pasue():void;
		//function resume():void
	}
}