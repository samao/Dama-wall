/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 29, 2017 2:40:06 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.components.v2.Box;
	
	import flash.events.MouseEvent;
	
	public class DragableBox extends Box
	{
		public function DragableBox()
		{
			super();
			createChildren();
			addViewListeners()
		}
		
		protected function addViewListeners():void
		{
			addEventListener(MouseEvent.MOUSE_DOWN, onDragHandler)
		}
		
		protected function onDragHandler(event:MouseEvent):void
		{
			removeEventListener(MouseEvent.MOUSE_DOWN, onDragHandler);
			stage.addEventListener(MouseEvent.MOUSE_UP, onDropHandler);
		}
		
		protected function onDropHandler(event:MouseEvent):void
		{
			stage.removeEventListener(MouseEvent.MOUSE_UP, onDropHandler);
			addEventListener(MouseEvent.MOUSE_DOWN, onDragHandler)
		}
		
		protected function createChildren():void
		{
			
		}
	}
}