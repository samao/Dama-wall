/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Nov 27, 2017 3:16:46 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.HBox;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.components.InputText;

	public class TextOptView extends OptView
	{

		private var warpBox:HBox;
		public function TextOptView()
		{
			super();
		}
		
		override protected function createChildren():void
		{
			super.createChildren();
			
			warpBox = new HBox();
			warpBox.gap = Gap.PADDING;
			
			const input:InputText = new InputText();
			input.placeholder = '输入文本显示内容';
			
			const addBtn:DButton = new DButton(function():void{});
			addBtn.raduis = 24;
			addBtn.label = '添加'
			addBtn.setSize(65,24);
			
			warpBox.addChild(input);
			warpBox.addChild(addBtn);
			addChild(warpBox);
		}
		
		override public function immediateUpdate():void
		{
			super.immediateUpdate();
			warpBox.move(_width - warpBox.width >> 1,_height - warpBox.height >> 1);
		}
	}
}
