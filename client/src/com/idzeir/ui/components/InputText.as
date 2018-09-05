/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 27, 2017 3:20:36 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Shape;
	import flash.events.FocusEvent;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	
	public class InputText extends UIContainer
	{
		private var _bgLayer:Shape;
		
		private var _text:TextField;
		
		private var _holder:TextField;
		
		public function InputText()
		{
			super();
			setSize(300,24);
			createChildren();	
		}
		
		private function createChildren():void
		{
			_bgLayer = DrawUtil.drawRectRound(_width,_height,Color.White,24);
			
			_text = new TextField();
			_text.defaultTextFormat = new TextFormat(Style.font,null,null,null,null,null,null,null,null,10,10);
			_text.defaultTextFormat.letterSpacing = 4;
			_text.type = TextFieldType.INPUT;
			_text.maxChars = 30;
			_text.textColor = Color.Red;
			_text.width = _width;
			_text.height = 20;
			
			_holder = new TextField();
			_holder.defaultTextFormat = _text.defaultTextFormat;
			_holder.mouseEnabled = false;
			_holder.autoSize = 'left';
			_holder.height = 20;
			_holder.textColor = Color.Border;
			
			addChild(_bgLayer);
			addChild(_text);
			addChild(_holder);
			
			_text.addEventListener(FocusEvent.FOCUS_IN,function():void
			{
				_holder.visible = false;
			});
			_text.addEventListener(FocusEvent.FOCUS_OUT,function():void
			{
				 _holder.visible = _text.length === 0;
			})
		}
		
		public function set placeholder(tips:String):void
		{
			_holder.htmlText = tips;
		}
		
		override public function immediateUpdate():void
		{
			_text.x = _width - _text.width >> 1;
			_text.y = _height - _text.height >> 1;
			_holder.x = _text.x;
			_holder.y = _text.y;
		}
	}
}
