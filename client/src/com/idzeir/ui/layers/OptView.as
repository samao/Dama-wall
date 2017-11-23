/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 2:48:07 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.Gap;
	
	public class OptView extends UIContainer
	{
		public function OptView()
		{
			super();
			setSize(600 - 2 * Gap.PADDING, 75);
			createChildren();
		}
		
		protected function createChildren():void
		{
			
		}
	}
}