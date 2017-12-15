/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 22, 2017 10:32:14 AM
 * ===================================
 */

package com.idzeir.ui.windows
{
	import com.idzeir.utils.Log;
	
	import flash.display.DisplayObject;
	import flash.display.NativeWindow;
	import flash.display.NativeWindowInitOptions;
	import flash.display.NativeWindowSystemChrome;
	import flash.display.NativeWindowType;
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.geom.Rectangle;
	
	/**
	 * 窗体基类 
	 */	
	public class Window
	{
		protected var _window: NativeWindow;

		protected var _options:NativeWindowInitOptions = new NativeWindowInitOptions();
		
		protected var _root:Stage;
		
		public function Window(rootStage: Stage,width: uint = 0, height: uint = 0)
		{
			_root = rootStage;
			createWindow(rootStage,width,height);
			setupGUI();
		}
		
		/**
		 * 窗体配置
		 * @param rootStage 主窗体stage
		 */		
		protected function createOptions(rootStage: Stage):void
		{
			_options.systemChrome = NativeWindowSystemChrome.STANDARD;
			_options.type = NativeWindowType.NORMAL;
			_options.minimizable = false;
			_options.maximizable = false;
			_options.resizable = false;
			_options.owner = rootStage.nativeWindow;
		}
		
		/**
		 * 主窗体矩形位置
		 */		
		protected function get rootBounds():Rectangle
		{
			return _root.nativeWindow.bounds;
		}
		
		/**
		 * 默认位置居中
		 */		
		protected function setViewPort(w:Number, h:Number):void
		{
			var bounds:Rectangle = new Rectangle(stage.fullScreenWidth - w >> 1, stage.fullScreenHeight - h >> 1,w, h);
			_window.bounds = bounds;
		}
		
		/**
		 * 生成窗体
		 * @param rootStage 主窗体stage
		 * @param width 窗口宽
		 * @param height 窗口高
		 */		
		protected function createWindow(rootStage: Stage, width:uint = 0, height: uint = 0): void 
		{
			createOptions(rootStage);
			_window = new NativeWindow(_options);
			_window.stage.scaleMode = StageScaleMode.NO_SCALE;
			_window.stage.align = StageAlign.TOP_LEFT;
			setViewPort(width, height);
			addWindowListener();
		}
		
		/**
		 * 禁止窗体关闭销毁
		 */		
		protected function addWindowListener():void
		{
			_window.addEventListener(Event.CLOSING,onCloseing);
		}
		
		/**
		 * 窗体关闭时，进入后台运行
		 * @param e
		 */		
		protected function onCloseing(e:Event):void
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			visible = false;
		}
		
		/**
		 * 窗体宽度 
		 */		
		public function get width():Number
		{
			return _window.bounds.width;
		}
		
		/**
		 * 设置窗体显示宽
		 * @param value
		 */		
		public function set width(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.width = uint(value);
			_window.bounds = rect;
		}
		
		/**
		 * 窗体高度
		 */		
		public function get height():Number
		{
			return _window.bounds.height;
		}
		
		/**
		 * 设置窗体显示高度 
		 */		
		public function set height(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.height = uint(value);
			_window.bounds = rect;
		}
		
		// 窗体显示列表维护
		public function addChild(child:DisplayObject):void
		{
			stage.addChild(child);
		}
		
		public function removeChild(child:DisplayObject):void
		{
			stage.removeChild(child);
		}
		
		/**
		 * 移动窗体位置
		 * @param value
		 */		
		public function set x(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.x = value;
			_window.bounds =rect;
		}
		
		/**
		 * 移动窗体位置
		 * @param x
		 * @param y
		 */		
		public function move(x:Number, y:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.x = x;
			rect.y = y;
			_window.bounds =rect;
		}
		/**
		 * 移动窗体位置
		 * @param value
		 */		
		public function set y(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.y = value;
			_window.bounds = rect;
		}
		/**
		 * 当前窗体舞台
		 * @return 
		 */		
		public function get stage(): Stage
		{
			return _window.stage;	
		}
		/**
		 * 窗口标题 
		 * @param value
		 */		
		public function set title(value:String):void
		{
			_window && (_window.title = value);
		}
		
		/**
		 * 创建子窗口UI
		 */		
		protected function setupGUI():void
		{
			Log.info('子窗口',stage.stageWidth,stage.stageHeight)
		}
		
		/**
		 * 设置窗体可见
		 * @param value
		 */		
		public function set visible(value:Boolean):void
		{
			_window.visible = value;
		}
		
		public function get visible():Boolean
		{
			return _window.visible;
		}
		
		/**
		 * 当前窗体激活到前台
		 */		
		public function activate(): void 
		{
			_window.activate();
		}
	}
}