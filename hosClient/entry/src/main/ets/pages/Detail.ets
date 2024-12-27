import { ToiletModel, StallModel } from '../model/ToiletModel';
import { StorageUtil } from '../utils/StorageUtil';
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

@Entry
@Component
struct DetailPage {
  @Consume('currentToilet') toilet: ToiletModel;
  @Provide('currentStall') currentStall: StallModel = new StallModel(0, '', 'empty');
  @State isAdmin: boolean = false;

  aboutToAppear() {
    this.loadData();
  }

  async loadData() {
    this.isAdmin = await StorageUtil.get('isAdmin');
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.back'))
          .width(24)
          .height(24)
          .onClick(() => router.back())
        Text(this.toilet?.name || '')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
        Image($r('app.media.stats'))
          .width(24)
          .height(24)
          .onClick(() => this.showStatsModal())
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 厕位网格
      Grid() {
        ForEach(this.toilet?.stalls || [], (stall: StallModel, index) => {
          GridItem() {
            this.StallItem(stall, index + 1)
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr')
      .rowsGap(10)
      .columnsGap(10)
      .padding(15)
      .layoutWeight(1)

      // 添加厕位按钮（仅管理员可见）
      if (this.isAdmin) {
        Button({ type: ButtonType.Circle }) {
          Image($r('app.media.add'))
            .width(24)
            .height(24)
            .fillColor(Color.White)
        }
        .width(56)
        .height(56)
        .position({ x: '85%', y: '85%' })
        .onClick(() => this.goToAddStall())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  @Builder
  StallItem(stall: StallModel, number: number) {
    Column() {
      // 性别标识
      Text(stall.gender)
        .fontSize(12)
        .fontColor(Color.White)
        .backgroundColor(stall.gender === '男' ? '#1976d2' : '#d81b60')
        .width(20)
        .height(20)
        .textAlign(TextAlign.Center)
        .borderRadius(10)
        .position({ x: 5, y: 5 })

      // 厕位编号
      Text(number.toString())
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 20 })

      // 状态图标
      Image(this.getStatusIcon(stall.state))
        .width(24)
        .height(24)
        .margin({ top: 8 })
        .fillColor(this.getStatusColor(stall.state))

      // 状态文本
      Text(stall.status)
        .fontSize(12)
        .fontColor(this.getStatusColor(stall.state))
        .margin({ top: 4 })

      // 开锁按钮（仅管理员可见且厕位空闲时显示）
      if (this.isAdmin && stall.state === 'empty') {
        Button({ type: ButtonType.Normal }) {
          Image($r('app.media.unlock'))
            .width(20)
            .height(20)
            .fillColor(Color.White)
        }
        .width(36)
        .height(36)
        .margin({ top: 8 })
        .backgroundColor('#4CAF50')
        .onClick((event: ClickEvent) => {
          // event.stopPropagation();
          this.handleUnlock(number, stall);
        })
      }
    }
    .width('100%')
    .height(140)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .onClick(() => {
      this.currentStall = stall;
      router.pushUrl({
        url: 'pages/StallDetail'
      });
    })
  }

  private getStatusIcon(state: string): ResourceStr {
    const icons:Record<string, ResourceStr> = {
      'empty': $r('app.media.door_open'),
      'occupied': $r('app.media.door_closed'),
      'fault': $r('app.media.warning'),
      'maintenance': $r('app.media.tools'),
      'disabled': $r('app.media.disabled'),
      'smoke': $r('app.media.smoke')
    };
    return icons[state] || icons.empty;
  }

  private getStatusColor(state: string): string {
    const colors:Record<string, string> = {
      'empty': '#4CAF50',
      'occupied': '#F44336',
      'fault': '#FF9800',
      'maintenance': '#2196F3',
      'disabled': '#9E9E9E',
      'smoke': '#F44336'
    };
    return colors[state] || '#9E9E9E';
  }

  private async handleUnlock(stallId: number, stall: StallModel) {
    if (await promptAction.showDialog({
      title: '确认开锁',
      message: `确认要开启${stallId}号${stall.gender}厕所吗？`,
      buttons: [
        { text: '取消', color: '#666666' },
        { text: '确定', color: '#2196F3' }
      ]
    })) {
      // 更新厕位状态
      stall.state = 'occupied';
      stall.status = '占用';
      stall.unlockTime = Date.now();

      // 保存更新
      await StorageUtil.setCurrentToilet(this.toilet!)
      const toilets = await StorageUtil.getToilets();
      const index = toilets.findIndex(t => t.name === this.toilet?.name);
      if (index !== -1) {
        toilets[index] = this.toilet!
        await StorageUtil.saveToilets(toilets);
      }

      // 显示提示
      promptAction.showToast({ message: '开锁成功' });
    }
  }

  private showStatsModal() {
    // 计算统计数据
    const stats: Record<string, Record<string,number>> = {
      'male': { 'total': 0, 'empty': 0, 'occupied': 0, 'fault': 0 },
      'female': { 'total': 0, 'empty': 0, 'occupied': 0, 'fault': 0 }
    };

    this.toilet?.stalls.forEach(stall => {
      const gender = stall.gender === '男' ? 'male' : 'female';
      stats[gender].total++;
      stats[gender][stall.state]++;
    });

    // 显示统计弹窗
    AlertDialog.show({
      title: '使用统计',
      message: `男厕：${stats.male.empty}/${stats.male.total} 空闲\n` +
               `女厕：${stats.female.empty}/${stats.female.total} 空闲\n\n` +
               `男厕占用：${stats.male.occupied}\n` +
               `女厕占用：${stats.female.occupied}\n\n` +
               `故障/维修：${stats.male.fault + stats.female.fault}`,
      confirm: {
        value: '确定',
        action: () => {}
      }
    });
  }

  private goToAddStall() {
    router.pushUrl({
      url: 'pages/AddStall',
      params: {
        toiletName: this.toilet?.name
      }
    });
  }
} 