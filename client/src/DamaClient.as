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
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.dispatch.EventType;
	import com.idzeir.draw.Mirro;
	import com.idzeir.service.LiveService;
	import com.idzeir.ui.Body;
	import com.idzeir.ui.Footer;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.Header;
	import com.idzeir.ui.Layers;
	import com.idzeir.ui.Monitor;
	import com.idzeir.ui.components.HLine;
	import com.idzeir.ui.windows.CastScreen;
	import com.idzeir.ui.windows.VideoList;
	
	import flash.desktop.NativeApplication;
	import flash.display.NativeWindow;
	import flash.events.Event;
	import flash.geom.Rectangle;
	
	[SWF(width="600", height="480", backgroundColor="#F2F2F2", frameRate="30")]
	public class DamaClient extends App
	{
		private var warpBox:VBox;
		
		private var _horLine:HLine
		private var _footer:Footer;
		//播放适配列表窗口
		private var _videoList:VideoList;
		
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
			
			on(EventType.OPEN_LAYER_DETAIL, function(e: DEvent):void 
			{
				addFooter(e.data);
			});
			on(EventType.TOGGLE_VIDEO_LIST,function(e:DEvent):void
			{
				toggleVideoList(e.data[0]);
			});
			
			var _win:CastScreen;
			on(EventType.START, function():void
			{
				_win ||= new CastScreen(stage, Mirro.getInstance().width, Mirro.getInstance().height)
				_win.visible = true;
			})
			addViewListener();
			
			new LiveService();
		}
		
		private function addViewListener():void
		{
			nativeWindow.addEventListener(Event.CLOSE, function():void
			{
				NativeApplication.nativeApplication.exit();
			});
		}
		
		private function get nativeWindow():NativeWindow
		{
			return stage.nativeWindow;
		}
		
		private function toggleVideoList(bool:Boolean):void
		{
			if(!_videoList)
			{
				_videoList = new VideoList();
				_videoList.move(600, 2);
				addChild(_videoList);
			}
			_videoList.toggle();
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