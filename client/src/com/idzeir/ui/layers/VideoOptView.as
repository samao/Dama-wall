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
	import com.idzeir.event.EventType;
	import com.idzeir.manager.ContextType;
	import com.idzeir.media.video.IVideoPlayer;
	import com.idzeir.timer.impl.Ticker;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.TimeLabel;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.display.Sprite;
	import flash.events.Event;
	
	public class VideoOptView extends OptView
	{
		private var _bglayer:Sprite;
		
		private var contentBox:HBox;
		
		public function VideoOptView()
		{
			FilterUtil.border(this);
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
			
			const playBtn:Button =  new Button(function():void
			{
				fire(EventType.VIDEO_TOGGLE,playBtn.selected);
			});
			playBtn.overSkin = null;
			playBtn.selectSkin = new V3Pause();
			playBtn.normalSkin = new V3Play();
			playBtn.selected = true;
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
			
			const listBtn:Button = new Button(function():void{
				toggleVideoList(listBtn.selected)
			});
			listBtn.overSkin = listBtn.selectSkin = null;
			listBtn.normalSkin = new V3List();
			listBtn.setSize(24,24);
			
			contentBox.addChild(preBtn);
			contentBox.addChild(playBtn);
			contentBox.addChild(nextBtn);
			contentBox.addChild(volBtn);
			contentBox.addChild(listBtn);
			
			createProgressBar();
			
			addChild(_bglayer);
			addChild(contentBox);
		}
		
		private function toggleVideoList(open:Boolean):void
		{
			fire(EventType.TOGGLE_VIDEO_LIST,open);
		}
		
		private function createProgressBar():void
		{
			var proBox:HBox = new HBox();
			proBox.gap = 3;
			proBox.algin = HBox.MIDDLE;
			
			const curTime:TimeLabel = new TimeLabel(0);
			const slider:HSlider = new HSlider();
			slider.scaleThumb = false;
			slider.thumbSkin = createThumb();
			slider.bgColor = Color.Black;
			slider.bgAlpha = .3;
			slider.setSize(210,3);
			slider.addEventListener(Event.CHANGE,function():void
			{
				fire(EventType.SEEK, slider.value);
			});
			
			const durTime:TimeLabel = new TimeLabel(0);
			
			proBox.addChild(curTime);
			proBox.addChild(slider);
			proBox.addChild(durTime);
			
			contentBox.addChild(DrawUtil.drawRectRound(1,24,Color.Line));
			contentBox.addChild(proBox);
			
			var player:IVideoPlayer
			Ticker.getInstance().call(1000, function():void
			{
				player ||= getPlayer();
				if(player && !slider.draging)
				{
					if(slider.max !== player.duration)
						durTime.time = slider.max = player.duration;
					if(slider.value !== player.time)
						curTime.time = slider.value = player.time;
				}
			});
			
			//初始化UI显示
			player ||= getPlayer();
			if(player) 
			{
				durTime.time = slider.max = player.duration;
				curTime.time = slider.value = player.time;
			}
		}
		
		private function getPlayer():IVideoPlayer
		{
			return $(ContextType.PLAYER)
		}
		
		private function createThumb():Button
		{
			var but:Button = new Button();
			but.selectSkin = null;
			but.overSkin = null;
			var skin:Sprite = new Sprite();
			skin.graphics.lineStyle(1, Color.Border);
			skin.graphics.beginFill(Color.White);
			skin.graphics.drawCircle(0, 0, 7);
			skin.graphics.endFill();
			but.normalSkin = skin;
			return but;
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