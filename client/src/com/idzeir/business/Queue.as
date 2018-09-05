/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Jun 3, 2015 2:56:03 PM			
 * ===================================
 */

package com.idzeir.business
{
	
	/**
	 * 业务管理实现 
	 */	
	public class Queue implements IQueue
	{
		private var _map:Vector.<ITask> = new Vector.<ITask>();
		
		private static var _instance:Queue;
		
		public function Queue()
		{
			if(_instance)
			{
				throw new Error("单例");
			}
		}
		
		public static function getInstance():Queue
		{
			return _instance ||= new Queue();
		}
		
		public function add(queue:ITask,clear:Boolean = false):IQueue
		{
			clear&&(_map.length = 0);
			_map.push(queue);
			return this;
		}
		
		public function excute(done:Function = null,error:Function = null):void
		{
			const results:Array = [];
			function next(result:* = null):void
			{
				results.push(result);
				if(_map.length > 0)
				{
					_map.shift().enter(next,errorHandler);
				}else{
					done && (done.apply(null, results.slice(1, results.length)));
				}
			}
			
			function errorHandler(reason:String):void
			{
				error && error.apply(null,[reason]);
			}
			next();
		}
	}
}
