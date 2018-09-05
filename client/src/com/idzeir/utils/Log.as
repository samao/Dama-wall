/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Jun 3, 2015 5:46:20 PM			
 * ===================================
 */

package com.idzeir.utils
{
	import flash.external.ExternalInterface;
	
	public final class Log
	{
		/**
		 * 数字越大信息越多，0只输出error，1增加warn，2增加info，3增加log，4增加debug
		 */		
		public static var level:uint;
		/**
		 * 是否在flash平台trace日志 
		 */		
		public static var useTracer:Boolean = false;
		
		private static const LEVEL_TYPE:Array = ["INFO","LOG","LOG","WARN","ERROR"];
		
		public static function debug(...value):void
		{
			if(level>=4)
				out(LEVEL_TYPE[0],value.join(" "));
		}
		
		public static function log(...value):void
		{
			if(level>=3)
				out(LEVEL_TYPE[1],value.join(" "));
		}
		
		public static function info(...value):void
		{
			if(level>=2)
				out(LEVEL_TYPE[2],value.join(" "));
		}
		
		public static function warn(...value):void
		{
			if(level>=1)
				out(LEVEL_TYPE[3],value.join(" "));
		}
		
		public static function error(...value):void
		{
			out(LEVEL_TYPE[4],value.join(" "));
		}
		
		private static function now():String
		{
			var t:Date = new Date();
			return t.toLocaleTimeString();
		}
		
		private static function out(type:String,value:String):void
		{
			var format:String = "[" + type + "] " +  now() + " -- " + value;
			if(ExternalInterface.available)
			{
				try{
					ExternalInterface.call("console."+type.toLowerCase(),format);
				}catch(e:Error){
					trace("~"+format);
					return;
				}
			}
			
			if(useTracer)
				trace(format);
		}
		
	}
}
