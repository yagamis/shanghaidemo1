@Component
export struct ToastComponent {
  @State message: string = '';
  @State isShow: boolean = false;
  @State type: 'success' | 'error' | 'info' = 'info';

  private timerId: number = -1;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 2000) {
    this.message = message;
    this.type = type;
    this.isShow = true;

    if (this.timerId !== -1) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      this.isShow = false;
    }, duration);
  }

  build() {
    Column() {
      if (this.isShow) {
        Text(this.message)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor(this.getBackgroundColor())
          .padding({ left: 24, right: 24, top: 12, bottom: 12 })
          .borderRadius(24)
      }
    }
    .position({ x: '50%', y: '85%' })
    .translate({ x: '-50%', y: '-50%' })
    .animation({
      duration: 250,
      curve: Curve.EaseInOut,
      iterations: 1,
      playMode: PlayMode.Normal
    })

  }

  private getBackgroundColor(): string {
    switch (this.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      default:
        return '#333333';
    }
  }
} 