/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 6, 2017 10:48:01 AM
 * ===================================
 */

package com.idzeir.service
{
	import com.idzeir.conf.Host;
	
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.utils.Dictionary;

	public class Emotions
	{
		private static var _instance:Emotions;
		
		private const _map:Dictionary = new Dictionary(true);
		
		private var _regExp:RegExp;
		
		public static  function getInstance():Emotions
		{
			return _instance ||= new Emotions();
		}
		
		/**
		 * 按表情tag分割消息
		 * @param s 输入字符串
		 * @return 分割片数组
		 */		
		public function split(s:String):Vector.<DanmuPart>
		{
			const emotions:Array = s.match(_regExp);
			const result:Vector.<DanmuPart> = new Vector.<DanmuPart>();
			emotions.forEach(function(e:String, id:int, arr:Array):void 
			{
				if(_map.hasOwnProperty(e))
				{
					const index:int = s.indexOf(e);
					if(index != 0) result.push(new DanmuPart(DanmuPart.TEXT,s.substr(0,index)));
					result.push(new DanmuPart(DanmuPart.IMAGE,_map[e]))
					s = s.substr(index + e.length);
				}
			});
			if(s != '') result.push(new DanmuPart(DanmuPart.TEXT,s));
			return result;
		}
		
		private function persist(emotions:Array):void
		{
			var _tagMap:Array = [];
			emotions && emotions.forEach(function(emotion:Object, index:int, arr:Array):void
			{
				_tagMap.push(emotion.tag.replace(/\[(.+)\]/ig,'(\\[$1\\])'));
				_map[emotion.tag] = emotion.url;
			});
			_regExp = new RegExp(_tagMap.join('|'),'ig');
		}
		
		/**
		 * 获取服务器表情配置
		 */		
		public function request(cb:Function):void
		{
			function okHandler(e:Event):void
			{
				clear();
				const res:Object = JSON.parse(e.target.data);
				if(res.ok) persist(res.data);
				cb.apply(null, [res.ok, res.data]);
			};
			function errorHandler(e:Event):void
			{
				clear();
				cb.apply(null, [false, e.type]);
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