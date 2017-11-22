/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 22, 2017 6:34:15 PM
 * ===================================
 */

package com.idzeir.ui.utils
{
	public class TimeUtil
	{
		public static function format(time:uint): String
		{
			var _hours:* = Math.floor(time / 3600);
			_hours = isNaN(_hours) ? (0) : (_hours);
			var _mins:* = Math.floor(time % 3600 / 60);
			_mins = isNaN(_mins) ? (0) : (_mins);
			var _seconds:* = Math.floor(time % 3600 % 60);
			_seconds = isNaN(_seconds) ? (0) : (_seconds);
			return (_hours == 0 ? ("") : (_hours < 10 ? ("0" + _hours.toString() + ":") : (_hours.toString() + ":"))) + (_mins < 10 ? ("0" + _mins.toString()) : (_mins.toString())) + ":" + (_seconds < 10 ? ("0" + _seconds.toString()) : (_seconds.toString()));
		}
	}
}