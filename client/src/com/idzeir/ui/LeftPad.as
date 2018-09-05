/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 20, 2017 5:16:23 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.event.EventType;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.layers.LayerType;
	
	import flash.display.DisplayObjectContainer;
	import flash.text.TextFormat;
	
	public class LeftPad extends UIContainer
	{
		public function LeftPad()
		{
			super();
			
			_width = 245;
			createChildren();
		}
		
		private function createChildren():void
		{
			var warpBox: VBox = new VBox();
			warpBox.gap = Gap.PADDING;
			
			var titleBox: HBox = new HBox();
			titleBox.algin = HBox.MIDDLE;
			titleBox.gap = 10;
			
			var statusTitle: Label = new Label('播放控制', Color.Title);
			statusTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			var status: Label = new Label('投屏中', Color.Primary);
			
			titleBox.addChild(statusTitle);
			titleBox.addChild(status);
			warpBox.addChild(titleBox);
			
			var startBtn: DButton = new DButton(function start():void {
				fire(EventType.START);
			});
			startBtn.raduis = 45;
			startBtn.label = '开启投屏';
			startBtn.setSize(225,45);
				
			warpBox.addChild(startBtn);
			
			var gridHeader: HBox = new HBox();
			gridHeader.gap = Gap.LINE_GAP;
			createHeader(gridHeader);
			warpBox.addChild(gridHeader);
			
			var gridFooter: HBox = new HBox();
			gridFooter.gap = Gap.LINE_GAP;
			createFooter(gridFooter);
			warpBox.addChild(gridFooter);
			
			addChild(warpBox);
			
			const tips: Label = new Label('<font size="9">关闭状态黑屏不显示弹幕，其它状态都显示弹幕</font>', Color.Title,true,240);
			tips.move(0, 195);
			addChild(tips);
		}
		
		private function createFooter(container: DisplayObjectContainer): void
		{
			const W: uint = 65,H:uint = 30, R: uint = 30;
			var videoBtn: DButton = new DButton(function videoHandler(): void
			{
				fire(EventType.ADD_LAYER,LayerType.VIDEO);
			});
			videoBtn.raduis = R;
			videoBtn.label = '视频';
			videoBtn.setSize(W,H);
			
			var camBtn:DButton = new DButton(function camHandler(): void
			{
				fire(EventType.ADD_LAYER,LayerType.CAMERA);
			});
			camBtn.raduis = R;
			camBtn.label = '摄像头';
			camBtn.setSize(W,H);
			
			var textBtn:DButton = new DButton(function textHandler(): void
			{
				fire(EventType.ADD_LAYER,LayerType.TEXT);	
			});
			textBtn.raduis = R;
			textBtn.label = '文本';
			textBtn.setSize(W,H);
			
			container.addChild(videoBtn);
			container.addChild(camBtn);
			container.addChild(textBtn);
		}
		
		private function createHeader(container: DisplayObjectContainer): void
		{
			const W: uint = 65,H:uint = 30, R: uint = 30;
			var closeBtn: DButton = new DButton(function closeHandler(): void
			{
				
			});
			closeBtn.raduis = R;
			closeBtn.label = '关闭';
			closeBtn.setSize(W,H);
			
			var picBtn:DButton = new DButton(function picHandler(): void
			{
				fire(EventType.ADD_LAYER,LayerType.IMAGE);
			});
			picBtn.raduis = R;
			picBtn.label = '图片';
			picBtn.setSize(W,H);
			
			var pureColor:DButton = new DButton(function pureHandler(): void
			{
				fire(EventType.ADD_LAYER,LayerType.COLOR);
			});
			pureColor.raduis = R;
			pureColor.label = '纯色';
			pureColor.setSize(W,H);
			
			container.addChild(closeBtn);
			container.addChild(picBtn);
			container.addChild(pureColor);
		}
	}
}
