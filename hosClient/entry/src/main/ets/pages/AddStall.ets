import { ToiletModel, StallModel } from '../model/ToiletModel';
import { StorageUtil } from '../utils/StorageUtil';
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

@Entry
@Component
struct AddStallPage {
  @State stallNumber: string = '';
  @State gender: string = '男';
  @State state: string = 'empty';
  @State moduleId: string = '';
  @State isLoading: boolean = false;

  aboutToAppear() {
    this.loadSuggestedNumber();
  }

  async loadSuggestedNumber() {
    const toilet = await StorageUtil.getCurrentToilet();
    if (toilet) {
      this.stallNumber = (toilet.stalls.length + 1).toString();
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
        Text('新增厕位')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 表单内容
      Column() {
        // 厕位编号
        Column() {
          Text('厕位编号')
            .fontSize(14)
            .fontColor('#666')
            .margin({ bottom: 8 })
          TextInput({ placeholder: '请输入厕位编号',text: this.stallNumber })
            .type(InputType.Number)
            .width('100%')
            .height(45)
            .backgroundColor('#f8f8f8')
            .borderRadius(8)
            .onChange((value: string) => {
              this.stallNumber = value;
            })

        }
        .margin({ bottom: 20 })

        // 性别选择
        Column() {
          Text('性别')
            .fontSize(14)
            .fontColor('#666')
            .margin({ bottom: 8 })
          Row() {
            this.RadioButton('男', '男')
            this.RadioButton('女', '女')
          }
          .width('100%')
        }
        .margin({ bottom: 20 })

        // 初始状态
        Column() {
          Text('初始状态')
            .fontSize(14)
            .fontColor('#666')
            .margin({ bottom: 8 })
          Select([
            { value: 'empty'},
            { value: 'occupied', },
            { value: 'fault',  },
            { value: 'maintenance', },
            { value: 'disabled',  }
          ])
            .selected(0)
            .value(this.state)
            .width('100%')
            .height(45)
            .backgroundColor('#f8f8f8')
            .borderRadius(8)
            .onSelect((index: number, value: string) => {
              this.state = value;
            })
        }
        .margin({ bottom: 20 })

        // 星闪模组ID
        Column() {
          Text('星闪模组ID')
            .fontSize(14)
            .fontColor('#666')
            .margin({ bottom: 8 })
          TextInput({ placeholder: '请输入星闪模组ID' })
            .width('100%')
            .height(45)
            .backgroundColor('#f8f8f8')
            .borderRadius(8)
            .onChange((value: string) => {
              this.moduleId = value;
            })
        }
        .margin({ bottom: 30 })

        // 保存按钮
        Button('保存')
          .width('100%')
          .height(45)
          .backgroundColor('#2196F3')
          .fontColor(Color.White)
          .borderRadius(8)
          .enabled(!this.isLoading)
          .onClick(() => this.handleSave())
      }
      .padding(15)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  @Builder
  RadioButton(value: string, text: string) {
    Row() {
      Radio({ value: value, group: 'gender' })
        .checked(this.gender === value)
        .onChange((isChecked: boolean) => {
          if (isChecked) {
            this.gender = value;
          }
        })
      Text(text)
        .fontSize(14)
        .fontColor('#333')
        .margin({ left: 8 })
    }
    .layoutWeight(1)
    .height(45)
    .backgroundColor('#f8f8f8')
    .borderRadius(8)
    .padding({ left: 12 })
  }

  private async handleSave() {
    // 表单验证
    if (!this.stallNumber || !this.moduleId) {
      promptAction.showToast({ message: '请填写完整信息' });
      return;
    }

    const number = parseInt(this.stallNumber);
    if (isNaN(number) || number < 1) {
      promptAction.showToast({ message: '请输入有效的厕位编号' });
      return;
    }

    this.isLoading = true;

    try {
      // 获取当前公厕数据
      const toilet = await StorageUtil.getCurrentToilet();
      if (!toilet) {
        throw new Error('未找到公厕数据');
      }

      // 检查编号是否已存在
      if (toilet.stalls.some(s => s.number === number)) {
        promptAction.showToast({ message: '该编号已存在' });
        return;
      }

      // 创建新厕位
      const newStall = new StallModel(number, this.gender, this.state);
      newStall.moduleId = this.moduleId;

      // 添加到厕位列表
      toilet.stalls.push(newStall);
      
      // 按编号排序
      toilet.stalls.sort((a, b) => a.number - b.number);

      // 保存更新
      await StorageUtil.setCurrentToilet(toilet);
      const toilets = await StorageUtil.getToilets();
      const index = toilets.findIndex(t => t.name === toilet.name);
      if (index !== -1) {
        toilets[index] = toilet;
        await StorageUtil.saveToilets(toilets);
      }

      // 显示成功提示并返回
      promptAction.showToast({ message: '新增厕位成功' });
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      promptAction.showToast({ message: '保存失败：' + error.message });
    } finally {
      this.isLoading = false;
    }
  }
} 