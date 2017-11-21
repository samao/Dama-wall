/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 21, 2017 4:04:30 PM
 * ===================================
 */

package com.idzeir.ui.utils
{
	import flash.display.Shape;

	public class DrawUtil
	{
		public static function drawRectRound(width:uint, height: uint, color: uint, radius:uint = 0): Shape
		{
			const shape: Shape = new Shape();
			shape.graphics.beginFill(color);
			shape.graphics.drawRoundRect(0,0,width,height,radius, radius);
			shape.graphics.endFill();
			return shape;
		}
	}
}