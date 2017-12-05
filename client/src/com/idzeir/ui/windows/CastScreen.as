/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 29, 2017 5:46:13 PM
 * ===================================
 */

package com.idzeir.ui.windows
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.draw.Mirro;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Bitmap;
	import flash.display.PixelSnapping;
	import flash.display.Stage;
	import flash.display.StageDisplayState;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	/**
	 * 投屏窗口类 
	 */	
	public class CastScreen extends Window
	{
		private var _bitmap:Bitmap;
		
		private var _mirro:Mirro;

		private var _box:Box;
		
		public function CastScreen(rootStage:Stage, width:uint=0, height:uint=0)
		{
			_mirro = Mirro.getInstance();
			super(rootStage, width, height);
			title = '投屏窗口|双击切换全屏';
		}
		
		override protected function setViewPort(w:Number, h:Number):void
		{
			super.setViewPort(w,h);
			height += 20;
		}
		
		override protected function setupGUI():void
		{
			_box = new Box();
			_bitmap = new Bitmap(_mirro.bitmapFrame, PixelSnapping.AUTO, false);
			_box.addChild(_bitmap);
			addChild(_box);
			
			stage.doubleClickEnabled = true;
			stage.addEventListener(MouseEvent.DOUBLE_CLICK,function(e:MouseEvent):void
			{
				if(stage.displayState == StageDisplayState.FULL_SCREEN)
				{
					stage.displayState = StageDisplayState.NORMAL;
					return;
				}
				stage.displayState = StageDisplayState.FULL_SCREEN;
			})
			stage.mouseChildren = false;
			stage.addEventListener(MouseEvent.MOUSE_DOWN,function(e:MouseEvent):void
			{
				_window.startMove();
			});
			stage.addEventListener(Event.RESIZE,resizeHandler);
			resizeHandler();
		}
		
		public function resizeHandler(e:Event = null):void
		{
			const xscale:Number = stage.stageWidth/_mirro.width;
			const yscale:Number = stage.stageHeight/_mirro.height;
			const toScale:Number = Math.min(xscale, yscale);
			const toWidth:Number = uint(_mirro.width * toScale);
			const toHeight:Number = uint(_mirro.height * toScale);
			
			_bitmap.width = toWidth;
			_bitmap.height = toHeight;
			_bitmap.x = (stage.stageWidth - toWidth) * .5;
			_bitmap.y = (stage.stageHeight - toHeight) * .5;
			DrawUtil.drawRectRoundTo(stage.stageWidth, stage.stageHeight,Color.Black,_box);
		}
	}
}