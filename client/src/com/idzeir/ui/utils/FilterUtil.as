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
	import flash.display.DisplayObject;
	import flash.filters.DropShadowFilter;

	public class FilterUtil
	{
		public static function border(target:DisplayObject):void
		{
			target.filters = [new DropShadowFilter(3,45,0,.1,6,6,1),new DropShadowFilter(1,-135,0,.1,2,2)];
		}
	}
}