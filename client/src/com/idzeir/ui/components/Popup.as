/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 11, 2017 11:02:16 AM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.events.Event;
	
	public class Popup extends Box
	{
		protected var _titleTxt:Label;

		protected var _closeBtn:Button;

		protected var _line:HLine;
		
		protected var _popBox:UIContainer;
		
		protected var _popBglayer:Sprite = new Sprite();
		
		protected var _modLayer:Sprite = new Sprite();
		
		public function Popup(stage:Stage)
		{
			super();
			
			createChildren();
			
			FilterUtil.border(this);
			
			addEventListener(Event.ADDED_TO_STAGE,function():void
			{
				removeEventListener(Event.ADDED_TO_STAGE,arguments.callee);
				vaild();
			});
			stage.addChild(this);
		}
		
		private function createChildren():void
		{
			addChild(_modLayer);
			_modLayer.alpha = .3;
			_popBox = new UIContainer();
			_popBox.addChild(_popBglayer);
			
			_titleTxt = new Label('',Color.Primary,false, 200);
			
			_closeBtn = new Button(function():void
			{
				removeFromParent();
			});
			_closeBtn.setSize(10, 10);
			_closeBtn.normalSkin = new V3Close();
			_closeBtn.selectSkin = _closeBtn.overSkin = null;
			
			_popBox.addChild(_titleTxt);
			_popBox.addChild(_closeBtn);
			
			addChild(_popBox);
			
			createBody();
		}
		
		/**
		 * 设置弹出框标题 
		 * @param value
		 */		
		public function set title(value:String):void
		{
			_titleTxt.text = value;
		}
		
		/**
		 * pop框覆盖创建body 
		 */		
		protected function createBody():void
		{
			_line = new HLine()
			_popBox.addChild(_line);
		}
		
		override public function immediateUpdate():void
		{
			if(_setWH)
			{
				_titleTxt.move(Gap.LINE_GAP, Gap.LINE_GAP);
				
				_closeBtn.move(_width - _closeBtn.width - Gap.LINE_GAP, Gap.LINE_GAP);
				
				_line.width = _width - 2 * Gap.LINE_GAP;
				_line.move(0, _closeBtn.y + _closeBtn.height);
				
				if(stage)
				{
					DrawUtil.drawRectRoundTo(stage.stageWidth,stage.stageHeight,Color.Black,_modLayer);
					DrawUtil.drawRectRoundTo(_width, _height, Color.White, _popBglayer, 6);
					_popBox.move(stage.stageWidth - _width >> 1, stage.stageHeight - _height >> 1)
				}
			}
		}
	}
}