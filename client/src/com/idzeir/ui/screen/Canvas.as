/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 29, 2017 2:39:15 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Image;
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.draw.Mirro;
	import com.idzeir.event.EventType;
	import com.idzeir.manager.ContextType;
	import com.idzeir.media.impl.MediaProxyStates;
	import com.idzeir.media.impl.MediaProxyType;
	import com.idzeir.media.video.VideoPlayer;
	import com.idzeir.utils.Log;
	
	import flash.filesystem.File;
	import flash.geom.Rectangle;
	
	public class Canvas extends Box
	{
		private var _video:VideoPlayer;

		private var _danmuLayer:DanmuLayer;
		
		public function Canvas()
		{
			super();
			//绑定绘制
			const _mirr:Mirro = Mirro.getInstance();
			_mirr.attach(this);
			//原始画布尺寸
			setSize(_mirr.width, _mirr.height);
			//创建ui
			createChildren();
			//监听全局消息
			register();
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
			
			$(ContextType.PLAYER, _video);
		}
		
		private function videoHandler(code:String,...info):void
		{
			switch(code) {
				case MediaProxyStates.STREAM_STOP:
					Log.info('播放结束，重新播放');
					_video.time = 0;
					_video.start();
					break;
				case MediaProxyStates.CONNECT_NOTIFY:
					Log.info('播放吧老板');
					break;
				case MediaProxyStates.DURATION_NOTIFY:
					fire(EventType.DURATION_UPDATE);
					break;
				case MediaProxyStates.PROXY_ERROR:
					
					break;
				default:
					
					break;
			}
		}
		
		private function register():void
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
				
				on(EventType.ELEMENT_MOVED,function(e:DEvent):void
				{
					var pos:Object = e.data[0]
					img.move(pos.x,pos.y);
				});
			});
			
			on(EventType.SEEK,function(e:DEvent):void
			{
				_video.time = e.data[0];
			});
			on(EventType.VIDEO_TOGGLE, function(e:DEvent):void
			{
				_video.toggle();
			})
			on(EventType.PLAY_URL,function(e:DEvent):void
			{
				_video.dispose();
				_video.connect(MediaProxyType.HTTP, e.data[0],null, videoHandler);
			});
		}		
	}
}
