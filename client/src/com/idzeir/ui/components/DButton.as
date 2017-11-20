/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 2:53:52 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	
	import flash.display.Shape;
	
	public class DButton extends Button
	{
		protected var _bgLayer: Shape;
		
		protected var _bgColor: uint = 0xFFFFFF;
		
		protected var _raduis: uint = 20;
		
		private var _borderColor:uint = 0x999999;
		
		public function DButton(handler:Function=null)
		{
			super(handler);
			
			this.overSkin = this.selectSkin =  null;
			
			_bgLayer = new Shape();
			_bgLayer.graphics.lineStyle(.3, _borderColor, .5);
			_bgLayer.graphics.drawRoundRect(0, 0, 100, 30, _raduis, _raduis);
			_bgLayer.graphics.endFill();
			
			this.normalSkin = _bgLayer;
		}
		
		public function set borderColor(value:uint):void
		{
			_borderColor = value;
			vaild();
		}

		public function set raduis(value:uint):void
		{
			_raduis = value;
			vaild();
		}

		public function set bgColor(value:uint):void
		{
			_bgColor = value;
			vaild();
		}

		override public function immediateUpdate():void 
		{
			this.graphics.clear();
			
			if(_setWH)
			{
				_bgLayer.graphics.clear();
				_bgLayer.graphics.lineStyle(.3, _borderColor, .5);
				_bgLayer.graphics.beginFill(_bgColor);
				_bgLayer.graphics.drawRoundRect(0, 0, _width, _height, _raduis, _raduis);
				_bgLayer.graphics.endFill();
			}
			_label.maxWidth = _width - 4;
			_label.x = (_width - _label.width) *.5;
			_label.y = (_height - _label.height) *.5;
		}
	}
}