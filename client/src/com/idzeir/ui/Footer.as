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
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.ui.layers.CameraOptView;
	import com.idzeir.ui.layers.ColorOptView;
	import com.idzeir.ui.layers.ImageOptView;
	import com.idzeir.ui.layers.LayerType;
	import com.idzeir.ui.layers.TextOptView;
	import com.idzeir.ui.layers.VideoOptView;
	
	import flash.display.DisplayObject;
	import flash.utils.Dictionary;
	
	public class Footer extends UIContainer
	{
		private var warpBox:VBox;
		private var typeTitle:Label;
		
		private var optViewMap:Dictionary = new Dictionary(true);

		private var viewBox:UIContainer;
		
		public function Footer()
		{
			super();
			createChildren();
		}
		
		private function createChildren():void
		{
			const warpBox:VBox = new VBox();
			
			var titleBox:HBox = new HBox();
			titleBox.gap = 10;
			const titleTxt:Label = new Label('详细设置',Color.Title);
			typeTitle = new Label('',Color.Primary,false, 200);
			titleBox.addChild(titleTxt);
			titleBox.addChild(typeTitle);
			
			viewBox = new UIContainer();
			
			warpBox.x = Gap.PADDING;
			warpBox.addChild(titleBox);
			warpBox.addChild(viewBox);
			addChild(warpBox);
		}
		
		private function getView(data:*):UIContainer
		{
			if(!optViewMap.hasOwnProperty(data.type))
			{
				var layer:DisplayObject;
				switch(data.type)
				{
					case LayerType.VIDEO:
						layer = new VideoOptView();
						break;
					case LayerType.IMAGE:
						layer = new ImageOptView();
						break;
					case LayerType.COLOR:
						layer = new ColorOptView();
						break;
					case LayerType.CAMERA:
						layer = new CameraOptView();
						break;
					case LayerType.TEXT:
						layer = new TextOptView();
						break;
					default:
						layer = new UIContainer();
						break;
				}
				optViewMap[data.type] = layer;
			}
			return optViewMap[data.type]
		}
		
		public function setView(data:*):void 
		{
			typeTitle.text = data.title;
			const view:UIContainer = getView(data);
			viewBox.removeChildren();
			viewBox.addChild(view);
		}
	}
}