/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 22, 2017 6:40:21 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.Style;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.TimeUtil;
	
	import flash.display.Sprite;
	import flash.text.TextFormat;
	
	public class TimeLabel extends Button
	{
		public function TimeLabel(time:uint)
		{
			super();
			this.mouseEnabled = false;
			this.overSkin = this.selectSkin = null;
			this.normalSkin = new Sprite();
			this.labelFormat = new TextFormat(Style.font,null,Color.Black,false);
			this.setSize(60,20);
			this.time = time;
		}
		
		public function set time(value:uint):void
		{
			this.label = TimeUtil.format(value);
		}
	}
}