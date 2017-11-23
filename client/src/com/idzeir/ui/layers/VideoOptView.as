/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 2:05:52 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.HSlider;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.TimeLabel;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.filters.DropShadowFilter;
	
	public class VideoOptView extends OptView
	{
		private var _bglayer:Sprite;
		
		private var contentBox:HBox;
		
		public function VideoOptView()
		{
			this.filters = [new DropShadowFilter(3,45,0,.1,6,6,1)];
		}
		
		override protected function createChildren():void
		{
			_bglayer = new Sprite();
			
			contentBox = new HBox();
			contentBox.algin = HBox.MIDDLE;
			contentBox.gap = Gap.LINE_GAP;
			
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
			
			contentBox.addChild(preBtn);
			contentBox.addChild(playBtn);
			contentBox.addChild(nextBtn);
			contentBox.addChild(volBtn);
			
			createProgressBar();
			
			addChild(_bglayer);
			addChild(contentBox);
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
			
			contentBox.addChild(DrawUtil.drawRectRound(1,24,Color.Line));
			contentBox.addChild(proBox);
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
				contentBox.move(_width - contentBox.width >> 1, _height - contentBox.height>>1);
			}
		}
		
	}
}