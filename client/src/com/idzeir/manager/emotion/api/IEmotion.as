/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 8, 2017 4:51:53 PM
 * ===================================
 */

package com.idzeir.manager.emotion.api
{
	import com.idzeir.manager.emotion.impl.DanmuPart;

	public interface IEmotion
	{
		/**
		 * 保存服务器表情数据 
		 */		
		function persist(emotions:Array):void;
		
		/**
		 * 按表情tag分割消息
		 * @param s 输入字符串
		 * @return 分割片数组
		 */
		function split(s:String):Vector.<DanmuPart>;
		
	}
}