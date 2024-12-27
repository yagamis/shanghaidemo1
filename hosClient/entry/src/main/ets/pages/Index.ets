import router from '@ohos.router';
import { StorageUtil } from '../utils/StorageUtil';

@Entry
@Component
struct IndexPage {
  aboutToAppear() {
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    // 检查是否已登录
    const isLoggedIn = await StorageUtil.get('isLoggedIn');
    
    // 延迟跳转，确保启动动画显示完整
    setTimeout(() => {
      router.replaceUrl({
        url: isLoggedIn ? 'pages/Home' : 'pages/Login'
      });
    }, 1000);
  }

  build() {
    Column() {
      // 启动页面内容
      Image($r('app.media.logo'))
        .width(120)
        .height(120)
      Text('智能公厕')
        .fontSize(24)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
    .justifyContent(FlexAlign.Center)
  }
} 