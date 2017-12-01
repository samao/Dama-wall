/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 30, 2017 2:11:15 PM
 * ===================================
 */

package com.idzeir.ui.windows
{
	import com.greensock.TweenNano;
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.data.Provider;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.IButton;
	import com.idzeir.ui.components.TableRender;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	import com.idzeir.ui.utils.TimeUtil;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	import flash.text.TextFormat;
	
	public class VideoList extends Box
	{
		private var warpBox:VBox;
		
		private var _bgLayer:DisplayObject;

		private var totalText:Label;
		
		public function VideoList()
		{
			createChildren();
			setSize(250,510);
			FilterUtil.border(_bgLayer);
			visible = false;
		}
		
		protected function createChildren():void
		{
			_bgLayer = DrawUtil.drawRectRound(250, 510, Color.Background, 6);
			addChild(_bgLayer);
			warpBox = new VBox();
			warpBox.gap = 10;
			createHeader();
			warpBox.addChild(drawRect(Color.Line, 220,1, new Shape()));
			createOperLine();
			createList();
			addChild(warpBox);
		}
		
		private function createList():void
		{
			var videolist:List = new List(TableRender);
			FilterUtil.border(videolist);
			var dp:Provider = new Provider();
			videolist.dataProvider = dp;
			videolist.scaleThumb = false;
			videolist.thumbSkin = createThumb();
			videolist.bgColor = Color.Background;
			videolist.sliderBglayerColor = 0x99ffcc;
			videolist.sliderBglayerAlpha = .8;
			videolist.setSize(220,420);
			testCreater(dp);
			
			totalText.text = totalText.text.replace('{total}',dp.size);
			warpBox.addChild(videolist);
		}
		
		private function createOperLine():void
		{
			var operBox:UIContainer = new UIContainer();
			var bglayer:DisplayObject = drawRect(0, 220, 20);
			bglayer.alpha = 0;
			operBox.addChild(bglayer);
			operBox.setSize(210, 20);
			
			totalText = new Label('共{total}个视频',Color.Primary);
			totalText.y = operBox.height - totalText.height >> 1;
			
			var addBtn:Button = new Button(function():void{});
			addBtn.selectSkin = null;
			addBtn.normalSkin = new V3Add();
			addBtn.overSkin = new V3AddHover();
			addBtn.setSize(12,12);
			var iconAddBtn:IButton = new IButton(function():void{});
			iconAddBtn.icon = addBtn;
			iconAddBtn.label = '添加到';
			
			var delBtn:Button = new Button();
			delBtn.selectSkin = null;
			delBtn.normalSkin = new V3CrashBox()
			delBtn.overSkin = new V3CrashBoxHover();
			delBtn.setSize(12,12);
			var iconDelBtn:IButton = new IButton(function():void{});
			iconDelBtn.icon = delBtn;
			iconDelBtn.label = '清空';
			
			var optBox:HBox = new HBox();
			optBox.gap = Gap.LINE_GAP;
			optBox.algin = HBox.MIDDLE;
			optBox.addChild(iconAddBtn);
			optBox.addChild(iconDelBtn);
			optBox.x = operBox.width - optBox.width;
			optBox.y = operBox.height - optBox.height >> 1;
			
			operBox.addChild(totalText);
			operBox.addChild(optBox);
			
			warpBox.addChild(operBox);
		}
		
		private function createHeader():void
		{
			var titleTxt:Label = new Label('播放列表',Color.Title,true,200);
			titleTxt.defaultTextFormat = new TextFormat(Style.font,18, Color.Title,true);
			
			warpBox.addChild(titleTxt);
		}
		
		override public function immediateUpdate():void
		{
			if(_setWH)
			{
				DrawUtil.drawRectRoundTo(_width, _height, Color.Background, this, 8);
				warpBox.move(_width - warpBox.width >> 1, _height - warpBox.height >> 1);
			}
		}
		
		public function toggle():void
		{
			if(visible)
			{
				TweenNano.to(this, .5, {x: 610,onComplete:function():void{
						visible = false;
				}});
			} else {
				visible = true;
				TweenNano.to(this, .5, {x:600 - _width - 10});
			}
		}
		
		private function testCreater(dp:Provider):void
		{
			for(var i:uint = 0; i < 32; ++i)
				dp.addItem(['视频'+i+'.mp4',TimeUtil.format(123423 + Math.random() * 125200),'']);
		}
		
		private function createThumb():Button
		{
			const thumb: Button = new Button();
			thumb.setSize(8,30);
			thumb.overSkin = thumb.selectSkin = null;
			thumb.normalSkin = DrawUtil.drawRectRound(8, 30, Color.Title, 6);
			return thumb;
		}
	}
}