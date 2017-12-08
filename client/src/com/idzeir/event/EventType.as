/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Nov 23, 2017 10:50:27 AM
 * ===================================
 */

package com.idzeir.event
{
	public final class EventType
	{
		public static const START:String = 'start';
		
		public static const OPEN_LAYER_DETAIL:String = 'openLayerDetail';
		
		public static const TOGGLE_VIDEO_LIST:String = 'toggleVideoList';
		
		public static const BACKGROUND_COLOR:String = 'backgroundColor';
		
		public static const BRING_LAYER_UP: String = 'bringLayerUp';
		
		public static const BRING_LAYER_DOWN: String = 'bringLayerDown';
		
		public static const DELETE_LAYER:String = 'deleteLayer';
		
		
		public static const ADD_LAYER:String = 'addLayer';
		
		public static const ADD_ELEMENT:String = 'addElement';
		
		/** 聊天消息*/
		public static const POST:String = 'postMessage';
		/** 获取服务器活动列表成功 */
		public static const ACTIVIES_UPDATE:String = 'activiesUpdate';
		/** 投屏元素移动 */
		public static const ELEMENT_MOVED:String = 'elementMoved';
	}
}