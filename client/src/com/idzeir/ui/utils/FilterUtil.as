/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 27, 2017 5:33:00 PM
 * ===================================
 */

package com.idzeir.ui.utils
{
	import com.idzeir.ui.screen.DanmuElement;
	
	import flash.display.DisplayObject;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;

	public class FilterUtil
	{
		public static function danmu(dm:DanmuElement):void
		{
			const color:int = dm.color;
			const red:int = color >> 16 & 0xFF;
			const green:int = color >> 8 & 0xFF;
			const blue:int = color & 0xFF;
			
			const border:int = (red ^ 0xFF) << 16 | (green ^ 0xFF) << 8 | (blue ^ 0xFF);
			
			dm.filters = [new DropShadowFilter(1, 0, border, .5, 1, 1), new GlowFilter(border, .5, 2, 2, 1)];
		}
		
		public static function border(target:DisplayObject):void
		{
			target.filters = [new DropShadowFilter(3, 45, 0, .1, 6, 6, 1), new DropShadowFilter(1, -135, 0, .1, 2, 2)];
		}
		
		public static function horBorder(target:DisplayObject):void
		{
			target.filters = [new DropShadowFilter(1, 0, 0, 1, 1, 1, 1), new DropShadowFilter(1, 180, 0, .1, 1, 1)];
		}
	}
}