/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 4:35:09 PM
 * ===================================
 */

package com.idzeir.ui.layers
{
	import com.idzeir.components.v2.Button;
	import com.idzeir.components.v2.HBox;
	import com.idzeir.components.v2.List;
	import com.idzeir.components.v2.UIContainer;
	import com.idzeir.data.Provider;
	import com.idzeir.ui.Color;
	import com.idzeir.ui.Gap;
	import com.idzeir.ui.components.DButton;
	import com.idzeir.ui.components.DropRender;
	import com.idzeir.ui.utils.DrawUtil;
	import com.idzeir.ui.utils.FilterUtil;
	
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.media.Camera;

	public class CameraOptView extends OptView
	{
		private var warpBox:HBox;

		private var _cameraBtn:Button;

		private var _droplist:List;
		private var _openListBtn:DButton;
		
		public function CameraOptView()
		{
			super();
		}
		
		override protected function createChildren():void
		{
			warpBox = new HBox();
			warpBox.algin = HBox.MIDDLE;
			warpBox.gap = Gap.LINE_GAP * 1.5;
			
			_openListBtn = new DButton(function():void
			{
				showCameraList();
			});
			_openListBtn.labelColor = Color.Primary;
			_openListBtn.label = '摄像头列表';
			_openListBtn.setSize(120,20);
			
			_cameraBtn = new Button();
			_cameraBtn.mouseEnabled = _cameraBtn.buttonMode = false;
			_cameraBtn.selectSkin = _cameraBtn.overSkin = null;
			_cameraBtn.normalSkin = new UIContainer();
			_cameraBtn.labelColor = Color.Primary;
			_cameraBtn.label = '未选择';
			_cameraBtn.setSize(120,20);
			
			var applyBtn:DButton = new DButton(function():void{})
			applyBtn.raduis = 20;
			applyBtn.labelColor = Color.Red;
			applyBtn.label = '应用';
			applyBtn.setSize(50,20);
			
			warpBox.addChild(_openListBtn);
			warpBox.addChild(_cameraBtn);
			warpBox.addChild(applyBtn);
			addChild(warpBox);
			
			_cameraBtn.mouseEnabled = true;
		}
		
		private function showCameraList():void
		{
			if(!_droplist)
			{
				_droplist = new List(DropRender);
				_droplist.scaleThumb = false;
				_droplist.thumbSkin = createThumb();
				_droplist.bgColor = Color.Background;
				_droplist.sliderBglayerColor = 0x99ffcc;
				_droplist.sliderBglayerAlpha = .8;
				FilterUtil.border(_droplist);
				_droplist.bgColor = Color.Background;
				_droplist.setSize(120,120);
				_droplist.dataProvider = new Provider(cameras);
				_droplist.index = 0;
				var rect:Rectangle =  _openListBtn.getBounds(this);
				_droplist.x = rect.left + (rect.width - _droplist.width) * .5;
				_droplist.y = rect.top - _droplist.height - 3;
				_droplist.addEventListener(Event.SELECT,function():void
				{
					_droplist.removeFromParent();
					_cameraBtn.label = _droplist.selectedItem.data.title;
				});
			}
			if(contains(_droplist))
			{
				_droplist.removeFromParent();
				return;
			}
			addChild(_droplist);
		}
		
		/**
		 * 当前机器摄像头数据列表 
		 */		
		private function get cameras():Array
		{
			if(!Camera.isSupported) return [];
			return Camera.names.concat('9158Cam','Guagua','k歌伴侣').map(function(cam:String, index:int, arr:Array):Object
			{
				return {title: cam};
			});
		}
		
		private function createThumb():Button
		{
			const thumb: Button = new Button();
			thumb.setSize(8,30);
			thumb.overSkin = thumb.selectSkin = null;
			thumb.normalSkin = DrawUtil.drawRectRound(8, 30, Color.Title, 6);
			return thumb;
		}
		
		override public function immediateUpdate():void
		{
			warpBox.x = _width - warpBox.width >> 1;
			warpBox.y = _height - warpBox.height >> 1;
		}
	}
}