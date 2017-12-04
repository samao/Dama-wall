/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 4, 2017 2:41:13 PM
 * ===================================
 */

package com.idzeir.ui.screen
{
	import com.idzeir.draw.Mirro;
	
	import flash.display.Sprite;
	import flash.geom.Rectangle;
	
	public class DanmuLayer extends Sprite
	{
		private const _lineMap:Vector.<DanmuLine> = new Vector.<DanmuLine>();
		
		private var _height:Number,_width:Number;
		
		public function DanmuLayer()
		{
			super();
			const _mirr:Mirro = Mirro.getInstance();
			setSize(_mirr.width, _mirr.height);
			createDanmuLine();
		}
		
		public function setSize(w:Number, h:Number):void
		{
			_width = w;
			_height = h;
		}
		
		private function createDanmuLine():void
		{
			for(var i:uint = 0; i < _height - DanmuLine.LINE_H; i+=DanmuLine.LINE_H)
			{
				const line:DanmuLine = new DanmuLine(i);
				line.y = i;
				_lineMap.push(line);
				addChild(line);
			}
		}
		
		public function addDanmu(message:String):void
		{
			const line:DanmuLine = getFreeLine();
			line && line.addDanmu(message);
		}
		
		private function getFreeLine():DanmuLine
		{
			for each(var line:DanmuLine in _lineMap) 
			{
				var rect:Rectangle = line.getBounds(this);
				if(_width - rect.right > 200)
				{
					return line;
				}
			}
			return _lineMap[0];
		}
	}
}