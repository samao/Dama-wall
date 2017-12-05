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
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class DanmuElement extends UIContainer
	{
		private static const ALL_MAP:Vector.<DanmuElement> = new Vector.<DanmuElement>(); 
		
		private var _text:TextField = new TextField();
		
		public function DanmuElement(msg:String,size:uint)
		{
			super();
			
			_text.autoSize = 'left';
			_text.defaultTextFormat = new TextFormat(Style.font, size, null, true);
			addChild(_text);
		}
		
		public static function createDanmu(msg:Object,size:uint = 60):DanmuElement
		{
			var danmu:DanmuElement
			if(ALL_MAP.length>0)
				danmu =  ALL_MAP.shift();
			else
				danmu = new DanmuElement(msg,size);
			danmu.text = msg;
			return danmu;
		}
		
		public function get color():Number
		{
			return _text.textColor;
		}
		
		public function set text(value:Object):void
		{
			_text.text = value.message;
			_text.textColor = Number(value.color);
			FilterUtil.danmu(this);
			setSize(_text.width, _text.height);
		}
		
		public static function recyleDanmu(danmu:DanmuElement):void
		{
			danmu.removeFromParent();
			danmu.filters = [];
			ALL_MAP.push(danmu);
		}
	}
}