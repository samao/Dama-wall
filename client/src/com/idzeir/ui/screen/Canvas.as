/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 29, 2017 2:39:15 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Image;
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.dispatch.EventType;
	import com.idzeir.draw.Mirro;
	import com.idzeir.media.impl.MediaProxyStates;
	import com.idzeir.media.impl.MediaProxyType;
	import com.idzeir.media.video.VideoPlayer;
	
	import flash.filesystem.File;
	import flash.geom.Rectangle;
	
	public class Canvas extends Box
	{
		private var _video:VideoPlayer;

		private var _danmuLayer:DanmuLayer;
		
		public function Canvas()
		{
			super();
			var _mirr:Mirro = Mirro.getInstance()
			//原始画布尺寸
			setSize(_mirr.width, _mirr.height);
			createChildren();
			addListener();
		}
		
		protected function createChildren():void
		{
			_video = VideoPlayer.create();
			_video.viewPort = new Rectangle(0, 0, _width, _height);
			const appPath: String = File.applicationDirectory.nativePath;
			var vodUrl:String = File.applicationDirectory.resolvePath(appPath + File.separator + '..' + File.separator + 'vod' + File.separator + 'ac4053541.mp4').url;
			_video.connect(MediaProxyType.HTTP,vodUrl,null,videoHandler);
			_video.mute = true;
			addChild(_video);
			
			_danmuLayer = new DanmuLayer();
			addChild(_danmuLayer);
			
			Mirro.getInstance().attach(this);
		}
		
		private function videoHandler(code:String,...info):void
		{
			switch(code) {
				case MediaProxyStates.STREAM_STOP:
					trace('播放结束，重新播放');
					_video.time = 0;
					_video.start();
					break;
			}
		}
		
		private function addListener():void
		{
			on(EventType.ADD_LAYER, function(e:DEvent):void
			{
				
			});
			
			on(EventType.DELETE_LAYER, function(e:DEvent):void
			{
				
			});
			
			on(EventType.BRING_LAYER_UP, function(e:DEvent):void
			{
				
			});
			
			on(EventType.BRING_LAYER_DOWN, function(e:DEvent):void
			{
				
			});
			
			on(EventType.BACKGROUND_COLOR, function(e:DEvent):void
			{
				
			});
			
			on(EventType.POST,function(e:DEvent):void
			{
				_danmuLayer.addDanmu(e.data[0]);
			});
			
			on(EventType.ADD_ELEMENT,function(e:DEvent): void
			{
				var img:Image = new Image(e.data[0]);
				img.setSize(100,100);
				addChild(img);
				
				on('moving',function(e:DEvent):void
				{
					var pos:Object = e.data[0]
					img.move(pos.x,pos.y);
				});
			});
		}		
	}
}