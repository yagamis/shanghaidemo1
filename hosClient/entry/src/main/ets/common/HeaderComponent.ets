import { router } from "@kit.ArkUI";

@Component
export struct HeaderComponent {
  @Prop title: string;
  @Prop showBack: boolean = true;
  @Prop showRight: boolean = false;
  @Prop rightIcon?: Resource;
  onBack?: () => void;
  onRightClick?: () => void;

  build() {
    Row() {
      if (this.showBack) {
        Image($r('app.media.back'))
          .width(24)
          .height(24)
          .onClick(() => {
            if (this.onBack) {
              this.onBack();
            } else {
              router.back();
            }
          })
      }

      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .layoutWeight(1)
        .textAlign(TextAlign.Center)

      if (this.showRight && this.rightIcon) {
        Image(this.rightIcon)
          .width(24)
          .height(24)
          .onClick(() => {
            this.onRightClick?.();
          })
      } else {
        // 占位，保持标题居中
        Blank()
          .width(24)
      }
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Color.White)
  }
} 