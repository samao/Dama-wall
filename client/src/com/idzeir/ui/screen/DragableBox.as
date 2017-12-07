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
	import com.idzeir.dispatch.EventType;
	import com.idzeir.draw.Mirro;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class DragableBox extends Box
	{
		private var _controlLayer:Sprite;
		
		private var _viewPort:Rectangle;
		
		public function DragableBox(w:Number, h:Number)
		{
			_viewPort = new Rectangle(0, 0, w, h);
			super();
			createChildren();
			addViewListeners()
		}
		
		private function get scale():Object
		{
			return {x:_viewPort.width/Mirro.getInstance().width,y:_viewPort.height/Mirro.getInstance().height}
		}
		
		protected function addViewListeners():void
		{
			addEventListener(MouseEvent.MOUSE_DOWN, onDragHandler)
		}
		
		protected function onDragHandler(event:MouseEvent):void
		{
			removeEventListener(MouseEvent.MOUSE_DOWN, onDragHandler);
			stage.addEventListener(MouseEvent.MOUSE_UP, onDropHandler);
			
			startDrag(false, new Rectangle(0,0, _viewPort.width - _width * scale.x, _viewPort.height - _height * scale.y));
		}
		
		protected function onDropHandler(event:MouseEvent):void
		{
			stage.removeEventListener(MouseEvent.MOUSE_UP, onDropHandler);
			addEventListener(MouseEvent.MOUSE_DOWN, onDragHandler)
			
			stopDrag();
			
			fire(EventType.ELEMENT_MOVED,new Point(x/scale.x,y/scale.y));
		}
		
		protected function createChildren():void
		{
			_controlLayer = new Sprite();
			_controlLayer.alpha = .3;
			addChild(_controlLayer);
		}
		
		override public function immediateUpdate():void
		{
			DrawUtil.drawRectRoundTo(_width * scale.x,_height * scale.y, Color.Red, _controlLayer);
		}
	}
}