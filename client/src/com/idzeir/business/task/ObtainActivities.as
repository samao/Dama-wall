/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 7, 2017 3:53:17 PM
 * ===================================
 */

package com.idzeir.business.task
{
	import com.adobe.crypto.MD5;
	import com.idzeir.business.ITask;
	import com.idzeir.conf.Host;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.activity.api.IActivity;
	import com.idzeir.manager.user.api.IUser;
	
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;

	/**
	 * 获取活动
	 */	
	public class ObtainActivities implements ITask
	{
		private var _user:String = '';
		private var _pwd:String = '';
		
		/**
		 * 获取活动
		 * @param user 登录用户名
		 * @param pwd 登录密码
		 */		
		public function ObtainActivities(user:String = 'admin', pwd:String = 'admin')
		{
			this._user = user;
			this._pwd = pwd;
			($(ContextType.USER) as IUser).save(user, pwd);
		}
		
		public function enter(next:Function, error:Function = null):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':'+Host.PORT +'/api/token/'+_user);
			url.method = URLRequestMethod.POST;
			url.data = new URLVariables('pwd='+MD5.hash(_pwd));
			var loader:URLLoader = new URLLoader(url);
			
			function okHandler(e:Event):void
			{
				const data:Object = JSON.parse(e.target.data);
				if(data.ok)
				{
					getActivities(data.data, next);
				}else{
					error && error.apply(null,['用户名密码错误']);
				}
				clear();
			}
			
			function failHandler(e:Event):void
			{
				clear();
				error && error.apply(null,[e.type]);
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
		
		private function getActivities(token:String, next:Function, error:Function = null):void
		{
			const url:URLRequest = new URLRequest('http://'+Host.DOMAIN +':' + Host.PORT +'/api/activities/'+_user+'/'+ token);
			var loader:URLLoader = new URLLoader(url);
			
			function okHandler(e:Event):void
			{
				const result:Object = JSON.parse(e.target.data);
				if(result.ok)
				{
					($(ContextType.ACTIVITY) as IActivity).persist(result.data);
					next()
				}else {
					error && error.apply(null,['服务器出错']);
				}
				clear();
			}
			
			function failHandler(e:Event):void
			{
				clear();
				error && error.apply(null,[e.type]);
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