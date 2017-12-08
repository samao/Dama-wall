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
	import com.idzeir.components.v2.Box;
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.data.Provider;
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.event.EventType;
	import com.idzeir.ui.components.LayerRender;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class Layers extends UIContainer
	{

		private var noLayer:TextField;

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
			
			const layerBox:Box = new Box();
			layerBox.setSize(600 - 2 * Gap.PADDING, 110);
			
			noLayer = new TextField();
			noLayer.autoSize = 'left';
			noLayer.defaultTextFormat = new TextFormat(Style.font,24,Color.Border,true);
			noLayer.text = '未创建显示层'
			noLayer.mouseEnabled = false;
			noLayer.x = layerBox.width - noLayer.width >> 1;
			noLayer.y = layerBox.height - noLayer.height >> 1;
			
			const layers:List = new List(LayerRender);
			FilterUtil.border(layers);
			layers.bgColor = Color.Background;
			layers.sliderBglayerColor = 0x99ffcc;
			layers.sliderBglayerAlpha = .8;
			layers.scaleThumb = false;
			layers.thumbSkin = createThumb();
			layers.setSize(600 - 2 * Gap.PADDING, 110);
			const dp:Provider = new Provider();
			layers.dataProvider = dp;
			//测试数据
			/*addLayer(LayerType.IMAGE,dp);
			addLayer(LayerType.CAMERA,dp);
			addLayer(LayerType.VIDEO,dp);
			addLayer(LayerType.COLOR,dp)
			addLayer(LayerType.TEXT,dp);*/
			
			layerBox.addChild(layers);
			layerBox.addChild(noLayer);
			
			warpBox.addChild(titleTxt);
			warpBox.addChild(layerBox);
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
			on(EventType.DELETE_LAYER, function(e:DEvent):void
			{
				const item:* = e.data[0];
				dp.removeItem(item);
				noLayer.visible = dp.size === 0;
			});
			
			on(EventType.ADD_LAYER,function(e:DEvent):void
			{
				addLayer(e.data[0], dp);
			});
		}
		
		private function addLayer(type:String,dp:Provider):void
		{
			dp.addItemAt(0, {title:'图层 ('+(dp.size+1)+') - 类型 [' + type+']', type:type});
			noLayer.visible = false;
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