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
	
	/**
	 * 弹幕行
	 */	
	public class DanmuLine extends Sprite
	{
		/** 显示弹幕行高 */
		public static const LINE_H:uint = Mirro.getInstance().height / 15;
		
		/** 弹幕初始x位置 */
		private static const START_X:uint = Mirro.getInstance().width; 
		
		private var _index:uint = 0;
		
		private var _danmuBox:Sprite;
		
		private const SPEED:uint = uint(Mirro.getInstance().width / 50);
		
		public function DanmuLine(index:uint)
		{
			super();
			var bglayer:Shape = DrawUtil.drawRectRound(1, 1, Color.Background);
			bglayer.alpha = 0;
			addChild(bglayer);
			_index = index;
			_danmuBox = new Sprite();
			addChild(_danmuBox);
		}
		
		/**
		 * 添加弹幕
		 * @param msg 弹幕消息
		 */		
		public function addDanmu(msg:Object):void
		{
			const size:uint = LINE_H - 10;
			var danmu:DanmuElement = DanmuElement.createDanmu(msg, size);
			danmu.x = START_X;
			danmu.y = LINE_H - danmu.height >> 1;
			_danmuBox.addChild(danmu);
			//匀速
			const SPEED:uint = (START_X + 40) / 10 + 6 * _index;
			
			TweenNano.to(danmu, (START_X + danmu.width) / SPEED, {x: -danmu.width,onComplete:function():void
			{
				DanmuElement.recyleDanmu(danmu);
			}, ease:Linear.easeNone})
		}
	}
}