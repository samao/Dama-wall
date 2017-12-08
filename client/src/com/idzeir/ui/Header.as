/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 20, 2017 3:42:14 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.data.Provider;
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.event.EventType;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.components.DropRender;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.TextFormat;
	
	public class Header extends UIContainer
	{
		private var _droplist:List;
		
		private var _dp:Provider = new Provider();
		
		private var _openListBtn:DButton;
		
		public function Header()
		{
			super();
			
			_height = 30;
			createChildren();
		}
		
		public function createChildren(): void 
		{
			const warpBox: HBox = new HBox();
			warpBox.algin = HBox.MIDDLE;
			warpBox.gap= 40;
			
			const actBox: HBox = new HBox();
			actBox.algin = HBox.MIDDLE;
			actBox.gap = 10;
			
			//----活动
			var actTitle: Label = new Label('线下活动切换', Color.Title,false, 120);
			actTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			
			_openListBtn = new DButton(function():void
			{
				showActList();
			});
			_openListBtn.filters = [];
			_openListBtn.overSkin = null;
			_openListBtn.normalSkin = new UIContainer();
			_openListBtn.labelColor = Color.Primary;
			_openListBtn.setSize(120,20);
			_openListBtn.label = '默认';
			
			actBox.addChild(actTitle);
			actBox.addChild(_openListBtn);
			warpBox.addChild(actBox)
			
			//弹幕服务器状态
			const statusBox:HBox = new HBox();
			statusBox.algin = HBox.MIDDLE;
			statusBox.gap = 10;
			
			var statusTitle: Label = new Label('弹幕连接状态', Color.Title,false, 120);
			statusTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			var status: Label = new Label('已连接', Color.Primary);
			
			statusBox.addChild(statusTitle);
			statusBox.addChild(status);
			warpBox.addChild(statusBox);
			
			warpBox.move(Gap.PADDING, Gap.PADDING);
			addChild(warpBox);
			
			on(EventType.ACTIVIES_UPDATE,function(e:DEvent):void
			{
				_dp.map = e.data[0];
			});
		}
		
		private function showActList():void
		{
			if(!_droplist)
			{
				_droplist = new List(DropRender);
				_droplist.scaleThumb = false;
				_droplist.thumbSkin = createThumb();
				_droplist.bgColor = Color.Background;
				_droplist.sliderBglayerColor = 0x99ffcc;
				_droplist.sliderBglayerAlpha = .8;
				FilterUtil.border(_droplist);
				_droplist.bgColor = Color.Background;
				_droplist.setSize(120,100);
				_droplist.dataProvider = _dp;
				_droplist.index = 0;
				var rect:Rectangle =  _openListBtn.getBounds(stage);
				_droplist.x = rect.left + (rect.width - _droplist.width) * .5;
				_droplist.y = rect.bottom + 3;
				_droplist.addEventListener(Event.SELECT,function():void
				{
					_droplist.removeFromParent();
					_openListBtn.label = _droplist.selectedItem.data.title;
				});
			}
			if(contains(_droplist))
			{
				_droplist.removeFromParent();
				return;
			}
			stage.addChild(_droplist);
		}
		
		private function createThumb():Button
		{
			const thumb: Button = new Button();
			thumb.setSize(8,30);
			thumb.overSkin = thumb.selectSkin = null;
			thumb.normalSkin = DrawUtil.drawRectRound(8, 30, Color.Title, 6);
			return thumb;
		}
		
		override public function immediateUpdate():void 
		{
			this.graphics.clear();
			this.graphics.beginFill(0,0);
			this.graphics.drawRect(0,0,_width,_height);
			this.graphics.endFill();
		}
	}
}