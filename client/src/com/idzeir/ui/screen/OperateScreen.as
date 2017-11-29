/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 29, 2017 5:30:32 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.draw.Mirro;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.display.Bitmap;
	
	public class OperateScreen extends UIContainer
	{
		private var _video:Bitmap;
		public function OperateScreen()
		{
			FilterUtil.border(this);
			createChildren();
			super();
		}
		
		private function createChildren():void
		{
			_video = new Bitmap(Mirro.getInstance().bitmapFrame, 'auto',true);
			_video.width = _width;
			_video.height = _height;
			addChild(_video);
		}
		
		override public function immediateUpdate():void
		{
			_video.width = _width;
			_video.height = _height;
		}
	}
}