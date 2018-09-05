/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Dec 11, 2017 3:54:41 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Box;
	
	import flash.display.DisplayObject;
	
	public class StatusButtton extends Box
	{
		private var _but:DButton;
		
		private var _statusLayer:DisplayObject;
		
		public function StatusButtton(handler:Function)
		{
			createChildren(handler);
		}
		
		protected function createChildren(handler:Function):void
		{
			_but = new DButton(handler);
			_statusLayer = new V3Loading();
			_statusLayer.visible = false;
			_statusLayer.width = _statusLayer.height = 24;
			
			addChild(_but);
			addChild(_statusLayer);
		}
		
		override public function setSize(w:Number, h:Number):void
		{
			_but.setSize(w, h);
			_but.raduis = h;
			super.setSize(w,h);
		}
		
		public function set loading(bool:Boolean):void
		{
			_but.visible = !bool;
			_statusLayer.visible = bool;
			vaild();
		}
		
		public function set label(value:String):void
		{
			_but.label = value;
		}
		
		override public function immediateUpdate():void
		{
			if(_setWH)
			{
				_statusLayer.x = _width - _statusLayer.width >> 1;
				_statusLayer.y = _height - _statusLayer.height >> 1;
			}
		}
	}
}
