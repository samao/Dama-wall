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

		private var line:Shape;
		public function HLine(width:Number = 600)
		{
			super();
			alpha = .5;
			_height = Gap.PADDING;
			createChildren(width);
			visible = false;
		}
		
		private function createChildren(width:Number = 600):void
		{
			line = new Shape();
			drawRect(Color.Line, width - Gap.PADDING * 2,1,line);
			line.x = Gap.PADDING;
			line.y = _height;
			this.addChild(line);
			vaild();
		}
		
		override public function set width(value:Number):void
		{
			line.width = value;
			super.width = value;
		}
		
		override public function setSize(w:Number, h:Number):void
		{
			line.width = w;
			super.setSize(w,h);
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			visible = true;
		}
	}
}