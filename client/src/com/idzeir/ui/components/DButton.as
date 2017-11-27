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
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.display.Shape;
	
	public class DButton extends Button
	{
		protected var _bgLayer: Shape;
		
		protected var _raduis: uint = 20;
		
		private var _borderColor:uint = 0x999999;
		
		private var _overLayer: Shape;
		
		public function DButton(handler:Function=null)
		{
			super(handler);
			
			FilterUtil.border(this);
			
			_bgColor = 0xFFFFFF;
			
			this.selectSkin =  null;
			
			_bgLayer = new Shape();
			_bgLayer.graphics.lineStyle(.3, _borderColor, .5);
			_bgLayer.graphics.drawRoundRect(0, 0, 100, 30, _raduis, _raduis);
			_bgLayer.graphics.endFill();
			
			_overLayer = new Shape();
			_overLayer.graphics.lineStyle(.3, _borderColor, .5);
			_overLayer.graphics.beginFill(Color.Hover);
			_overLayer.graphics.drawRoundRect(0, 0, 100, 30, _raduis, _raduis);
			_overLayer.graphics.endFill();
			
			this.overSkin = _overLayer;
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

		override public function set bgColor(value:int):void
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
				
				_overLayer.graphics.clear();
				_overLayer.graphics.lineStyle(.3, _borderColor, .5);
				_overLayer.graphics.beginFill(Color.Hover);
				_overLayer.graphics.drawRoundRect(0, 0, _width, _height, _raduis, _raduis);
				_overLayer.graphics.endFill();
			}
			_label.maxWidth = _width - 4;
			_label.x = (_width - _label.width) *.5;
			_label.y = (_height - _label.height) *.5;
		}
	}
}