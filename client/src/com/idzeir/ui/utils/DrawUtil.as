/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 21, 2017 4:04:30 PM
 * ===================================
 */

package com.idzeir.ui.utils
{
	import flash.display.Shape;
	import flash.display.Sprite;

	/**
	 * 绘制图形工具
	 */	
	public class DrawUtil
	{
		/**
		 * 绘制圆角矩形
		 * @param width 宽
		 * @param height 高
		 * @param color 颜色
		 * @param radius 角弧度
		 * @return 返回shape
		 */		
		public static function drawRectRound(width:uint, height: uint, color: uint, radius:uint = 0): Shape
		{
			const shape: Shape = new Shape();
			shape.graphics.beginFill(color);
			shape.graphics.drawRoundRect(0,0,width,height,radius, radius);
			shape.graphics.endFill();
			return shape;
		}
		
		/**
		 * 绘制圆
		 * @param color 颜色
		 * @param radius 半径
		 * @return shape
		 */		
		public static function drawCircle(color:uint, radius:uint = 12): Shape
		{
			const shape: Shape = new Shape();
			shape.graphics.beginFill(color);
			shape.graphics.drawCircle(0,0,radius);
			shape.graphics.endFill();
			return shape;
		}
		
		/**
		 * 绘制圆角矩形到显示对象
		 * @param width 宽
		 * @param height 高
		 * @param color 颜色
		 * @param target 绘制目标
		 * @param radius 圆角弧度
		 * @return 返回该显示对象
		 */		
		public static function drawRectRoundTo(width:uint, height: uint, color: uint, target:Sprite,radius:uint = 0): Sprite
		{
			target.graphics.clear();
			target.graphics.beginFill(color);
			target.graphics.drawRoundRect(0,0,width,height,radius, radius);
			target.graphics.endFill();
			return target;
		}
	}
}
