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
	import com.idzeir.business.Queue;
	import com.idzeir.business.task.EstablishConnection;
	import com.idzeir.business.task.ObtainEmotions;
	import com.idzeir.components.v2.VBox;
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.draw.Mirro;
	import com.idzeir.event.EventType;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.activity.impl.Activity;
	import com.idzeir.manager.emotion.impl.Emotion;
	import com.idzeir.ui.Body;
	import com.idzeir.ui.Footer;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.Header;
	import com.idzeir.ui.Layers;
	import com.idzeir.ui.Monitor;
	import com.idzeir.ui.components.HLine;
	import com.idzeir.ui.windows.CastScreen;
	import com.idzeir.ui.PlayList;
	
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
		private var _videoList:PlayList;
		//同步屏窗口
		private var _win:CastScreen;
		
		public function DamaClient() {}
		
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
			
			tabChildren = false;
		}
		
		override protected function preInit():void
		{
			//1、注册ui事件
			addViewListener();
			//2、注入全局内容
			inject();
			//3、监听全局事件
			register();
			//4、执行初始化任务
			createTask();
		}
		
		/**
		 * 注入全局数据对象
		 */		
		private function inject():void
		{
			$(ContextType.EMOTION, new Emotion());
			$(ContextType.ACTIVITY, new Activity());
		}
		
		/**
		 * 开启任务队列 
		 */		
		private function createTask():void
		{
			Queue.getInstance()
				.add(new ObtainEmotions())
				.add(new EstablishConnection())
				.excute(function(...results):void 
				{
					trace('启动完成');
				});
		}
		
		/**
		 * 全局消息处理
		 */		
		private function register():void
		{
			on(EventType.OPEN_LAYER_DETAIL, function(e: DEvent):void 
			{
				addFooter(e.data);
			});
			on(EventType.TOGGLE_VIDEO_LIST,function(e:DEvent):void
			{
				toggleVideoList(e.data[0]);
			});
			
			on(EventType.START, function():void
			{
				_win ||= new CastScreen(stage, Mirro.getInstance().width, Mirro.getInstance().height)
				_win.visible = true;
			})
		}
		
		/**
		 * UI交互处理
		 */		
		private function addViewListener():void
		{
			nativeWindow.addEventListener(Event.CLOSE, function():void
			{
				NativeApplication.nativeApplication.exit();
			});
		}
		
		/**
		 * 当前窗体
		 */		
		private function get nativeWindow():NativeWindow
		{
			return stage.nativeWindow;
		}
		
		/**
		 * 切换视频列表显示
		 */		
		private function toggleVideoList(bool:Boolean):void
		{
			if(!_videoList)
			{
				_videoList = new PlayList();
				_videoList.move(600, 2);
				addChild(_videoList);
			}
			_videoList.toggle();
		}
		
		/**
		 * 增加主窗体层控制栏
		 * @param data
		 */		
		private function addFooter(data:Array):void
		{
			if(!_horLine)
			{
				_horLine = new HLine();
				_footer = new Footer();
				
				var rect: Rectangle =  nativeWindow.bounds;
				rect.height = 630;
				nativeWindow.bounds = rect;
			}
			warpBox.addChild(_horLine);
			_footer.setView(data[0]);
			warpBox.addChild(_footer);
		}
	}
}