/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 10:28:34 AM
 * ===================================
 */

package
{
	import com.idzeir.dispatch.Dispatcher;

	public function fire(type:String,...data):void
	{
		Dispatcher.get().fire.apply(null,data?[type].concat(data):[type]);
	}
}