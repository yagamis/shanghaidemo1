@Component
export struct CardComponent {
  @Prop title?: string;
  @Prop subtitle?: string;
  @Prop showDivider?: boolean = false;
  @BuilderParam content?: () => void;

  build() {
    Column() {
      if (this.title) {
        Row() {
          Text(this.title)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
          if (this.subtitle) {
            Text(this.subtitle)
              .fontSize(14)
              .fontColor('#666')
              .margin({ left: 8 })
          }
        }
        .width('100%')
        .padding({ top: 12, bottom: 12 })

        if (this.showDivider) {
          Divider()
            .color('#f0f0f0')
            .width('100%')
        }
      }

      if (this.content) {
        this.content()
      }
    }
    .width('100%')
    .backgroundColor(Color.White)
    .borderRadius(8)
    .padding(this.title ? 0 : 12)
  }
} 