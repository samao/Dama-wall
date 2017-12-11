/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 11, 2017 11:41:51 AM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.components.Popup;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	import flash.display.Stage;
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class LoginPop extends Popup
	{
		private var warpBox:VBox;
		
		public function LoginPop(stage:Stage)
		{
			super(stage);
		}
		
		override protected function createBody():void
		{
			super.createBody();
			
			title = '输入用户名密码登录';
			
			warpBox = new VBox();
			warpBox.gap = Gap.LINE_GAP;
			warpBox.algin = VBox.CENTER;
			
			var uBox:HBox = new HBox();
			uBox.gap = Gap.LINE_GAP;
			uBox.algin = HBox.MIDDLE;
			var unameTxt:Label = new Label('用户名:');
			var unameInput:DisplayObject = createText();
			
			var pBox:HBox = new HBox();
			pBox.gap = Gap.LINE_GAP;
			pBox.algin = HBox.MIDDLE;
			var pwdTxt:Label = new Label('密　码:');
			var pwdInput:DisplayObject = createText(true);
			
			const okBut:DButton = new DButton(function():void
			{
				
			});
			okBut.label = '登录';
			okBut.setSize(80, 24);
			okBut.raduis = okBut.height;
			
			uBox.addChild(unameTxt);
			uBox.addChild(unameInput);
			pBox.addChild(pwdTxt);
			pBox.addChild(pwdInput);
			
			warpBox.addChild(uBox);
			warpBox.addChild(pBox);
			warpBox.addChild(okBut);
			
			_popBox.addChild(warpBox);
			
			setSize(280, 180);
		}
		
		private function createText(pwd:Boolean = false):DisplayObject
		{
			var text:TextField = new TextField();
			text.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			text.type = 'input';
			text.maxChars = 12;
			text.restrict = 'a-z|A-Z|0-9|_';
			text.width = 120;
			text.height = 20;
			text.displayAsPassword = pwd;
			var bglayer:Shape = DrawUtil.drawRectRound(130, 24, Color.Background, 4);
			var box:Box = new Box();
			box.setSize(130, 24);
			box.addChild(bglayer);
			box.addChild(text);
			text.x = text.y = 2;
			return box;
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			if(_setWH)
			{
				warpBox.move(_width - warpBox.width >> 1, 60);
			}
		}
	}
}