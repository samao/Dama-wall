/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.youtv.tv		
 * Created:	Dec 8, 2017 4:54:23 PM
 * ===================================
 */

package com.idzeir.manager.emotion.impl
{
	import com.idzeir.manager.emotion.api.IEmotion;
	
	import flash.utils.Dictionary;
	
	public class Emotion implements IEmotion
	{
		private const _map:Dictionary = new Dictionary(true);
		
		private var _regExp:RegExp;

		public function persist(emotions:Array):void
		{
			var _tagMap:Array = [];
			emotions && emotions.forEach(function(emotion:Object, index:int, arr:Array):void
			{
				_tagMap.push(emotion.tag.replace(/\[(.+)\]/ig,'(\\[$1\\])'));
				_map[emotion.tag] = emotion.url;
			});
			_regExp = new RegExp(_tagMap.join('|'),'ig');
		}
		
		public function split(s:String):Vector.<DanmuPart>
		{
			const emotions:Array = s.match(_regExp);
			const result:Vector.<DanmuPart> = new Vector.<DanmuPart>();
			emotions.forEach(function(e:String, id:int, arr:Array):void 
			{
				if(_map.hasOwnProperty(e))
				{
					const index:int = s.indexOf(e);
					if(index != 0) result.push(new DanmuPart(DanmuPart.TEXT,s.substr(0,index)));
					result.push(new DanmuPart(DanmuPart.IMAGE,_map[e]))
					s = s.substr(index + e.length);
				}
			});
			if(s != '') result.push(new DanmuPart(DanmuPart.TEXT,s));
			return result;
		}
	}
}
