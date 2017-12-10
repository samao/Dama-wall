/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 1, 2017 6:46:00 PM
 * ===================================
 */

package com.idzeir.ui.components
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.Label;
	import com.idzeir.ui.Color;
	
	import flash.events.MouseEvent;
	
	public class IButton extends HBox
	{
		private var _iconBtn:Button;
		
		private var _label:Label;
		
		public function IButton(handler:Function)
		{
			super();
			algin = HBox.MIDDLE;
			if(handler)
			{
				addEventListener(MouseEvent.CLICK, handler);
			}
		}
		
		public function set icon(but:Button):void
		{
			reset()
			_iconBtn = but;
			addChildAt(_iconBtn, 0);
		}
		
		private function reset():void
		{
			if(_iconBtn)
			{
				_iconBtn.removeFromParent();
			}
		}
		
		public function set label(value:String):void
		{
			_label ||= new Label('', Color.Title);
			_label.text = value;
			addChild(_label);
		}
	}
}