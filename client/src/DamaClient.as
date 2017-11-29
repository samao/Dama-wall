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
	import com.idzeir.dispatch.EventType;
	import com.idzeir.ui.Body;
	import com.idzeir.ui.Footer;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.Header;
	import com.idzeir.ui.Layers;
	import com.idzeir.ui.Monitor;
	import com.idzeir.ui.components.HLine;
	import com.idzeir.ui.windows.BigWindow;
	
	import flash.desktop.NativeApplication;
	import flash.events.Event;
	import flash.geom.Rectangle;
	
	[SWF(width="600", height="480", backgroundColor="#F2F2F2", frameRate="60")]
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
			
			addChild(new Monitor());
			
			on(EventType.OPEN_LAYER_DETAIL, function(e: *):void 
			{
				addFooter(e.data);
			});
			
			var _win:BigWindow;
			on(EventType.START, function():void
			{
				_win ||= new BigWindow(stage, 289*3, 162*3)
				_win.visible = true;
			})
			addViewListener();
		}
		
		private function addViewListener():void
		{
			stage.nativeWindow.addEventListener(Event.CLOSE, function():void
			{
				trace('关闭客户端')
				NativeApplication.nativeApplication.exit();
			});
		}
		
		private function addFooter(data:Array):void
		{
			if(!_horLine)
			{
				_horLine = new HLine();
				_footer = new Footer();
				
				var rect: Rectangle =  stage.nativeWindow.bounds;
				rect.height = 630;
				stage.nativeWindow.bounds = rect;
			}
			warpBox.addChild(_horLine);
			_footer.setView(data[0]);
			warpBox.addChild(_footer);
		}
	}
}