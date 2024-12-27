import router from '@ohos.router';
import { StorageUtil } from '../utils/StorageUtil';
import promptAction from '@ohos.promptAction';

@Entry
@Component
struct LoginPage {
  @State username: string = '';
  @State password: string = '';
  @State isLoading: boolean = false;

  build() {
    Column() {
      // Logo
      Image($r('app.media.logo'))
        .width(100)
        .height(100)
        .margin({ top: 80, bottom: 40 })

      // 用户名输入框
      TextInput({ placeholder: '请输入用户名' })
        .width('85%')
        .height(45)
        .margin({ bottom: 20 })
        .onChange((value: string) => {
          this.username = value;
        })

      // 密码输入框
      TextInput({ placeholder: '请输入密码' })
        .width('85%')
        .height(45)
        .type(InputType.Password)
        .margin({ bottom: 30 })
        .onChange((value: string) => {
          this.password = value;
        })

      // 登录按钮
      Button('登录')
        .width('85%')
        .height(45)
        .backgroundColor('#2196F3')
        .fontColor(Color.White)
        .onClick(() => this.handleLogin())
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  async handleLogin() {
    if (!this.username || !this.password) {
      promptAction.showToast({ message: '请输入用户名和密码' });
      return;
    }

    this.isLoading = true;

    // 模拟登录请求
    setTimeout(async () => {
      this.isLoading = false;
      
      // 判断是否是管理员
      const isAdmin = this.username === 'admin' && this.password === 'admin';

      StorageUtil.set('isAdmin', isAdmin)
      StorageUtil.set('isLoggedIn', true)
      // await preferences.putSync('isAdmin', isAdmin);
      // await preferences.putSync('isLoggedIn', true);

      router.replaceUrl({
        url: 'pages/Home'
      });
    }, 1000);
  }
} 