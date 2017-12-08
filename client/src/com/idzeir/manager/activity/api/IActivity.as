/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 8, 2017 4:56:51 PM
 * ===================================
 */

package com.idzeir.manager.activity.api
{
	public interface IActivity
	{
		/**
		 * 获取活动数据
		 * @return 
		 * 
		 */		
		function get activies():Array;
		
		/**
		 * 保存服务器表情数据 
		 */		
		function persist(data:Array):void;
	}
}