/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2016 4:45:19 PM
 * ===================================
 */

package  com.idzeir.ui.components
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Style;
	import com.idzeir.ui.Color;
	
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.ui.Keyboard;
	
	public class ColorText extends Box
	{
		private var _colorTxt:TextField;
		
		private var _color:Number;
		
		public function ColorText()
		{
			_colorTxt = new TextField();
			_colorTxt.doubleClickEnabled = true;
			_colorTxt.maxChars = 6;
			_colorTxt.restrict = "a-f|A-F|0-9";
			var tf:TextFormat = new TextFormat(Style.font);
			_colorTxt.autoSize = TextFieldAutoSize.LEFT;
			_colorTxt.defaultTextFormat = tf;
			_colorTxt.text = "FF0000";
			_colorTxt.selectable = false;
			
			_colorTxt.addEventListener(MouseEvent.CLICK,function():void
			{
				if(!_colorTxt.hasEventListener(KeyboardEvent.KEY_UP))
				{
					var lastColor:uint = toNum(_colorTxt.text);
					_colorTxt.addEventListener(KeyboardEvent.KEY_UP,function(e:KeyboardEvent):void
					{
						if(e.keyCode == Keyboard.ENTER||e.keyCode == Keyboard.ESCAPE)
						{
							_colorTxt.removeEventListener(KeyboardEvent.KEY_UP,arguments.callee);
							_colorTxt.type = TextFieldType.DYNAMIC;
							_colorTxt.selectable = false;
							//_colorTxt.setSelection(0, 0);
							if(e.keyCode == Keyboard.ESCAPE)
							{
								_colorTxt.text = toHex(lastColor);
							}
							color = toNum(_colorTxt.text);
							dispatchEvent(new Event(Event.CHANGE));
						}
					});
				}
				_colorTxt.type = "input";
				_colorTxt.selectable = true;
				//_colorTxt.setSelection(0, 6);
			});
			
			addChild(_colorTxt);
			
			setSize(56,24);
		}
		
		/**
		 * 当前选中颜色 
		 */
		public function get color():int
		{
			return _color;
		}
		
		/**
		 * @private
		 */
		public function set color(value:int):void
		{
			_color = value;
			_colorTxt.text = toHex(value);
			stage && (stage.focus = null);
			vaild();
		}
		
		/**
		 * 转换数字为hex 6位字符串
		 * @param value
		 * @return 
		 */		
		private function toHex(value:Number):String
		{
			var hexs:String = value.toString(16);
			var black:String = "000000";
			return (black.substring(0,black.length - hexs.length) + hexs).toLocaleUpperCase();
		}
		/**
		 * 6位hex字符串 转化为数字
		 * @param value
		 * @return 
		 */		
		private function toNum(value:String):Number
		{
			return Number("0x"+value);
		}
		
		override public function immediateUpdate():void
		{
			graphics.clear();
			graphics.lineStyle(1,Color.Border);
			graphics.beginFill(Color.White);
			graphics.drawRoundRect(0, 0, _width, _height, 4, 4);
			graphics.endFill();
			
			_colorTxt.x = (_width - _colorTxt.width)*.5;
			_colorTxt.y = (_height - _colorTxt.height)*.5;
		}
	}
}