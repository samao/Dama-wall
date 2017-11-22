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
	import flash.display.Sprite;

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
		
		public static function drawCircle(color:uint, radius:uint = 12): Shape
		{
			const shape: Shape = new Shape();
			shape.graphics.beginFill(color);
			shape.graphics.drawCircle(radius,radius,radius);
			shape.graphics.endFill();
			return shape;
		}
		
		public static function drawRectRoundTo(width:uint, height: uint, color: uint, target:Sprite,radius:uint = 0): void
		{
			target.graphics.clear();
			target.graphics.beginFill(color);
			target.graphics.drawRoundRect(0,0,width,height,radius, radius);
			target.graphics.endFill();
		}
	}
}