/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 6, 2017 12:04:07 PM
 * ===================================
 */

package com.idzeir.service
{
	/**
	 * 聊天消息数据分片
	 */	
	public class DanmuPart
	{
		/** 文本 */
		public static const TEXT:uint = 0;
		/** 图像 */
		public static const IMAGE:uint = 1;
		
		private var _type:uint;
		private var _data:String;
		
		
		public function DanmuPart(type:uint,data:String)
		{
			this._type = type;
			this._data = data;
		}
		
		/**
		 * 普通文字内容，或者表情地址 
		 * @return 
		 */		
		public function get data():String
		{
			return _data;
		}
		
		/**
		 * 0 为普通文字 1为表情
		 */		
		public function get type():uint
		{
			return _type;
		}
	}
}