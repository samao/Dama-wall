/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Jun 3, 2015 2:54:26 PM			
 * ===================================
 */

package com.idzeir.business
{
	
	/**
	 * 具体业务接口
	 */	
	public interface IJob
	{
		/**
		 * 开始执行业务
		 */		
		function enter(next:Function, error:Function = null):void;
	}
}