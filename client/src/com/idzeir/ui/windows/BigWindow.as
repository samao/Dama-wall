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
	
	import flash.display.Bitmap;
	import flash.display.Stage;
	import flash.display.StageDisplayState;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	public class BigWindow extends Window
	{
		private var _bitmap:Bitmap;
		
		public function BigWindow(rootStage:Stage, width:uint=0, height:uint=0)
		{
			super(rootStage, width, height);
		}
		
		override protected function setupGUI():void
		{
			var box:Box = new Box();
			_bitmap = new Bitmap(Mirro.getInstance().bitmapFrame,'auto',true);
			box.addChild(_bitmap);
			addChild(box);
			
			box.mouseChildren = false;
			box.mouseEnabled = true;
			box.doubleClickEnabled = true;
			box.addEventListener(MouseEvent.DOUBLE_CLICK,function(e:MouseEvent):void
			{
				if(stage.displayState == StageDisplayState.FULL_SCREEN)
				{
					stage.displayState = StageDisplayState.NORMAL;
					return;
				}
				stage.displayState = StageDisplayState.FULL_SCREEN;
			})
			stage.addEventListener(Event.RESIZE,function():void
			{
				autoAlign();
			});
			autoAlign();
		}
		
		public function autoAlign():void
		{
			_bitmap.width = stage.stageWidth;
			_bitmap.height = stage.stageHeight;
		}
	}
}