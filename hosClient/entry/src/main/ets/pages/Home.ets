import { ToiletModel, StallModel, toiletsInitData } from '../model/ToiletModel';
import { StorageUtil } from '../utils/StorageUtil';
import router from '@ohos.router';

@Entry
@Component
struct HomePage {
  @State toilets: ToiletModel[] = []
  @Provide('currentToilet') currentToilet: ToiletModel = new ToiletModel(0, '', '', '');
  @State currentTab: string = 'home';

  aboutToAppear() {

    if (this.toilets.length === 0) {
      this.toilets = toiletsInitData;
    } else {
       this.loadToilets()
    }
  }

  aboutToDisappear() {
    this.saveToiletsToPreferences();
  }

  async saveToiletsToPreferences() {
    await StorageUtil.saveToilets(this.toilets);
  }

  async loadToilets() {
    this.toilets = await StorageUtil.getToilets();
  }

  build() {
    Column() {
      // 顶部标题
      Text('附近公厕')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .width('100%')
        .textAlign(TextAlign.Center)
        .padding(15)
        .backgroundColor(Color.White)

      // 公厕列表
      List({ space: 8 }) {
        ForEach(this.toilets, (toilet: ToiletModel) => {
          ListItem() {
            this.ToiletItem(toilet)

          }
        })
      }
      .width('100%')
      .layoutWeight(1)
      .padding({ left: 15, right: 15 })

      // 底部导航栏
      Row() {
        this.TabItem('home', '首页', 'home')
        this.TabItem('settings', '我的', 'user')
      }
      .width('100%')
      .height(50)
      .backgroundColor(Color.White)
      .border({ width: { top: 0.5 }, color: '#eeeeee' })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  @Builder
  ToiletItem(toilet: ToiletModel) {
    Column() {
      Row() {
        Column() {
          Row() {
            Image($r('app.media.toilet'))
              .width(20)
              .height(20)
            Text(toilet.name)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
            Row() {
              Image($r('app.media.star'))
                .width(14)
                .height(14)
                .fillColor('#ffa000')
              Text(toilet.ratingCount > 0 ?
                `${toilet.rating.toFixed(1)} (${toilet.ratingCount})` :
                '暂无评分')
                .fontSize(13)
                .fontColor('#ffa000')
            }
            .margin({ left: 8 })
          }
          .width('100%')

          Row() {
            Image($r('app.media.location'))
              .width(16)
              .height(16)
            Text(toilet.address)
              .fontSize(13)
              .fontColor('#666')
          }
          .width('100%')
          .margin({ top: 4 })

          Row() {
            Image($r('app.media.walking'))
              .width(16)
              .height(16)
            Text(toilet.distance)
              .fontSize(12)
              .fontColor('#999')
          }.width('100%')
          .margin({ top: 4 })

          Row() {
            this.StallStats('男', toilet.stalls)
            this.StallStats('女', toilet.stalls)
          }
          .margin({ top: 8 })
          .width('100%')
        }
        .layoutWeight(1)

        Column() {
          Text(toilet.status)
            .fontSize(12)
            .fontColor(toilet.status === '正常' ? '#4CAF50' : '#FF9800')
            .backgroundColor(toilet.status === '正常' ? '#E8F5E9' : '#FFF3E0')
            .padding({
              left: 8,
              right: 8,
              top: 4,
              bottom: 4
            })
            .borderRadius(4)
        }
      }
      .width('100%')
      .padding(15)
      .backgroundColor(Color.White)
      .borderRadius(8)
      .onClick(() => {
        this.currentToilet = toilet;
        router.pushUrl({
          url: 'pages/Detail'
        });
      })
    }
  }

  @Builder
  StallStats(gender: string, stalls: StallModel[]) {
    Row() {
      Image($r(`app.media.${gender === '男' ? 'male' : 'female'}`))
        .width(14)
        .height(14)
        .fillColor(gender === '男' ? '#1976d2' : '#d81b60')
      Text(`空位 ${this.getEmptyCount(gender, stalls)}/${this.getTotalCount(gender, stalls)}`)
        .fontSize(12)
        .fontColor('#666')
    }
    .backgroundColor('#f5f5f5')
    .padding({
      left: 8,
      right: 8,
      top: 3,
      bottom: 3
    })
    .borderRadius(12)
    .margin({ right: 15 })
  }

  private getEmptyCount(gender: string, stalls: StallModel[]): number {
    return stalls.filter(s => s.gender === gender && s.state === 'empty').length;
  }

  private getTotalCount(gender: string, stalls: StallModel[]): number {
    return stalls.filter(s => s.gender === gender).length;
  }

  @Builder
  TabItem(id: string, text: string, icon: string) {
    Column() {
      Image($r('app.media.' + icon))
        .width(20)
        .height(20)
        .fillColor(this.currentTab === id ? '#2196F3' : '#666666')
      Text(text)
        .fontSize(12)
        .fontColor(this.currentTab === id ? '#2196F3' : '#666666')
    }
    .layoutWeight(1)
    .onClick(() => this.currentTab = id)
  }
} 