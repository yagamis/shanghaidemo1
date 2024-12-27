@Component
export struct LoadingComponent {
  @State isShow: boolean = false;
  @State message: string = '加载中...';

  show(message: string = '加载中...') {
    this.message = message;
    this.isShow = true;
  }

  hide() {
    this.isShow = false;
  }

  build() {
    Panel(this.isShow) {
      Column() {
        LoadingProgress()
          .width(32)
          .height(32)
          .color('#2196F3')
        Text(this.message)
          .fontSize(14)
          .fontColor('#666666')
          .margin({ top: 8 })
      }
      .width(120)
      .height(120)
      .backgroundColor(Color.White)
      .borderRadius(8)
      .justifyContent(FlexAlign.Center)
    }
    .mode(PanelMode.Full)
    .backgroundMask('rgba(0,0,0,0.4)')
  }
} 