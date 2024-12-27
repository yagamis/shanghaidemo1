import UIAbility from '@ohos.app.ability.UIAbility';
import Window from '@ohos.window';
import { StorageUtil } from '../utils/StorageUtil';
import { Want } from '@kit.AbilityKit';

export default class EntryAbility extends UIAbility {
  async onCreate(want:Want) {
    // 初始化存储
    await StorageUtil.init(this.context);
  }

  async onWindowStageCreate(windowStage: Window.WindowStage) {
    // 设置窗口
    windowStage.loadContent('pages/Index');
  }
} 