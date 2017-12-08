/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 3:21:20 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.event.EventType;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.ColorPicker;
	import com.idzeir.ui.components.ColorText;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.events.Event;

	public class ColorOptView extends OptView
	{
		private var warpBox:HBox;
		
		private var _picker:UIContainer;

		private var colorPickerBtn:DButton;

		private var _colorTxt:ColorText;
		
		public function ColorOptView()
		{
			super();
		}
		
		override protected function createChildren():void
		{
			warpBox = new HBox();
			warpBox.algin = HBox.MIDDLE;
			warpBox.gap = Gap.PADDING;
			
			colorPickerBtn = new DButton(function():void{
				showColorPicker();
			});
			colorPickerBtn.label = '选择颜色';
			colorPickerBtn.raduis = 24;
			colorPickerBtn.setSize(65,24);
			
			var txt:Label = new Label('或者填写十六进制颜色码',Color.Title, false, 240);
			
			_colorTxt = new ColorText();
			
			warpBox.addChild(colorPickerBtn);
			warpBox.addChild(txt);
			warpBox.addChild(_colorTxt);
			addChild(warpBox);
		}
		
		private function createPicker():UIContainer
		{
			var colorPicker:ColorPicker = new ColorPicker();
			
			var box:UIContainer = new UIContainer();
			FilterUtil.border(box);
			box.graphics.beginFill(Color.White);
			box.graphics.lineStyle(.02,Color.Border);
			box.graphics.drawRoundRect(0,0, 250,160,8,8);
			box.graphics.endFill();
			box.setSize(250,160);
			colorPicker.move(box.width - colorPicker.width>>1,box.height - colorPicker.height>>1);
			
			box.addChild(colorPicker);
			
			colorPicker.addEventListener(Event.CHANGE,function():void
			{
				_colorTxt.color = colorPicker.color;
				fire(EventType.BACKGROUND_COLOR,colorPicker.color);
				_picker.removeFromParent();
			});
			return box;
		}
		
		private function showColorPicker():void
		{
			_picker ||= createPicker();
			if(this.contains(_picker))
			{
				_picker.removeFromParent();
				return;
			}
			addChild(_picker);
			_picker.x = colorPickerBtn.getBounds(this).left + 3;
			_picker.y = colorPickerBtn.getBounds(this).top - _picker.height - 3;
		}
		
		override public function immediateUpdate():void
		{
			warpBox.y = _height - warpBox.height >> 1;
		}
	}
}