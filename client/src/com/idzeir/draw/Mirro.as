/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 29, 2017 4:53:26 PM
 * ===================================
 */

package com.idzeir.draw
{
	import com.idzeir.timer.api.ITicker;
	import com.idzeir.timer.impl.Ticker;
	
	import flash.display.DisplayObject;

	public class Mirro
	{
		private static var _instance:Mirro;
		/** 原始画布宽 */
		public const width:uint = 960;
		/** 原始画布高 */
		public const height:uint = 540;
		
		private var _bitmapFrame:BitmapFrame = new BitmapFrame(width,height);
		/**
		 * 绘制画布帧频 
		 */		
		private const FPS:uint = 15;
		
		public static function getInstance():Mirro
		{
			return _instance ||= new Mirro();
		}
		
		/** 画布绑定绘制的显示对象 */
		public function attach(view:DisplayObject):void
		{
			const ticker:ITicker = Ticker.getInstance()
			if(!ticker.has(update))
			{
				//9fps 网络动画最低帧频
				ticker.call(1000/FPS, update, 0, false, view);
			}
		}
		
		/** 更新画布图像 */
		private function update(view:DisplayObject):void
		{
			_bitmapFrame.lock();
			_bitmapFrame.draw(view, null, null, null, null, true);
			_bitmapFrame.unlock();
		}
		
		/** 获取画布图像 */
		public function get bitmapFrame():BitmapFrame
		{
			return _bitmapFrame;
		}
	}
}

import flash.display.BitmapData;

class BitmapFrame extends BitmapData
{
	public function BitmapFrame(width:uint, height:uint)
	{
		super(width, height, false, 0x000000);
	}
	/** 禁止外部销毁画布 */
	override public function dispose():void{};
}
