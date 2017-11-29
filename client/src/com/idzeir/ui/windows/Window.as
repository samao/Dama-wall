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
		
		public function Window(rootStage: Stage,width: uint = 0, height: uint = 0)
		{
			createWindow(rootStage,width,height);
			setupGUI();
		}
		
		protected function createWindow(rootStage: Stage, width:uint = 0, height: uint = 0): void 
		{
			const bounds:Rectangle = rootStage.nativeWindow.bounds;
			const options: NativeWindowInitOptions = new NativeWindowInitOptions();
			options.systemChrome = NativeWindowSystemChrome.STANDARD;
			options.type = NativeWindowType.NORMAL;
			
			_window = new NativeWindow(options);
			_window.stage.scaleMode = StageScaleMode.NO_SCALE;
			_window.stage.align = StageAlign.TOP_LEFT;
			_window.bounds = new Rectangle(bounds.right, bounds.top,width, height);
			
			_window.addEventListener(Event.CLOSING,function(e:Event):void
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();
				visible = false;
			})
		}
		
		public function get width():Number
		{
			return _window.bounds.width;
		}
		
		public function set width(value:Number):void
		{
			_window.bounds.width = uint(value);
		}
		
		public function get height():Number
		{
			return _window.bounds.height;
		}
		
		public function set height(value:Number):void
		{
			_window.bounds.height = uint(value);
		}
		
		public function addChild(child:DisplayObject):void
		{
			stage.addChild(child);
		}
		
		public function removeChild(child:DisplayObject):void
		{
			stage.removeChild(child);
		}
		
		public function set x(value:uint):void
		{
			_window.x = value;
		}
		
		public function set y(value:uint):void
		{
			_window.y = value;
		}
		
		public function get stage(): Stage
		{
			return _window.stage;	
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