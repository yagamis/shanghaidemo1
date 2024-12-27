import UIAbility from "@ohos:app.ability.UIAbility";
import type Window from "@ohos:window";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import type Want from "@ohos:app.ability.Want";
export default class EntryAbility extends UIAbility {
    async onCreate(want: Want) {
        // 初始化存储
        await StorageUtil.init(this.context);
    }
    async onWindowStageCreate(windowStage: Window.WindowStage) {
        // 设置窗口
        windowStage.loadContent('pages/Index');
    }
}
