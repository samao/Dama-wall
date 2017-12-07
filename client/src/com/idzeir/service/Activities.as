/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 7, 2017 3:53:17 PM
 * ===================================
 */

package com.idzeir.service
{
	import com.adobe.crypto.MD5;
	import com.idzeir.conf.Host;
	
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;

	public class Activities
	{
		public function Activities()
		{
			
		}
		
		public function getToken(cb:Function):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':'+Host.PORT +'/api/token/qiyanlong');
			url.method = URLRequestMethod.POST;
			url.data = new URLVariables('pwd='+MD5.hash('admin'));
			var loader:URLLoader = new URLLoader(url);
			loader.addEventListener(Event.COMPLETE,function(e:Event):void
			{
				const data:Object = JSON.parse(e.target.data);
				getActivities(data.data, cb);
			});
		}
		
		private function getActivities(token:String, cb:Function):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':' + Host.PORT +'/api/activities/qiyanlong/'+ token);
			var loader:URLLoader = new URLLoader(url);
			loader.addEventListener(Event.COMPLETE,function(e:Event):void
			{
				cb(e.target.data);
			});
		}
	}
}