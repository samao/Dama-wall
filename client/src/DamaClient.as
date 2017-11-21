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
	import com.idzeir.ui.Body;
	import com.idzeir.ui.Footer;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.Header;
	import com.idzeir.ui.Layers;
	import com.idzeir.ui.components.HLine;
	
	import flash.desktop.NativeApplication;
	import flash.display.NativeWindow;
	import flash.display.NativeWindowDisplayState;
	import flash.display.NativeWindowInitOptions;
	import flash.display.NativeWindowSystemChrome;
	import flash.display.NativeWindowType;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Rectangle;
	
	[SWF(width="600", height="480", backgroundColor="#F2F2F2", frameRate="30")]
	public class DamaClient extends App
	{
		override protected function createChildren():void
		{
			super.createChildren();
			
			const warpBox: VBox = new VBox();
			warpBox.gap = Gap.LINE_GAP;
			//1.首行
			warpBox.addChild(new Header());
			
			warpBox.addChild(new HLine());
			
			warpBox.addChild(new Body());
			
			warpBox.addChild(new HLine());
			
			warpBox.addChild(new Layers());
			
			warpBox.addChild(new Footer());
			
			addChild(warpBox);
			
			createLayerOptWindow();
		}
		
		private function createLayerOptWindow():void
		{
			const bounds:Rectangle = this.stage.nativeWindow.bounds;
			const windOpt: NativeWindowInitOptions = new NativeWindowInitOptions();
			windOpt.systemChrome = NativeWindowSystemChrome.STANDARD;
			windOpt.type = NativeWindowType.NORMAL;
			const frameWind: NativeWindow = new NativeWindow(windOpt);
			frameWind.stage.scaleMode = StageScaleMode.NO_SCALE;
			frameWind.stage.align = StageAlign.TOP_LEFT;
			frameWind.bounds = new Rectangle(bounds.right, bounds.top,300,bounds.height);
			this.stage.nativeWindow.addEventListener(Event.CLOSE,function():void{
				NativeApplication.nativeApplication.exit();
			});
		}
	}
}