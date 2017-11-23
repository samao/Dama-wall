/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 22, 2017 5:14:50 PM
 * ===================================
 */

package com.idzeir.dispatch
{
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	
	public class Dispatcher extends EventDispatcher
	{
		private static var instance:Dispatcher;
		
		public static function get():Dispatcher
		{
			return instance ||= new Dispatcher();
		}
		
		public function Dispatcher(target:IEventDispatcher=null)
		{
			super(target);
		}
		
		public function fire(type: String,...data):Dispatcher
		{
			this.dispatchEvent(new DEvent(type,data));
			return this;
		}
		
		public function on(type: String, handler:Function):Dispatcher
		{
			super.addEventListener(type,handler);
			return this;
		}
		
		public function off(type: String,handler: Function):Dispatcher
		{
			super.removeEventListener(type,handler);
			return this;
		}
	}
}