/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 4, 2017 2:47:30 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.greensock.TweenNano;
	import com.greensock.easing.Linear;
	import com.idzeir.draw.Mirro;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	
	public class DanmuLine extends Sprite
	{
		public static const LINE_H:uint = Mirro.getInstance().height / 12;
		
		private static const START_Y:uint = Mirro.getInstance().width; 
		
		private var _index:uint = 0;
		
		private var _danmuBox:Sprite;
		
		public function DanmuLine(index:uint)
		{
			super();
			var bglayer:Shape = DrawUtil.drawRectRound(1,1,Color.Background);
			bglayer.alpha = 0;
			addChild(bglayer);
			_index = index;	
			_danmuBox = new Sprite();
			addChild(_danmuBox);
		}
		
		public function addDanmu(msg:String):void
		{
			var danmu:DanmuElement = DanmuElement.createDanmu(msg);
			danmu.x = START_Y;
			danmu.y = LINE_H - danmu.height >> 1;
			addChild(danmu);
			
			TweenNano.to(danmu, 10, {x: -danmu.width,onComplete:function():void{
				DanmuElement.recyleDanmu(danmu);
			},ease:Linear.easeNone})
		}
	}
}