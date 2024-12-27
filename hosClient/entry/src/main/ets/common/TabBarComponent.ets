@Component
export struct TabBarComponent {
  @Link currentTab: string;
  @Prop tabs: Array<{
    id: string,
    text: string,
    icon: Resource
  }>;

  build() {
    Row() {
      ForEach(this.tabs, (tab) => {
        Column() {
          Image(tab.icon)
            .width(20)
            .height(20)
            .fillColor(this.currentTab === tab.id ? '#2196F3' : '#666666')
          Text(tab.text)
            .fontSize(12)
            .fontColor(this.currentTab === tab.id ? '#2196F3' : '#666666')
        }
        .layoutWeight(1)
        .onClick(() => {
          this.currentTab = tab.id;
        })
      })
    }
    .width('100%')
    .height(50)
    .backgroundColor(Color.White)
    .border({ width: { top: 0.5 }, color: '#eeeeee' })
  }
} 