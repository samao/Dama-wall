/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Sep 27, 2017 5:57:22 PM
 * ===================================
 */

package
{
	import com.idzeir.app.App;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.emit.Emit;
	import com.idzeir.ui.Body;
	import com.idzeir.ui.Footer;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.Header;
	import com.idzeir.ui.Layers;
	import com.idzeir.ui.components.HLine;
	
	import flash.geom.Rectangle;
	
	[SWF(width="600", height="480", backgroundColor="#F2F2F2", frameRate="30")]
	public class DamaClient extends App
	{
		private var warpBox:VBox;
		
		private var _horLine:HLine
		private var _footer:Footer;
		
		override protected function createChildren():void
		{
			super.createChildren();
			
			warpBox = new VBox();
			warpBox.gap = Gap.LINE_GAP;
			//1.首行
			warpBox.addChild(new Header());
			
			warpBox.addChild(new HLine());
			
			warpBox.addChild(new Body());
			
			warpBox.addChild(new HLine());
			
			warpBox.addChild(new Layers());
			
			addChild(warpBox);
			
			Emit.get().on('openLayerDetail',function(e: *):void 
			{
				if(!_horLine)
					addFooter();
				trace(e.data);
			});
		}
		
		private function addFooter():void
		{
			if(!_horLine)
			{
				_horLine = new HLine();
				_footer = new Footer();
			}
			warpBox.addChild(_horLine);
			warpBox.addChild(_footer);
			
			var rect: Rectangle =  stage.nativeWindow.bounds;
			rect.height = 600;
			stage.nativeWindow.bounds = rect;
		}
	}
}