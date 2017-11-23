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
	import com.idzeir.dispatch.EventType;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	
	public class LayerRender extends UIContainer implements IItemRender
	{
		private var _data:*;
		private var _bgLayer:Shape;
		
		private var _color: uint = Color.White;

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
			_bgLayer.alpha = .05;
			
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
			const eyeBtn: Button = new Button(function():void {});
			eyeBtn.overSkin  = null;
			eyeBtn.selectSkin = new V3EyeClose();
			eyeBtn.normalSkin = new V3Eye();
			eyeBtn.setSize(14,12);
			
			leftBox.addChild(lockedBtn);
			leftBox.addChild(eyeBtn);
			
			typeTxt = new Label('类型',Color.Primary,false,200);
			leftBox.addChild(typeTxt);
			addChild(leftBox);
			
			const upBtn:Button = new Button(function():void{
				bringLayerUp();
			});
			upBtn.selectSkin = null;
			upBtn.normalSkin = new V3UpArrow();
			upBtn.overSkin = new V3UpArrowHover();
			upBtn.setSize(12,12);
			const downBtn:Button = new Button(function():void{});
			downBtn.selectSkin = null;
			downBtn.normalSkin = new V3DownArrow();
			downBtn.overSkin = new V3DownArrowHover();
			downBtn.setSize(12,12);
			
			const optBtn: Button = new Button(function():void{
				fire(EventType.OPEN_LAYER_DETAIL,_data);
			});
			optBtn.selectSkin = null;
			optBtn.overSkin = new V3OptHover();
			optBtn.normalSkin = new V3Opt();
			optBtn.setSize(12,12);
			const delBtn: Button = new Button(function():void{});
			delBtn.selectSkin = null;
			delBtn.overSkin = new V3CrashBoxHover();
			delBtn.normalSkin = new V3CrashBox();
			delBtn.setSize(12,12);
			
			warpBox.addChild(upBtn);
			warpBox.addChild(downBtn);
			warpBox.addChild(delBtn);
			warpBox.addChild(optBtn);
			addChild(warpBox);
		}
		
		private function bringLayerUp():void
		{
			fire(EventType.BRING_LAYER_UP,_data);
		}
		
		private function bringLayerDown():void
		{
			fire(EventType.BRING_LAYER_DOWN,_data);
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			if(_setWH) 
			{
				DrawUtil.drawRectRoundTo(_width, _height, _color, this, 8);
				warpBox.move(_width - warpBox.width - 50, _height - warpBox.height >> 1)
				leftBox.move(20, _height - leftBox.height >>1);
			}
		}
		
		public function startup(value:*):void
		{
			_data = value;
			typeTxt.text = value.title;
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
			_color = Color.White;
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