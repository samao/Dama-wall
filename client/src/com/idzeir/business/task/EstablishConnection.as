/**
 * ===================================
 * Author:	iDzeir					
 * Email:	qiyanlong@wozine.com	
 * Company:	http://www.acfun.tv		
 * Created:	Dec 4, 2017 2:16:36 PM
 * ===================================
 */

package com.idzeir.business.task
{
	import com.adobe.crypto.MD5;
	import com.idzeir.business.ITask;
	import com.idzeir.conf.Host;
	import com.idzeir.event.EventType;
	import com.idzeir.timer.impl.Ticker;
	import com.idzeir.utils.Log;
	import com.worlize.websocket.WebSocket;
	import com.worlize.websocket.WebSocketErrorEvent;
	import com.worlize.websocket.WebSocketEvent;
	
	import flash.events.Event;

	/**
	 * 建立聊天长连接
	 */	
	public class EstablishConnection implements ITask
	{
		private var _ws:WebSocket;
		
		public function enter(next:Function, error:Function = null):void
		{
			_ws = new WebSocket('ws://' + Host.DOMAIN + ':' + Host.WS_PORT + '/jiafeiyan', '*');
			_ws.addEventListener(WebSocketEvent.OPEN,function():void
			{
				Log.info('OPEN')
				next();
			});
			_ws.addEventListener(WebSocketEvent.CLOSED,function(e:Event):void
			{
				Log.info('连接关闭',e)
			});
			_ws.addEventListener(WebSocketErrorEvent.ABNORMAL_CLOSE,function():void
			{
				Log.info('abnormal')
			});
			_ws.addEventListener(WebSocketEvent.MESSAGE,handlerMessage);
			_ws.connect();
		}
		
		/**
		 * 心跳
		 */		
		private function heartBeat():void
		{
			_ws.sendUTF(JSON.stringify({action:'heart',data:{}}));
		}
		
		private function handlerMessage(e:WebSocketEvent):void
		{
			const data:Object = JSON.parse(e.message.utf8Data);
			
			if(data.action)
			{
				if(data.action === 'post')
				{
					Log.info('收到了聊天消息：',data.data);
					fire(EventType.POST,data.data);
				}
			}else {
				switch(data.status) 
				{
					case 203:
						_ws.sendUTF(JSON.stringify({
							action:'entry',
							data:{
								id:'admin',
								pwd:MD5.hash('admin'),
								age:18
							}
						}))
						break;
					case 201:
						Log.info('用户登录成功')
						Ticker.getInstance().call(5000,heartBeat);
						break;
				}
			}
		}
	}
}