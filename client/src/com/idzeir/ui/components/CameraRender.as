/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 5:42:54 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.impl.LabelRender;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Sprite;
	
	public class CameraRender extends LabelRender
	{
		public function CameraRender(handler:Function=null)
		{
			const W:uint = 120, H:uint = 30;
			this.normalSkin = DrawUtil.drawRectRoundTo(W,H,Color.White,new Sprite(), 8); 
			this.overSkin = DrawUtil.drawRectRoundTo(W,H,Color.Hover,new Sprite(), 8); 
			this.selectSkin = null;
			setSize(120,30);
		}
	}
}