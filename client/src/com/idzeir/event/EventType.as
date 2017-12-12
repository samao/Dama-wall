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
		/** 开启投屏 */
		public static const START:String = 'start';
		/**	显示层详细设置 */		
		public static const OPEN_LAYER_DETAIL:String = 'openLayerDetail';
		/** 切换视频播放列表 */
		public static const TOGGLE_VIDEO_LIST:String = 'toggleVideoList';
		/** 纯色投屏层颜色更新 */
		public static const BACKGROUND_COLOR:String = 'backgroundColor';
		/** 调整投屏层层级*/
		public static const BRING_LAYER_UP: String = 'bringLayerUp';
		/** 调整投屏层层级*/
		public static const BRING_LAYER_DOWN: String = 'bringLayerDown';
		/** 删除投屏层层级*/
		public static const DELETE_LAYER:String = 'deleteLayer';
		/** 添加投屏层*/
		public static const ADD_LAYER:String = 'addLayer';
		/** 增加操控层控制单元 */
		public static const ADD_ELEMENT:String = 'addElement';
		
		/** 聊天消息*/
		public static const POST:String = 'postMessage';
		/** 获取服务器活动列表成功 */
		public static const ACTIVIES_UPDATE:String = 'activiesUpdate';
		/** 投屏元素移动 */
		public static const ELEMENT_MOVED:String = 'elementMoved';
		
		/** 视频播放时长更新*/
		public static const DURATION_UPDATE:String = 'durationUpdate';
		/** 视频当前时间更新*/
		public static const CURRENT_UPDATE:String = 'currentUpdate';
		/** seek 视频*/
		public static const SEEK:String = 'seek';
		/** 视频toggle */
		public static const VIDEO_TOGGLE:String = 'videoToggle';
		/** 更新视频播放地址 */
		public static const PLAY_URL:String = 'playUrl';
		/** 登录成功 */
		public static const LOGIN_IN:String = 'loginIn';
	}
}