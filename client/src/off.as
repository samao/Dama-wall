/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 10:35:16 AM
 * ===================================
 */

package
{
	import com.idzeir.dispatch.Dispatcher;

	public function off(type: String, handler:Function = null): void
	{
		Dispatcher.get().off(type,handler);	
	}
}