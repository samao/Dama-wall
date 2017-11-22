/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 3:44:24 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.HSlider;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.ui.components.TimeLabel;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Sprite;
	import flash.events.Event;
	
	public class Footer extends UIContainer
	{
		private var warpBox:HBox;
		private var _bglayer:Sprite;
		
		public function Footer()
		{
			super();
			_bgColor = Color.White;
			setSize(600 - Gap.PADDING*2, 75);
			createChildren();
			visible = false;
		}
		
		private function createChildren():void
		{
			_bglayer = new Sprite();
			
			warpBox = new HBox();
			warpBox.algin = HBox.MIDDLE;
			warpBox.gap = Gap.LINE_GAP;
			
			const preBtn:Button = new Button(function():void{});
			preBtn.selectSkin = preBtn.overSkin = null;
			preBtn.normalSkin = new V3Pre();
			preBtn.setSize(12,12);
			
			const playBtn:Button =  new Button(function():void{});
			playBtn.overSkin = null;
			playBtn.selectSkin = new V3Pause();
			playBtn.normalSkin = new V3Play();
			playBtn.setSize(30,30);
			
			const nextBtn:Button = new Button(function():void{});
			nextBtn.selectSkin = nextBtn.overSkin = null;
			nextBtn.normalSkin = new V3Next();
			nextBtn.setSize(12,12);
			
			const volBtn:Button = new Button(function():void{});
			volBtn.overSkin = null;
			volBtn.selectSkin = new V3Mute();
			volBtn.normalSkin = new V3Volume();
			volBtn.setSize(24,24);
			
			warpBox.addChild(preBtn);
			warpBox.addChild(playBtn);
			warpBox.addChild(nextBtn);
			warpBox.addChild(volBtn);
			
			createProgressBar();
			
			_bglayer.x = Gap.PADDING;
			warpBox.move(_bglayer.x + Gap.PADDING, _height - warpBox.height >> 1);
			
			addChild(_bglayer);
			addChild(warpBox);
		}
		
		private function createProgressBar():void
		{
			var proBox:HBox = new HBox();
			proBox.gap = 3;
			proBox.algin = HBox.MIDDLE;
			
			var duration:uint = 4346;
			var current:uint = 0;
			
			const curTime:TimeLabel = new TimeLabel(current);
			const slider:HSlider = new HSlider();
			slider.scaleThumb = false;
			slider.thumbSkin = createThumb();
			slider.bgColor = Color.Black;
			slider.bgAlpha = .3;
			slider.setSize(250,3);
			slider.addEventListener(Event.CHANGE,function():void
			{
				curTime.time = duration*slider.value;
			});
			
			const durTime:TimeLabel = new TimeLabel(duration);
			
			proBox.addChild(curTime);
			proBox.addChild(slider);
			proBox.addChild(durTime);
			
			warpBox.addChild(DrawUtil.drawRectRound(1,24,Color.Line));
			warpBox.addChild(proBox);
		}
		
		private function createThumb():Button
		{
			const btn:Button = new Button();
			btn.normalSkin = DrawUtil.drawCircle(Color.Primary,10);
			btn.overSkin= btn.selectSkin = null;
			btn.setSize(10,10);
			return btn;
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			if(_setWH) 
			{
				DrawUtil.drawRectRoundTo(_width,_height,_bgColor,_bglayer,6);
				visible = true;
			}
		}
	}
}