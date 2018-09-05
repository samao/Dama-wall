/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Dec 6, 2017 10:48:01 AM
 * ===================================
 */

package com.idzeir.business.task
{
	import com.idzeir.business.ITask;
	import com.idzeir.conf.Host;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.emotion.api.IEmotion;
	
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;

	/**
	 * 获取服务器表情数据 
	 */	
	public class ObtainEmotions implements ITask
	{
		
		/**
		 * 获取服务器表情配置
		 */		
		public function enter(next:Function, error:Function = null):void
		{
			function okHandler(e:Event):void
			{
				clear();
				const res:Object = JSON.parse(e.target.data);
				if(res.ok)
				{
					($(ContextType.EMOTION) as IEmotion).persist(res.data);
					next.call(null,res.data);
				}
			};
			function errorHandler(e:Event):void
			{
				clear();
			};
			
			function clear():void
			{
				loader.removeEventListener(Event.COMPLETE, okHandler);
				loader.removeEventListener(IOErrorEvent.IO_ERROR, errorHandler);
				loader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, errorHandler);
			}
			var loader:URLLoader = new URLLoader(new URLRequest('http://'+Host.DOMAIN + ':' + Host.PORT + '/api/emotions'));
			loader.addEventListener(Event.COMPLETE, okHandler);
			loader.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, errorHandler);
		}
	}
}
