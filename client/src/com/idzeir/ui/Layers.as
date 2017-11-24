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
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.dispatch.EventType;
	import com.idzeir.ui.components.LayerRender;
	import com.idzeir.ui.layers.LayerType;
	import com.idzeir.ui.utils.DrawUtil;
	
	import flash.filters.DropShadowFilter;
	import flash.text.TextFormat;
	
	public class Layers extends UIContainer
	{
		public function Layers()
		{
			super();
			
			_height = 120;
			
			createChildren();
		}
		
		private function createChildren():void
		{
			const warpBox: VBox = new VBox();
			const titleTxt: Label = new Label('投屏层控制',Color.Title);
			titleTxt.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			
			const layers:List = new List(LayerRender);
			layers.filters = [new DropShadowFilter(3,45,0,.1,6,6,1)]
			layers.bgColor = Color.Background;
			layers.sliderBglayerColor = 0x99ffcc;
			layers.sliderBglayerAlpha = .8;
			layers.scaleThumb = false;
			layers.thumbSkin = createThumb();
			layers.setSize(600 - 2 * Gap.PADDING, 110);
			const dp:Provider = new Provider();
			
			//测试数据
			addLayer(LayerType.IMAGE,dp);
			addLayer(LayerType.CAMERA,dp);
			addLayer(LayerType.IMAGE,dp);
			addLayer(LayerType.VIDEO,dp);
			addLayer(LayerType.COLOR,dp)
			layers.dataProvider = dp;
			
			warpBox.addChild(titleTxt);
			warpBox.addChild(layers);
			warpBox.x = Gap.PADDING;
			addChild(warpBox);
			
			on(EventType.BRING_LAYER_UP,function(e:DEvent):void
			{
				const item:* = e.data[0];
				dp.setItemAt(dp.indexOf(item) - 1, item);
			});
			on(EventType.BRING_LAYER_DOWN,function(e:DEvent):void
			{
				const item: * = e.data[0];
				dp.setItemAt(dp.indexOf(item) + 1, item);
			});
		}
		
		private function addLayer(type:String,dp:Provider):void
		{
			dp.addItemAt(0, {title:'图层 ('+(dp.size+1)+') - 类型 [' + type+']', type:type});
		}
		
		private function createThumb():Button
		{
			const thumb: Button = new Button();
			thumb.setSize(8,30);
			thumb.overSkin = thumb.selectSkin = null;
			thumb.normalSkin = DrawUtil.drawRectRound(8, 30, Color.Title, 6);
			return thumb;
		}
	}
}