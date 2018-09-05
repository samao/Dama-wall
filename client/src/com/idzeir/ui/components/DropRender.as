/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 20, 2017 4:18:26 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.impl.LabelRender;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Sprite;
	
	public class DropRender extends LabelRender
	{
		public function DropRender(handler:Function=null)
		{
			const W:uint = 75, H:uint = 30;
			this.normalSkin = DrawUtil.drawRectRoundTo(W,H,Color.White,new Sprite(), 8); 
			this.overSkin = DrawUtil.drawRectRoundTo(W,H,Color.Hover,new Sprite(), 8); 
			this.selectSkin = null;
			this.setSize(W,H);
		}
		
		override public function startup(value:*):void
		{
			_data = value;
			label = value.title;
		}
	}
}
