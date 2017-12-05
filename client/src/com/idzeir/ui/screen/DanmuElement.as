/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 4, 2017 3:00:05 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.components.v2.Style;
	import com.idzeir.components.v2.UIContainer;
	
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class DanmuElement extends UIContainer
	{
		private static const ALL_MAP:Vector.<DanmuElement> = new Vector.<DanmuElement>(); 
		
		private var _text:TextField = new TextField();
		
		public function DanmuElement(msg:String)
		{
			super();
			_text.autoSize = 'left';
			_text.defaultTextFormat = new TextFormat(Style.font,60,null,true);
			addChild(_text);
		}
		
		public static function createDanmu(msg:Object):DanmuElement
		{
			var danmu:DanmuElement
			if(ALL_MAP.length>0)
				danmu =  ALL_MAP.shift();
			else
				danmu = new DanmuElement(msg);
			danmu.text = msg;
			return danmu;
		}
		
		public function set text(value:Object):void
		{
			_text.text = value.message;
			_text.textColor = Number(value.color);
			setSize(_text.width, _text.height);
		}
		
		public static function recyleDanmu(danmu:DanmuElement):void
		{
			danmu.removeFromParent();
			ALL_MAP.push(danmu);
		}
	}
}