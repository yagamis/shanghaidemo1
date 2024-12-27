if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface StallDetailPage_Params {
    toilet?: ToiletModel;
    stall?: StallModel;
    useTime?: string;
    temperature?: string;
    humidity?: string;
    smoke?: string;
    isAdmin?: boolean;
    refreshTimer?: number;
}
import type { ToiletModel, StallModel } from '../model/ToiletModel';
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class StallDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__toilet = new SynchedPropertyObjectTwoWayPU(params.toilet, this, "toilet");
        this.__stall = new SynchedPropertyObjectTwoWayPU(params.stall, this, "stall");
        this.__useTime = new ObservedPropertySimplePU('未使用', this, "useTime");
        this.__temperature = new ObservedPropertySimplePU('26°C', this, "temperature");
        this.__humidity = new ObservedPropertySimplePU('45%', this, "humidity");
        this.__smoke = new ObservedPropertySimplePU('无', this, "smoke");
        this.__isAdmin = new ObservedPropertySimplePU(false, this, "isAdmin");
        this.refreshTimer = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StallDetailPage_Params) {
        if (params.useTime !== undefined) {
            this.useTime = params.useTime;
        }
        if (params.temperature !== undefined) {
            this.temperature = params.temperature;
        }
        if (params.humidity !== undefined) {
            this.humidity = params.humidity;
        }
        if (params.smoke !== undefined) {
            this.smoke = params.smoke;
        }
        if (params.isAdmin !== undefined) {
            this.isAdmin = params.isAdmin;
        }
        if (params.refreshTimer !== undefined) {
            this.refreshTimer = params.refreshTimer;
        }
    }
    updateStateVars(params: StallDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__toilet.purgeDependencyOnElmtId(rmElmtId);
        this.__stall.purgeDependencyOnElmtId(rmElmtId);
        this.__useTime.purgeDependencyOnElmtId(rmElmtId);
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__humidity.purgeDependencyOnElmtId(rmElmtId);
        this.__smoke.purgeDependencyOnElmtId(rmElmtId);
        this.__isAdmin.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__toilet.aboutToBeDeleted();
        this.__stall.aboutToBeDeleted();
        this.__useTime.aboutToBeDeleted();
        this.__temperature.aboutToBeDeleted();
        this.__humidity.aboutToBeDeleted();
        this.__smoke.aboutToBeDeleted();
        this.__isAdmin.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __toilet: SynchedPropertySimpleOneWayPU<ToiletModel>;
    get toilet() {
        return this.__toilet.get();
    }
    set toilet(newValue: ToiletModel) {
        this.__toilet.set(newValue);
    }
    private __stall: SynchedPropertySimpleOneWayPU<StallModel>;
    get stall() {
        return this.__stall.get();
    }
    set stall(newValue: StallModel) {
        this.__stall.set(newValue);
    }
    private __useTime: ObservedPropertySimplePU<string>;
    get useTime() {
        return this.__useTime.get();
    }
    set useTime(newValue: string) {
        this.__useTime.set(newValue);
    }
    private __temperature: ObservedPropertySimplePU<string>;
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: string) {
        this.__temperature.set(newValue);
    }
    private __humidity: ObservedPropertySimplePU<string>;
    get humidity() {
        return this.__humidity.get();
    }
    set humidity(newValue: string) {
        this.__humidity.set(newValue);
    }
    private __smoke: ObservedPropertySimplePU<string>;
    get smoke() {
        return this.__smoke.get();
    }
    set smoke(newValue: string) {
        this.__smoke.set(newValue);
    }
    private __isAdmin: ObservedPropertySimplePU<boolean>;
    get isAdmin() {
        return this.__isAdmin.get();
    }
    set isAdmin(newValue: boolean) {
        this.__isAdmin.set(newValue);
    }
    private refreshTimer: number;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StallDetail.ets(54:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(56:7)", "entry");
            // 顶部标题栏
            Row.width('100%');
            // 顶部标题栏
            Row.height(56);
            // 顶部标题栏
            Row.padding({ left: 16, right: 16 });
            // 顶部标题栏
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/StallDetail.ets(57:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => router.back());
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('厕位详情');
            Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(61:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详情卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StallDetail.ets(73:7)", "entry");
            // 详情卡片
            Column.margin(15);
            // 详情卡片
            Column.padding(15);
            // 详情卡片
            Column.backgroundColor(Color.White);
            // 详情卡片
            Column.borderRadius(12);
        }, Column);
        this.InfoItem.bind(this)('厕位编号', this.stall.number.toString());
        this.InfoItem.bind(this)('性别/状态', `${this.stall?.gender || '-'} / ${this.stall?.status || '-'}`);
        this.InfoItem.bind(this)('星闪模组ID', this.stall?.moduleId || '-');
        this.InfoItem.bind(this)('使用时长', this.useTime);
        this.InfoItem.bind(this)('温湿度', `${this.temperature} / ${this.humidity}`);
        this.InfoItem.bind(this)('烟雾浓度', this.smoke);
        // 详情卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 管理员操作区
            if (this.isAdmin) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/StallDetail.ets(88:9)", "entry");
                        Column.margin(15);
                        Column.padding(15);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('管理员操作');
                        Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(89:11)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(95:11)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 强制开锁
                        Button.createWithChild();
                        Button.debugLine("entry/src/main/ets/pages/StallDetail.ets(97:13)", "entry");
                        // 强制开锁
                        Button.backgroundColor('#4CAF50');
                        // 强制开锁
                        Button.height(40);
                        // 强制开锁
                        Button.layoutWeight(1);
                        // 强制开锁
                        Button.margin({ right: 8 });
                        // 强制开锁
                        Button.onClick(() => this.handleForceUnlock());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(98:15)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/StallDetail.ets(99:17)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('强制开锁');
                        Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(103:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 强制开锁
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 设置维护状态
                        Button.createWithChild();
                        Button.debugLine("entry/src/main/ets/pages/StallDetail.ets(116:13)", "entry");
                        // 设置维护状态
                        Button.backgroundColor('#2196F3');
                        // 设置维护状态
                        Button.height(40);
                        // 设置维护状态
                        Button.layoutWeight(1);
                        // 设置维护状态
                        Button.onClick(() => this.handleMaintenance());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(117:15)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/StallDetail.ets(118:17)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('维护模式');
                        Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(122:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 设置维护状态
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(134:11)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 禁用厕位
                        Button.createWithChild();
                        Button.debugLine("entry/src/main/ets/pages/StallDetail.ets(136:13)", "entry");
                        // 禁用厕位
                        Button.backgroundColor('#9E9E9E');
                        // 禁用厕位
                        Button.height(40);
                        // 禁用厕位
                        Button.layoutWeight(1);
                        // 禁用厕位
                        Button.margin({ right: 8, top: 12 });
                        // 禁用厕位
                        Button.onClick(() => this.handleDisable());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(137:15)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/StallDetail.ets(138:17)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('禁用厕位');
                        Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(142:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 禁用厕位
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 重置状态
                        Button.createWithChild();
                        Button.debugLine("entry/src/main/ets/pages/StallDetail.ets(155:13)", "entry");
                        // 重置状态
                        Button.backgroundColor('#FF9800');
                        // 重置状态
                        Button.height(40);
                        // 重置状态
                        Button.layoutWeight(1);
                        // 重置状态
                        Button.margin({ top: 12 });
                        // 重置状态
                        Button.onClick(() => this.handleReset());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(156:15)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777255, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/StallDetail.ets(157:17)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('重置状态');
                        Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(161:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 重置状态
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            // 紧急求助按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 紧急求助按钮
            if (this.stall?.state === 'occupied') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('紧急求助');
                        Button.debugLine("entry/src/main/ets/pages/StallDetail.ets(182:9)", "entry");
                        Button.width('90%');
                        Button.height(45);
                        Button.margin({ top: 20 });
                        Button.backgroundColor('#F44336');
                        Button.onClick(() => this.handleEmergency());
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    InfoItem(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/StallDetail.ets(197:5)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding({ top: 8, bottom: 8 });
            Row.border({
                width: { bottom: 1 },
                color: '#f0f0f0'
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(198:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/StallDetail.ets(201:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        Row.pop();
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
        if (!this.stall || !this.toilet)
            return;
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "StallDetailPage";
    }
}
registerNamedRoute(() => new StallDetailPage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/StallDetail", pageFullPath: "entry/src/main/ets/pages/StallDetail", integratedHsp: "false", moduleType: "followWithHap" });
