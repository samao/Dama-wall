/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 7, 2017 3:53:17 PM
 * ===================================
 */

package com.idzeir.business.init
{
	import com.adobe.crypto.MD5;
	import com.idzeir.business.IJob;
	import com.idzeir.conf.Host;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.activity.api.IActivity;
	
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;

	public class ActivitiesInit implements IJob
	{
		public function enter(next:Function):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':'+Host.PORT +'/api/token/qiyanlong');
			url.method = URLRequestMethod.POST;
			url.data = new URLVariables('pwd='+MD5.hash('admin'));
			var loader:URLLoader = new URLLoader(url);
			loader.addEventListener(Event.COMPLETE,function(e:Event):void
			{
				const data:Object = JSON.parse(e.target.data);
				getActivities(data.data, next);
			});
		}
		
		private function getActivities(token:String, next:Function):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':' + Host.PORT +'/api/activities/qiyanlong/'+ token);
			var loader:URLLoader = new URLLoader(url);
			
			function okHandler(e:Event):void
			{
				const result:Object = JSON.parse(e.target.data);
				if(result.ok)
				{
					($(ContextType.ACTIVITY) as IActivity).persist(result.data);
					next()
				}
				clear();
			}
			
			function failHandler(e:Event):void
			{
				clear();
			}
			
			function clear():void
			{
				loader.removeEventListener(Event.COMPLETE,okHandler);
				loader.removeEventListener(IOErrorEvent.IO_ERROR,failHandler);
				loader.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,failHandler);
			}
			
			
			loader.addEventListener(Event.COMPLETE,okHandler);
			loader.addEventListener(IOErrorEvent.IO_ERROR,failHandler);
			loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR,failHandler);
		}
	}
}