/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 21, 2017 3:00:16 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.data.Provider;
	import com.idzeir.ui.components.LayerRender;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.display.Shape;
	import flash.text.TextFormat;
	
	public class Layers extends UIContainer
	{
		public function Layers()
		{
			super();
			
			_height = 150;
			
			createChildren();
		}
		
		private function createChildren():void
		{
			const warpBox: VBox = new VBox();
			const titleTxt: Label = new Label('投屏层控制',Color.TITLE);
			titleTxt.defaultTextFormat = new TextFormat(Style.font,null,Color.TITLE,true);
			
			const layers:List = new List(LayerRender);
			layers.sliderBglayerColor = Color.TITLE;
			layers.sliderBglayerAlpha = .8;
			layers.scaleThumb = false;
			layers.thumbSkin = createThumb();
			layers.setSize(600 - 2 * Gap.PADDING, 110);
			const viewMask:Shape = DrawUtil.drawRectRound(layers.width, layers.height,0, 8);
			layers.addRawChild(viewMask);
			layers.mask = viewMask;
			layers.dataProvider = new Provider(['视频','图片','摄像头','视频','图片','摄像头','视频','图片','摄像头'])
			
			warpBox.addChild(titleTxt);
			warpBox.addChild(layers);
			
			warpBox.x = Gap.PADDING;
			addChild(warpBox);
		}
		
		private function createThumb():Button
		{
			const thumb: Button = new Button();
			thumb.setSize(8,30);
			thumb.overSkin = thumb.selectSkin = null;
			thumb.normalSkin = DrawUtil.drawRectRound(8, 30, Color.Light, 4);
			return thumb;
		}
	}
}