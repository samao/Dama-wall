/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Jun 3, 2015 3:06:48 PM			
 * ===================================
 */

package com.idzeir.business
{
	/**
	 * 业务管理接口
	 */	
	public interface IQueue
	{
		/**
		 * 添加业务队列
		 * @param queue
		 * @param clear 是否清楚之前队列
		 */		
		function add(queue:ITask,clear:Boolean = false):IQueue;
		/**
		 * 开始执行业务
		 * 回调函数的参数为每个业务调用next传入参数的数组
		 * @param done 执行完毕回调
		 * @param error 执行失败回调 参数为失败原因
		 */		
		function excute(done:Function = null, error:Function = null):void;
	}
}