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
		
		protected function createOptions(rootStage: Stage):void
		{
			_options.systemChrome = NativeWindowSystemChrome.STANDARD;
			_options.type = NativeWindowType.NORMAL;
			_options.minimizable = false;
			_options.maximizable = false;
			_options.resizable = false;
			_options.owner = rootStage.nativeWindow;
		}
		
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
		
		protected function createWindow(rootStage: Stage, width:uint = 0, height: uint = 0): void 
		{
			createOptions(rootStage);
			_window = new NativeWindow(_options);
			_window.stage.scaleMode = StageScaleMode.NO_SCALE;
			_window.stage.align = StageAlign.TOP_LEFT;
			setViewPort(width, height);
			addWindowListener();
		}
		
		protected function addWindowListener():void
		{
			_window.addEventListener(Event.CLOSING,onCloseing);
		}
		
		protected function onCloseing(e:Event):void
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			visible = false;
		}
		
		public function get width():Number
		{
			return _window.bounds.width;
		}
		
		public function set width(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.width = uint(value);
			_window.bounds = rect;
		}
		
		public function get height():Number
		{
			return _window.bounds.height;
		}
		
		public function set height(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.height = uint(value);
			_window.bounds = rect;
		}
		
		public function addChild(child:DisplayObject):void
		{
			stage.addChild(child);
		}
		
		public function removeChild(child:DisplayObject):void
		{
			stage.removeChild(child);
		}
		
		public function set x(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.x = value;
			_window.bounds =rect;
		}
		
		public function move(x:Number, y:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.x = x;
			rect.y = y;
			_window.bounds =rect;
		}
		
		public function set y(value:Number):void
		{
			var rect:Rectangle = _window.bounds;
			rect.y = value;
			_window.bounds = rect;
		}
		
		public function get stage(): Stage
		{
			return _window.stage;	
		}
		
		public function set title(value:String):void
		{
			_window && (_window.title = value);
		}
		
		/**
		 * 创建子窗口UI
		 */		
		protected function setupGUI():void
		{
			trace('子窗口',stage.stageWidth,stage.stageHeight)
		}
		
		public function set visible(value:Boolean):void
		{
			_window.visible = value;
		}
		
		public function get visible():Boolean
		{
			return _window.visible;
		}
		
		public function activate(): void 
		{
			_window.activate();
		}
	}
}