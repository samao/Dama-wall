/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 20, 2017 5:16:59 PM
 * ===================================
 */

package com.idzeir.ui
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.components.v2.ViewStack;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.screen.OperateScreen;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	
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
			warpBox.gap = Gap.PADDING;
			
			const titleBox:HBox = new HBox();
			titleBox.gap = Gap.LINE_GAP;
			titleBox.algin = HBox.MIDDLE;
			
			const W:uint = 288, H:uint = 162;
			const sourceView:DisplayObject = drawRect(0xFF0000,W,H,new Shape());
			
			const sourceBtn:DButton = new DButton(function():void
			{
				viewStack.index = 0;
				sourceBtn.labelColor = Color.Red;
				previewBtn.labelColor = Color.Primary;
			});
			sourceBtn.setSize(60,20);
			sourceBtn.label = '画布源';
			sourceBtn.labelColor = Color.Red
			sourceBtn.raduis = 20;
			
			const previewBtn:DButton = new DButton(function():void
			{
				//file.browse()
				viewStack.index = 1;
				previewBtn.labelColor = Color.Red;
				sourceBtn.labelColor = Color.Primary;
			});
			previewBtn.setSize(45,20);
			previewBtn.label = '预览';
			previewBtn.labelColor = Color.Primary;
			previewBtn.raduis = 20;
			
			const operScreen:OperateScreen = new OperateScreen();
			operScreen.setSize(W, H);
			
			const viewStack:ViewStack = new ViewStack();
			viewStack.setSize(265,265);
			viewStack.mapView([operScreen, sourceView]);
			
			titleBox.addChild(sourceBtn);
			titleBox.addChild(previewBtn);

			warpBox.addChild(titleBox);
			warpBox.addChild(viewStack);
			
			addChild(warpBox);
		}
	}
}
