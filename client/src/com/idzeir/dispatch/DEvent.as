/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 10:41:24 AM
 * ===================================
 */

package com.idzeir.dispatch
{
	import flash.events.Event;
	
	public class DEvent extends Event
	{
		private var _data:Array;
		
		public function DEvent(type:String, data:Array = null, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			_data = data;
			super(type, bubbles, cancelable);
		}
		
		public function get data():Array
		{
			return this._data;
		}
	}
}