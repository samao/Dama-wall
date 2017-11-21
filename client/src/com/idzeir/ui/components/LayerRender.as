/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 21, 2017 3:16:18 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.api.IItemRender;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	
	public class LayerRender extends UIContainer implements IItemRender
	{
		private var _data:*;
		private var _bgLayer:Shape;
		
		private var _color: uint = Color.WHITE;

		private var warpBox:HBox;

		private var typeTxt:Label;

		private var leftBox:HBox;
		
		public function LayerRender()
		{
			super();
			this.setSize(600 - Gap.PADDING * 2, 30);
			
			createChildren();
		}
		
		private function createChildren():void
		{
			_bgLayer = new Shape();
			_bgLayer.alpha = .2;
			
			const ICON_GAP: uint = 15;
			
			warpBox = new HBox();
			warpBox.gap = ICON_GAP;
			warpBox.algin = HBox.MIDDLE;
			
			leftBox = new HBox();
			leftBox.algin = HBox.MIDDLE;
			leftBox.gap = ICON_GAP;
			const lockedBtn: Button = new Button(function():void{});
			lockedBtn.selectSkin = new V3Locked();
			lockedBtn.normalSkin = new V3UnLocked();
			lockedBtn.overSkin = null;
			lockedBtn.setSize(13,13);
			leftBox.addChild(lockedBtn);
			
			typeTxt = new Label('类型',Color.PRIMARY);
			leftBox.addChild(typeTxt);
			addChild(leftBox);
			
			const eyeBtn: Button = new Button(function():void {});
			eyeBtn.overSkin  = null;
			eyeBtn.selectSkin = new V3EyeClose();
			eyeBtn.normalSkin = new V3Eye();
			eyeBtn.setSize(14,12);
			const optBtn: Button = new Button(function():void{});
			optBtn.selectSkin = null;
			optBtn.overSkin = new V3OptHover();
			optBtn.normalSkin = new V3Opt();
			optBtn.setSize(12,12);
			const delBtn: Button = new Button(function():void{});
			delBtn.selectSkin = null;
			delBtn.overSkin = new V3CrashBoxHover();
			delBtn.normalSkin = new V3CrashBox();
			delBtn.setSize(12,12);
			
			warpBox.addChild(eyeBtn);
			warpBox.addChild(delBtn);
			warpBox.addChild(optBtn);
			addChild(warpBox);
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			if(_setWH) 
			{
				drawRect(_color,_width,_height, this);
				warpBox.move(_width - warpBox.width - 50, _height - warpBox.height >> 1)
				leftBox.move(20, _height - leftBox.height >>1);
			}
		}
		
		public function startup(value:*):void
		{
			_data = value;
			typeTxt.text = value;
		}
		
		public function get warp():DisplayObject
		{
			return this;
		}
		
		public function over():void
		{
			_color = Color.Light;
			vaild();
		}
		
		public function select():void
		{
		}
		
		public function unselect():void
		{
		}
		
		public function out():void
		{
			_color = Color.WHITE;
			vaild();
		}
		
		public function get data():*
		{
			return _data;
		}
		
		public function disable(bool:Boolean):void
		{
		}
	}
}