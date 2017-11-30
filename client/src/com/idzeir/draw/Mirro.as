/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
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
		
		public const width:uint = 1920;
		public const height:uint = 1080;
		
		private var _bitmapFrame:BitmapFrame = new BitmapFrame(width,height);
		
		public static function getInstance():Mirro
		{
			return _instance ||= new Mirro();
		}
		
		public function attach(view:DisplayObject):void
		{
			const ticker:ITicker = Ticker.getInstance()
			if(!ticker.has(update))
			{
				//9fps 网络动画最低帧频
				ticker.call(1000/9, update, 0, false, view);
			}
		}
		
		private function update(view:DisplayObject):void
		{
			_bitmapFrame.draw(view,null,null, null, null, true);
		}
		
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
	override public function dispose():void{};
}