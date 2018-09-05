/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 23, 2017 2:50:09 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.event.EventType;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.components.DButton;
	
	import flash.events.Event;
	import flash.filesystem.File;
	import flash.net.FileFilter;

	public class ImageOptView extends OptView
	{
		private var leftBox:HBox;
		private var rightBox:HBox;

		private var urlLabel:Label;
		
		public function ImageOptView()
		{
		}
		
		override protected function createChildren():void
		{
			leftBox = new HBox();
			
			const urlTitle:Label = new Label('图片地址：', Color.Title);
			urlLabel  = new Label(File.applicationDirectory.nativePath,Color.Primary,false,300)
	
			rightBox = new HBox();
			
			const resetBtn:DButton = new DButton(function():void{});
			resetBtn.label = '恢复默认'
			resetBtn.raduis = 24;
			resetBtn.setSize(90,24);
			const selectBtn:DButton = new DButton(function():void
			{
				browFile();
			});
			selectBtn.label = '选取图片'
			selectBtn.raduis = 24;
			selectBtn.setSize(70,24);
			
			leftBox.addChild(urlTitle);
			leftBox.addChild(urlLabel);
			
			rightBox.addChild(resetBtn);
			rightBox.addChild(selectBtn);
			
			addChild(leftBox);
			addChild(rightBox);
		}
		
		private function browFile():void
		{
			var file:File = new File();
			file.addEventListener(Event.SELECT,function selectHandler():void
			{
				fire(EventType.ADD_ELEMENT, file.url);
				urlLabel.text = file.url;
				file.removeEventListener(Event.SELECT, selectHandler);
			});
			file.browse([new FileFilter('本地图片','*.jpg;*.png;*.gif')]);
		}
		
		override public function immediateUpdate():void
		{
			leftBox.y =(_height - leftBox.height>>1) - 10;
			rightBox.move(_width - rightBox.width, (_height - rightBox.height >> 1) - 10);
		}
	}
}
