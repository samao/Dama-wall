/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Jan 3, 2018 4:17:57 PM
 * ===================================
 */

package com.idzeir.manager.user.api
{
	public interface IUser
	{
		function save(user:String, pwd: String):void;
		
		function get name():String;
		
		function get pwd():String;
	}
}