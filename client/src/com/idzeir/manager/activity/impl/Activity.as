/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Dec 8, 2017 4:58:39 PM
 * ===================================
 */

package com.idzeir.manager.activity.impl
{
	import com.idzeir.manager.activity.api.IActivity;
	
	public class Activity implements IActivity
	{
		private var _activies:Array;
		
		public function Activity()
		{
		}
		
		public function get activies():Array
		{
			return _activies;
		}
		
		public function persist(data:Array):void
		{
			_activies = data;
		}
	}
}
