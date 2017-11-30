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
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.dispatch.EventType;
	import com.idzeir.draw.Mirro;
	import com.idzeir.media.impl.MediaProxyType;
	import com.idzeir.media.video.VideoPlayer;
	
	import flash.filesystem.File;
	import flash.geom.Rectangle;
	
	public class Canvas extends Box
	{
		private var _video:VideoPlayer;
		
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
			_video.connect(MediaProxyType.HTTP,vodUrl);
			Mirro.getInstance().attach(this);
			addChild(_video);
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
		}		
		
	}
}