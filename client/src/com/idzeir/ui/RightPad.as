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
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	
	import flash.media.Video;
	
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
			
			const video: Video = new Video(265,165);
			video.opaqueBackground = 0x999999;
			
			warpBox.addChild(videoTitle);
			warpBox.addChild(video);
			
			addChild(warpBox);
		}
	}
}