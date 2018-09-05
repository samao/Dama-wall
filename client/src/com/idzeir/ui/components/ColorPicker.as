/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 23, 2016 12:32:14 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.ui.Color;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	
	[Event(name="change", type="flash.events.Event")]
	
	public class ColorPicker extends Box
	{
		//每个图块宽高
		private const WIDTH:int = 11;
		private const HEIGHT:int = 11;
		
		//前面2列不在算法之内
		private const EXCEPT:int = 2;
		
		//总行数，列数
		private const ROW:int = 18 + EXCEPT;
		private const COL:int = 12;
		
		/**
		 * 颜色选择面板 
		 */		
		private var colorPicker:Sprite = new Sprite();
		//颜色绘制对象
		private var bitmap:Bitmap = new Bitmap();
		private var bmd:BitmapData = new BitmapData(ROW * WIDTH + 1,COL * HEIGHT + 1,true,0xFF000000);
		/**
		 * 图块区域
		 **/
		private var rect:Rectangle = new Rectangle(0,0,WIDTH - 1,HEIGHT - 1);
		/**
		 * 首列显示颜色
		 **/
		private const BEGIN_MAP:Array = [0x000000,0x333333,0x666666,0x999999,0xcccccc,0xFFFFFF,
			0xFF0000,0x00FF00,0x0000FF,0xFFFF00,0x00FFFF,0xFF00FF];
		/**
		 * 鼠标滑入显示描边
		 **/
		private var _border:Shape;
		
		private var _color:int = 0xFFFFFF;
		
		public function ColorPicker()
		{
			createChildren();
			
			setSize(bmd.width,bmd.height);
		}
		
		/**
		 * 当前选中颜色 默认为0xFFFFFF
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
		}

		private function createChildren():void
		{
			//填充 row * col 图块
			for(var i:int = 0; i < ROW; ++i)
			{
				//竖
				for(var j:int = 0; j < COL; ++j)
				{
					var color:uint
					rect.x = i * WIDTH + 1;
					rect.y = j * HEIGHT + 1;
					if(i >= EXCEPT)
					{
						color = 0xFF000000 + ((i - EXCEPT) % 6) * 0x3300 + uint((i - EXCEPT) / 6) * 0x330000 + (j % 6) * 0x33 + uint(j / 6) * 0x990000;
					}else{
						color = (i == 0 ? BEGIN_MAP[j] : 0x000000) + 0xFF000000
					}
					bmd.fillRect(rect,color);
				}
			}
			
			bitmap.bitmapData = bmd;
			colorPicker.addChild(bitmap);
			
			colorPicker.addEventListener(MouseEvent.CLICK,function(e:MouseEvent):void
			{
				_color = bmd.getPixel((uint(e.localX / WIDTH) + .5) * WIDTH, (uint(e.localY / HEIGHT) + .5) * HEIGHT);
				dispatchEvent(new Event(Event.CHANGE));
			});
			
			//滑入描边
			_border = new Shape();
			_border.graphics.lineStyle(1,0xFFFFFF);
			_border.graphics.drawRect(0,0,WIDTH,HEIGHT);
			_border.graphics.endFill();
			_border.visible = false;
			
			colorPicker.addChild(_border);
			
			var borderId:int;
			colorPicker.addEventListener(MouseEvent.ROLL_OVER,function():void
			{
				_border.visible = true;
				borderId = setInterval(borderFocusMouse, 100);
			});
			colorPicker.addEventListener(MouseEvent.ROLL_OUT,function():void
			{
				_border.visible = false;
				clearInterval(borderId);
			});
			
			addChild(colorPicker);
		}
		
		/**
		 * 定位色块描边位置
		 */		
		private function borderFocusMouse():void
		{
			_border.x = (uint(colorPicker.mouseX / WIDTH)) * WIDTH + .5;
			_border.y = (uint(colorPicker.mouseY / HEIGHT)) * HEIGHT + .5;
		}
		
		/**
		 * 描边定位到指定颜色
		 * @param color
		 */		
		private function borderFocusColor(color:Number):void
		{
			for(var i:uint = 0; i < bmd.width; i += WIDTH)
			{
				for(var j:uint = 0; j < bmd.height; j += HEIGHT)
				{
					var areaColor:int = bmd.getPixel(i + .5 * WIDTH, j + .5 * HEIGHT);
					if(areaColor == color)
					{
						_border.visible = true;
						_border.x = i + .5;
						_border.y = j + .5;
						break;
					}
				}
			}
		}
		
		override public function immediateUpdate():void
		{
			drawRect(Color.Background, _width, _height, this);
		}
	}
}
