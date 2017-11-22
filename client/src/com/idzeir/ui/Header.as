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
	import com.idzeir.components.v2.DropList;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.data.Provider;
	import com.idzeir.ui.components.DropRender;
	
	import flash.text.TextFormat;
	
	public class Header extends UIContainer
	{
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
			var actTitle: Label = new Label('线下活动名称', Color.Title,false, 120);
			actTitle.defaultTextFormat = new TextFormat(Style.font,null,Color.Title,true);
			
			var droplist:DropList = new DropList(DropList.DOWN, DropRender);
			droplist.setSize(75,30);
			droplist.dataProvider = new Provider(['黄金联赛','绝地求生','WCG'])
			droplist.index = 0;
			
			actBox.addChild(actTitle);
			actBox.addChild(droplist);
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