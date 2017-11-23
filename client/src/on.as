/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 10:31:24 AM
 * ===================================
 */

package
{
	import com.idzeir.dispatch.Dispatcher;

	public function on(type:String, handler:Function):void
	{
		Dispatcher.get().on(type,handler);
	}
}