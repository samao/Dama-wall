/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 30, 2017 2:11:15 PM
 * ===================================
 */

package com.idzeir.ui.windows
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.data.Provider;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.components.TableHeader;
	import com.idzeir.ui.components.TableRender;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	import com.idzeir.ui.utils.TimeUtil;
	
	import flash.display.Stage;
	import flash.events.NativeWindowBoundsEvent;
	import flash.geom.Rectangle;
	
	public class VideoList extends Window
	{
		public function VideoList(rootStage:Stage, width:uint=0, height:uint=0)
		{
			super(rootStage, width, height);
			title = '播放视频列表';
		}
		
		override protected function setViewPort(w:Number, h:Number):void
		{
			var bounds:Rectangle = new Rectangle(rootBounds.right, rootBounds.top,w, h);
			_window.bounds = bounds;
		}
		
		override protected function addWindowListener():void
		{
			super.addWindowListener();
			_window.addEventListener(NativeWindowBoundsEvent.MOVING,function(e:NativeWindowBoundsEvent):void
			{
				e.preventDefault();
			})
		}
		
		override protected function setupGUI():void
		{
			var warpBox:VBox = new VBox();
			warpBox.gap = 1;
			const widths:Array = [.7, .3]
			var tableHeader:TableHeader = new TableHeader(widths,['视频','时长']);
			tableHeader.bgColor = Color.Primary;
			tableHeader.textColor = Color.White;
			
			var layers:List = new List(TableRender);
			const dp:Provider = new Provider();
			layers.dataProvider = dp;
			
			testCreater(dp);
			
			FilterUtil.border(layers);
			layers.bgColor = Color.Background;
			layers.sliderBglayerColor = 0x99ffcc;
			layers.sliderBglayerAlpha = .8;
			layers.scaleThumb = false;
			layers.thumbSkin = createThumb();
			layers.setSize(300, 500);
			
			var addBox:HBox = new HBox();
			addBox.gap = Gap.PADDING;
			const addBtn:DButton = new DButton(function():void{});
			addBtn.label = '添加';
			addBtn.setSize(70, 24);
			addBtn.raduis = 24;
			
			const clearBtn:DButton = new DButton(function():void{});
			clearBtn.label = '清空';
			clearBtn.setSize(70, 24);	
			clearBtn.raduis = 24;
			
			addBox.addChild(addBtn);
			addBox.addChild(clearBtn);

			warpBox.addChild(tableHeader);
			warpBox.addChild(layers);
			addChild(warpBox);
			
			addBox.move(width - addBox.width >> 1, warpBox.height + (stage.stageHeight - warpBox.height - addBox.height >> 1))
			addChild(addBox);
		}
		
		private function testCreater(dp:Provider):void
		{
			for(var i:uint = 0; i < 40; ++i)
				dp.addItem(['视频'+i+'.mp4',TimeUtil.format(100 + Math.random() * 500)]);
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