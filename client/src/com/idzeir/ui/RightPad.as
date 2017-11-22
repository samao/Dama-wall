/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 5:16:59 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.media.impl.MediaProxyType;
	import com.idzeir.media.video.VideoPlayer;
	
	import flash.desktop.NativeApplication;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filesystem.File;
	import flash.geom.Rectangle;
	import flash.net.FileReference;
	import flash.text.TextFormat;
	
	public class RightPad extends UIContainer
	{
		public function RightPad()
		{
			super();
			
			createChildren();
		}
		
		private function createChildren():void
		{
			const warpBox: VBox = new VBox();
			
			const videoTitle: Label = new Label('预览',Color.Title);
			videoTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			
			const video: VideoPlayer = VideoPlayer.create();
			video.opaqueBackground = 0x000000;
			video.viewPort = new Rectangle(0,0,265,165);
			video.mute = true;
			
			//选择本地视频
			var file:File = new File();
			video.mouseEnabled = true;
			videoTitle.addEventListener(MouseEvent.CLICK,function():void
			{
				file.browse()
			});
			file.addEventListener(Event.SELECT,function():void
			{
				video.connect(MediaProxyType.HTTP,file.url);
			});
			const appPath: String = File.applicationDirectory.nativePath;
			var vodUrl:String = File.applicationDirectory.resolvePath(appPath + File.separator + '..' + File.separator + 'vod' + File.separator + 'ac4053541.mp4').url;
			video.connect(MediaProxyType.HTTP,vodUrl);
			
			warpBox.addChild(videoTitle);
			warpBox.addChild(video);
			
			addChild(warpBox);
		}
	}
}