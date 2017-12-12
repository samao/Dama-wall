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
	import com.adobe.utils.StringUtil;
	import com.greensock.TweenNano;
	import com.idzeir.business.Queue;
	import com.idzeir.business.task.ObtainActivities;
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.event.EventType;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.activity.api.IActivity;
	import com.idzeir.ui.components.Popup;
	import com.idzeir.ui.components.StatusButtton;
	import com.idzeir.ui.utils.DrawUtil;
	
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
			warpBox.gap = 12;
			warpBox.algin = VBox.CENTER;
			
			tabEnabled = false;
			tabChildren = false;
			
			var uBox:HBox = new HBox();
			uBox.gap = Gap.LINE_GAP;
			uBox.algin = HBox.MIDDLE;
			var unameTxt:Label = new Label('用户名:');
			var user:Object = createText();
			var unameInput:Box = user.warp;
			
			var pBox:HBox = new HBox();
			pBox.gap = Gap.LINE_GAP;
			pBox.algin = HBox.MIDDLE;
			var pwdTxt:Label = new Label('密　码:');
			var pwd:Object = createText(true);
			var pwdInput:Box = pwd.warp;
			
			const okBut:StatusButtton = new StatusButtton(function():void
			{
				if(!StringUtil.stringHasValue(user.text()) || !StringUtil.stringHasValue(pwd.text()))
				{
					showError('请输入用户名密码登录')
					return;
				}
				okBut.loading = true;
				Queue.getInstance()
					.add(new ObtainActivities(user.text(),pwd.text()))
					.excute(function():void
					{
						const act:IActivity = $(ContextType.ACTIVITY) as IActivity;
						fire(EventType.ACTIVIES_UPDATE, act.activies);
						removeFromParent();
						fire(EventType.LOGIN_IN);
					},function(reason:String):void 
					{
						okBut.loading = false;
						showError(reason);
					});
			});
			okBut.label = '登录';
			okBut.setSize(80, 24);
			
			function showError(reason:String):void
			{
				infoText.text = reason;
				infoText.move(_width - infoText.width >> 1, _height - infoText.height - 5);
				TweenNano.killTweensOf(infoText);
				infoText.alpha = 1;
				TweenNano.to(infoText, .5, {alpha:0, delay:2});
			}
			
			const infoText:Label = new Label('',Color.Red,false, 280);
			infoText.defaultTextFormat = new TextFormat(Style.font, 10, Color.Red);
			
			uBox.addChild(unameTxt);
			uBox.addChild(unameInput);
			pBox.addChild(pwdTxt);
			pBox.addChild(pwdInput);
			
			warpBox.addChild(uBox);
			warpBox.addChild(pBox);
			warpBox.addChild(okBut);
			
			_popBox.addChild(warpBox);
			_popBox.addChild(infoText);
			
			setSize(280, 180);
		}
		
		private function createText(pwd:Boolean = false): Object
		{
			var text:TextField = new TextField();
			text.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true,null,null,null,null,null,5,5);
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
			return { warp:box, text:function():String { return text.text}};
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