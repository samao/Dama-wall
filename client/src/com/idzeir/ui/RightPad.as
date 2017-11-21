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
	
	import flash.geom.Rectangle;
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
			
			const videoTitle: Label = new Label('预览',Color.TITLE);
			videoTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.TITLE,true);
			
			const video: VideoPlayer = VideoPlayer.create();
			video.opaqueBackground = 0x000000;
			video.viewPort = new Rectangle(0,0,265,165);
			video.connect(MediaProxyType.HTTP,'http://i.acfun.tv/h5/vod/ac3618875.mp4');
			
			warpBox.addChild(videoTitle);
			warpBox.addChild(video);
			
			addChild(warpBox);
		}
	}
}