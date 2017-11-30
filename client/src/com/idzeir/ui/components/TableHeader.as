/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 30, 2017 4:47:00 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.utils.DrawUtil;
	
	public class TableHeader extends UIContainer
	{
		protected var _textColor:uint = Color.Black;
		protected var _rates:Array;
		protected var _labes:Array;
		
		protected var pieces:Vector.<Button> = new Vector.<Button>();

		protected var _warpBox:HBox;
		
		public function TableHeader(rates:Array,labes:Array)
		{
			_rates = rates;
			_labes = labes;
			createChildren();
			setSize(300, 30);
		}
		
		private function createChildren():void
		{
			_warpBox = new HBox();
			_warpBox.gap = 1;
			_warpBox.algin = HBox.MIDDLE;
			
			_rates.forEach(function(e:Number,index:int,arr:Array):void
			{
				var piece:Button = new Button();
				piece.mouseEnabled = piece.buttonMode = false;
				piece.selectSkin = piece.overSkin = null;
				const normalSkin:UIContainer = new UIContainer();
				piece.normalSkin = normalSkin;
				piece.userData = normalSkin;
				piece.label = _labes[index];
				pieces.push(piece);
				_warpBox.addChild(piece);
			});
			
			addChild(_warpBox);
		}
		
		override public function set bgColor(value:int):void
		{
			super.bgColor = value;
			vaild();
		}
		
		public function set textColor(value:uint):void
		{
			_textColor = value;
			updatePiece();
		}
		
		protected function updatePiece():void
		{
			pieces.forEach(function(btn:Button,index:int,arr:Vector.<Button>):void
			{
				const W:Number = _width * _rates[index];
				btn.labelColor = _textColor;
				btn.setSize(W, _height)
				DrawUtil.drawRectRoundTo(W,_height,_bgColor, btn.userData)
			});
			_warpBox.immediateUpdate();
		}
		
		override public function set width(value:Number):void
		{
			super.width = value;
			updatePiece();
		}
		
		override public function setSize(w:Number, h:Number):void
		{
			super.setSize(w, h);
			updatePiece();
		}
		
		override public function immediateUpdate():void
		{
			DrawUtil.drawRectRoundTo(_width,_height, Color.Border, this, 6);
		}
	}
}