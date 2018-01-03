/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Jan 3, 2018 4:19:13 PM
 * ===================================
 */

package com.idzeir.manager.user.impl
{
	import com.idzeir.manager.user.api.IUser;
	
	public class User implements IUser
	{
		private var _user:String,
					_pwd:String;
		
		public function save(user:String, pwd:String):void
		{
			_user = user;
			_pwd = pwd;
		}
		
		public function get name():String
		{
			return _user;
		}
		
		public function get pwd():String
		{
			return _pwd;
		}
	}
}