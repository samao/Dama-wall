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
	import com.idzeir.dispatch.DEvent;
	import com.idzeir.event.EventType;
	import com.idzeir.manager.ContextType;
	import com.idzeir.manager.user.api.IUser;
	import com.idzeir.timer.impl.Ticker;
	import com.idzeir.utils.Log;
	import com.worlize.websocket.WebSocket;
	import com.worlize.websocket.WebSocketErrorEvent;
	import com.worlize.websocket.WebSocketEvent;

	/**
	 * 建立聊天长连接
	 */	
	public class EstablishConnection implements ITask
	{
		private var _ws:WebSocket;
		
		public function enter(next:Function, error:Function = null):void
		{
			//_ws = new WebSocket('ws://' + Host.DOMAIN + ':' + Host.WS_PORT + '/jiafeiyan', '*');
			
			function ioHandler(e:WebSocketEvent):void
			{
				switch(e.type) {
					case WebSocketEvent.OPEN:
						Log.info('OPEN')
						next();
						break;
					case WebSocketEvent.CLOSED:
					case WebSocketErrorEvent.ABNORMAL_CLOSE:
					case WebSocketErrorEvent.CONNECTION_FAIL:
						Log.info('连接关闭',e)
						break;
					case WebSocketEvent.MESSAGE:
						handlerMessage(e);
						break;
				}
			}
			
			function addListener():void
			{
				_ws.addEventListener(WebSocketEvent.OPEN,ioHandler);
				_ws.addEventListener(WebSocketEvent.CLOSED,ioHandler);
				_ws.addEventListener(WebSocketErrorEvent.ABNORMAL_CLOSE,ioHandler);
				_ws.addEventListener(WebSocketEvent.MESSAGE,ioHandler);
			}
			
			function clear():void
			{
				Ticker.getInstance().remove(heartBeat);
				_ws.removeEventListener(WebSocketEvent.OPEN,ioHandler);
				_ws.removeEventListener(WebSocketEvent.CLOSED,ioHandler);
				_ws.removeEventListener(WebSocketErrorEvent.ABNORMAL_CLOSE,ioHandler);
				_ws.removeEventListener(WebSocketEvent.MESSAGE,ioHandler);
				_ws = null;
			}
			
			on(EventType.ESTABLISH,function(e:DEvent):void
			{
				_ws && clear();
				_ws = new WebSocket('ws://' + Host.DOMAIN + ':' + Host.WS_PORT + '/' + e.data[0], '*');
				addListener();
				_ws.connect();
			});
			
			//_ws.connect();
			next();
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
						const user:IUser = ($(ContextType.USER) as IUser)
						_ws.sendUTF(JSON.stringify({
							action:'entry',
							data:{
								id: user.name,
								pwd:MD5.hash(user.pwd)
							}
						}))
						fire(EventType.WS_OPEN)
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