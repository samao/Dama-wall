/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 20, 2017 3:43:58 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.screen.Canvas;
	
	public class Body extends UIContainer
	{
		public function Body()
		{
			super();
			_height = 190;
			createChildren();
		}
		
		private function createChildren():void
		{
			const warpBox: HBox = new HBox();
			warpBox.gap = Gap.PADDING;
			
			const leftPad:LeftPad = new LeftPad();
			const rightPad: RightPad = new RightPad();
			
			warpBox.addChild(leftPad);
			warpBox.addChild(rightPad);
			warpBox.x = Gap.PADDING;
			addChild(warpBox);

			//不可见画布源
			new Canvas();
		}
	}
}
