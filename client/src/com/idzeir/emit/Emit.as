/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 22, 2017 5:14:50 PM
 * ===================================
 */

package com.idzeir.emit
{
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	
	public class Emit extends EventDispatcher
	{
		private static var instance:Emit;
		
		public static function get():Emit
		{
			return instance ||= new Emit();
		}
		
		public function Emit(target:IEventDispatcher=null)
		{
			super(target);
		}
		
		public function fire(type: String,...data):Emit
		{
			this.dispatchEvent(new CarryEvent(type,data));
			return this;
		}
		
		public function on(type: String, handler:Function):Emit
		{
			super.addEventListener(type,handler);
			return this;
		}
		
		public function off(type: String,handler: Function):Emit
		{
			super.removeEventListener(type,handler);
			return this;
		}
	}
}
import flash.events.Event;

class CarryEvent extends Event {
	
	private var _data:Array;
	
	public function CarryEvent(type:String,data:Array = null) {
		_data = data;
		super(type);
	}
	
	public function get data():Array
	{
		return this._data;
	}
}