/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 4:18:26 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.api.IItemRender;
	import com.idzeir.ui.Color;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	
	public class DropRender extends Button implements IItemRender
	{
		private var _data:*;
		
		private var _bglayer: Shape;
		
		private var _color: uint = Color.BACKGROUND;
		
		public function DropRender(handler:Function=null)
		{
			_bglayer = new Shape();
			_bglayer.graphics.beginFill(_color);
			_bglayer.graphics.drawRect(0,0,75, 30);
			_bglayer.graphics.endFill();
			
			super(handler);
			
			this.overSkin = this.selectSkin = null;
			this.normalSkin = _bglayer
			
			_label.textColor = Color.PRIMARY;
			this.setSize(75,30);
		}
		
		public function startup(value:*):void
		{
			_data = value;
			this.label = value;
		}
		
		public function get warp():DisplayObject
		{
			return this;
		}
		
		public function over():void
		{
			this._color = Color.HOVER;
			vaild();
		}
		
		public function select():void
		{
			this.selected = true;
			this._color = Color.HOVER;
			vaild();
		}
		
		public function unselect():void
		{
			this.selected = false;
			this._color = Color.BACKGROUND;
			vaild();
		}
		
		public function out():void
		{
			if(this._selected) this._color = Color.HOVER;
			else this._color = Color.BACKGROUND;
			vaild();
		}
		
		public function get data():*
		{
			return _data;
		}
		
		public function disable(bool:Boolean):void
		{
		}
		
		override public function immediateUpdate():void 
		{
			super.immediateUpdate();
			if(_setWH) 
			{
				_bglayer.graphics.clear();
				_bglayer.graphics.beginFill(_color);
				_bglayer.graphics.drawRect(0 , 0, _width, 20);
				_bglayer.graphics.endFill();
			}
		}
	}
}