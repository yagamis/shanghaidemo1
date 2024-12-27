import { ToiletModel, StallModel } from '../model/ToiletModel';
import { StorageUtil } from '../utils/StorageUtil';
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

@Entry
@Component
struct StallDetailPage {
  @Consume('currentToilet') toilet: ToiletModel;
  @Consume('currentStall') stall: StallModel;
  @State useTime: string = '未使用';
  @State temperature: string = '26°C';
  @State humidity: string = '45%';
  @State smoke: string = '无';
  @State isAdmin: boolean = false;
  private refreshTimer: number = 0;

  aboutToAppear() {
    this.loadData();
    this.refreshTimer = setInterval(() => {
      this.updateData();
    }, 1000);
  }

  aboutToDisappear() {
    // 清理定时器
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  async loadData() {
    this.isAdmin = await StorageUtil.get('isAdmin');
  }

  updateData() {
    if (this.stall) {
      // 更新使用时长
      if (this.stall.state === 'occupied' && this.stall.unlockTime) {
        const duration = Date.now() - this.stall.unlockTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        this.useTime = `${minutes}分${seconds}秒`;
      }

      // 模拟环境数据
      this.temperature = `${(20 + Math.random() * 10).toFixed(1)}°C`;
      this.humidity = `${Math.floor(40 + Math.random() * 20)}%`;
      this.smoke = Math.random() > 0.9 ? '有' : '无';
    }
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.back'))
          .width(24)
          .height(24)
          .onClick(() => router.back())
        Text('厕位详情')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 详情卡片
      Column() {
        this.InfoItem('厕位编号', this.stall.number.toString())
        this.InfoItem('性别/状态', `${this.stall?.gender || '-'} / ${this.stall?.status || '-'}`)
        this.InfoItem('星闪模组ID', this.stall?.moduleId || '-')
        this.InfoItem('使用时长', this.useTime)
        this.InfoItem('温湿度', `${this.temperature} / ${this.humidity}`)
        this.InfoItem('烟雾浓度', this.smoke)
      }
      .margin(15)
      .padding(15)
      .backgroundColor(Color.White)
      .borderRadius(12)

      // 管理员操作区
      if (this.isAdmin) {
        Column() {
          Text('管理员操作')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 12 })

          Row() {
            // 强制开锁
            Button() {
              Row() {
                Image($r('app.media.unlock'))
                  .width(20)
                  .height(20)
                  .fillColor(Color.White)
                Text('强制开锁')
                  .fontSize(14)
                  .fontColor(Color.White)
                  .margin({ left: 8 })
              }
            }
            .backgroundColor('#4CAF50')
            .height(40)
            .layoutWeight(1)
            .margin({ right: 8 })
            .onClick(() => this.handleForceUnlock())

            // 设置维护状态
            Button() {
              Row() {
                Image($r('app.media.tools'))
                  .width(20)
                  .height(20)
                  .fillColor(Color.White)
                Text('维护模式')
                  .fontSize(14)
                  .fontColor(Color.White)
                  .margin({ left: 8 })
              }
            }
            .backgroundColor('#2196F3')
            .height(40)
            .layoutWeight(1)
            .onClick(() => this.handleMaintenance())
          }

          Row() {
            // 禁用厕位
            Button() {
              Row() {
                Image($r('app.media.disabled'))
                  .width(20)
                  .height(20)
                  .fillColor(Color.White)
                Text('禁用厕位')
                  .fontSize(14)
                  .fontColor(Color.White)
                  .margin({ left: 8 })
              }
            }
            .backgroundColor('#9E9E9E')
            .height(40)
            .layoutWeight(1)
            .margin({ right: 8, top: 12 })
            .onClick(() => this.handleDisable())

            // 重置状态
            Button() {
              Row() {
                Image($r('app.media.door_open'))
                  .width(20)
                  .height(20)
                  .fillColor(Color.White)
                Text('重置状态')
                  .fontSize(14)
                  .fontColor(Color.White)
                  .margin({ left: 8 })
              }
            }
            .backgroundColor('#FF9800')
            .height(40)
            .layoutWeight(1)
            .margin({ top: 12 })
            .onClick(() => this.handleReset())
          }
        }
        .margin(15)
        .padding(15)
        .backgroundColor(Color.White)
        .borderRadius(12)
      }

      // 紧急求助按钮
      if (this.stall?.state === 'occupied') {
        Button('紧急求助')
          .width('90%')
          .height(45)
          .margin({ top: 20 })
          .backgroundColor('#F44336')
          .onClick(() => this.handleEmergency())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  @Builder
  InfoItem(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#666')
      Text(value)
        .fontSize(14)
        .fontColor('#333')
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .padding({ top: 8, bottom: 8 })
    .border({
      width: { bottom: 1 },
      color: '#f0f0f0'
    })
  }

  private handleEmergency() {
    promptAction.showDialog({
      title: '紧急求助',
      message: '确认发送紧急求助信号？',
      buttons: [
        { text: '取消', color: '#666666' },
        { text: '确定', color: '#F44336' }
      ]
    }).then(result => {
      if (result.index === 1) {
        promptAction.showToast({ message: '已发送求助信号' });
      }
    });
  }

  // 新增管理员操作方法
  private async handleForceUnlock() {
    await this.updateStallState('empty', '强制开锁成功');
  }

  private async handleMaintenance() {
    await this.updateStallState('maintenance', '已设置为维护模式');
  }

  private async handleDisable() {
    await this.updateStallState('disabled', '已禁用该厕位');
  }

  private async handleReset() {
    await this.updateStallState('empty', '已重置状态');
  }

  private async updateStallState(newState: string, message: string) {
    if (!this.stall || !this.toilet) return;

    const result = await promptAction.showDialog({
      title: '确认操作',
      message: `确认要执行此操作吗？`,
      buttons: [
        { text: '取消', color: '#666666' },
        { text: '确定', color: '#2196F3' }
      ]
    });

    if (result.index === 1) {
      this.stall.state = newState;
      this.stall.status = this.stall.getStatusText(newState);

      // 保存更新到持久化存储
      const toilets = await StorageUtil.getToilets();
      const toiletIndex = toilets.findIndex(t => t.id === this.toilet.id);
      if (toiletIndex !== -1) {
        toilets[toiletIndex] = this.toilet;
        await StorageUtil.saveToilets(toilets);
      }

      promptAction.showToast({ message });
    }
  }
} 