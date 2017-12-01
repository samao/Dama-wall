/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 30, 2017 5:38:50 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.api.IItemRender;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.DisplayObject;
	
	public class TableRender extends TableHeader implements IItemRender
	{
		private var _data:*;
		
		public function TableRender()
		{
			super([1], ['']);
			_warpBox.gap = 0;
			_bgColor = Color.White;
		}
		
		public function startup(value:*):void
		{
			_data = value;
			updatePiece();
		}
		
		override protected function updatePiece():void
		{
			if(!_data) return;
			pieces.forEach(function(btn:Button,index:int,arr:Vector.<Button>):void
			{
				const W:Number = _width * _rates[index];
				btn.label = _data[index];
				btn.labelColor = Color.Black;
				btn.setSize(W, _height)
			});
			_warpBox.immediateUpdate();
		}
		
		override public function immediateUpdate():void
		{
			DrawUtil.drawRectRoundTo(_width, _height, _bgColor,this);
		}
		
		public function get warp():DisplayObject
		{
			return this;
		}
		
		public function over():void
		{
			_bgColor = Color.Hover;
			vaild();
		}
		
		public function select():void
		{
		}
		
		public function unselect():void
		{
		}
		
		public function out():void
		{
			_bgColor = Color.White;
			vaild();
		}
		
		public function get data():*
		{
			return _data;
		}
		
		public function disable(bool:Boolean):void
		{
		}
	}
}