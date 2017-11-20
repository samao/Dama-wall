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
	import com.idzeir.ui.components.HLine;
	
	[SWF(width="600", height="350", backgroundColor="#F2F2F2", frameRate="30")]
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
			
			warpBox.addChild(new Footer());
			
			addChild(warpBox);
		}
	}
}