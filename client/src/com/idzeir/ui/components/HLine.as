/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 5:04:50 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	
	import flash.display.Shape;
	
	public class HLine extends UIContainer
	{
		public function HLine()
		{
			super();
			alpha = .5;
			_height = Gap.PADDING;
			createChildren();
		}
		
		private function createChildren():void
		{
			var line: Shape = new Shape();
			drawRect(Color.LINE, 600 - Gap.PADDING * 2,1,line);
			line.x = Gap.PADDING;
			line.y = _height;
			this.addChild(line);
		}
	}
}