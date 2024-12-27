if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DetailPage_Params {
    toilet?: ToiletModel;
    currentStall?: StallModel;
    isAdmin?: boolean;
}
import type { ToiletModel, StallModel } from '../model/ToiletModel';
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class DetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__toilet = new SynchedPropertyObjectTwoWayPU(params.toilet, this, "toilet");
        this.__currentStall = new SynchedPropertyObjectTwoWayPU(params.currentStall, this, "currentStall");
        this.__isAdmin = new ObservedPropertySimplePU(false, this, "isAdmin");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DetailPage_Params) {
        if (params.isAdmin !== undefined) {
            this.isAdmin = params.isAdmin;
        }
    }
    updateStateVars(params: DetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__toilet.purgeDependencyOnElmtId(rmElmtId);
        this.__currentStall.purgeDependencyOnElmtId(rmElmtId);
        this.__isAdmin.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__toilet.aboutToBeDeleted();
        this.__currentStall.aboutToBeDeleted();
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
    private __currentStall: SynchedPropertySimpleOneWayPU<StallModel>;
    get currentStall() {
        return this.__currentStall.get();
    }
    set currentStall(newValue: StallModel) {
        this.__currentStall.set(newValue);
    }
    private __isAdmin: ObservedPropertySimplePU<boolean>;
    get isAdmin() {
        return this.__isAdmin.get();
    }
    set isAdmin(newValue: boolean) {
        this.__isAdmin.set(newValue);
    }
    aboutToAppear() {
        this.loadData();
    }
    async loadData() {
        this.isAdmin = await StorageUtil.get('isAdmin');
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Detail.ets(22:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Detail.ets(24:7)", "entry");
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
            Image.debugLine("entry/src/main/ets/pages/Detail.ets(25:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => router.back());
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.toilet?.name || '');
            Text.debugLine("entry/src/main/ets/pages/Detail.ets(29:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Detail.ets(34:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => this.showStatsModal());
        }, Image);
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 厕位网格
            Grid.create();
            Grid.debugLine("entry/src/main/ets/pages/Detail.ets(45:7)", "entry");
            // 厕位网格
            Grid.columnsTemplate('1fr 1fr 1fr');
            // 厕位网格
            Grid.rowsGap(10);
            // 厕位网格
            Grid.columnsGap(10);
            // 厕位网格
            Grid.padding(15);
            // 厕位网格
            Grid.layoutWeight(1);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const stall = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/pages/Detail.ets(47:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.StallItem.bind(this)(stall, index + 1);
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.toilet?.stalls || [], forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 厕位网格
        Grid.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 添加厕位按钮（仅管理员可见）
            if (this.isAdmin) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle });
                        Button.debugLine("entry/src/main/ets/pages/Detail.ets(60:9)", "entry");
                        Button.width(56);
                        Button.height(56);
                        Button.position({ x: '85%', y: '85%' });
                        Button.onClick(() => this.goToAddStall());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Detail.ets(61:11)", "entry");
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor(Color.White);
                    }, Image);
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
    StallItem(stall: StallModel, number: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Detail.ets(79:5)", "entry");
            Column.width('100%');
            Column.height(140);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.onClick(() => {
                this.currentStall = stall;
                router.pushUrl({
                    url: 'pages/StallDetail'
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 性别标识
            Text.create(stall.gender);
            Text.debugLine("entry/src/main/ets/pages/Detail.ets(81:7)", "entry");
            // 性别标识
            Text.fontSize(12);
            // 性别标识
            Text.fontColor(Color.White);
            // 性别标识
            Text.backgroundColor(stall.gender === '男' ? '#1976d2' : '#d81b60');
            // 性别标识
            Text.width(20);
            // 性别标识
            Text.height(20);
            // 性别标识
            Text.textAlign(TextAlign.Center);
            // 性别标识
            Text.borderRadius(10);
            // 性别标识
            Text.position({ x: 5, y: 5 });
        }, Text);
        // 性别标识
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 厕位编号
            Text.create(number.toString());
            Text.debugLine("entry/src/main/ets/pages/Detail.ets(92:7)", "entry");
            // 厕位编号
            Text.fontSize(16);
            // 厕位编号
            Text.fontWeight(FontWeight.Medium);
            // 厕位编号
            Text.margin({ top: 20 });
        }, Text);
        // 厕位编号
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态图标
            Image.create(this.getStatusIcon(stall.state));
            Image.debugLine("entry/src/main/ets/pages/Detail.ets(98:7)", "entry");
            // 状态图标
            Image.width(24);
            // 状态图标
            Image.height(24);
            // 状态图标
            Image.margin({ top: 8 });
            // 状态图标
            Image.fillColor(this.getStatusColor(stall.state));
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态文本
            Text.create(stall.status);
            Text.debugLine("entry/src/main/ets/pages/Detail.ets(105:7)", "entry");
            // 状态文本
            Text.fontSize(12);
            // 状态文本
            Text.fontColor(this.getStatusColor(stall.state));
            // 状态文本
            Text.margin({ top: 4 });
        }, Text);
        // 状态文本
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 开锁按钮（仅管理员可见且厕位空闲时显示）
            if (this.isAdmin && stall.state === 'empty') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Normal });
                        Button.debugLine("entry/src/main/ets/pages/Detail.ets(112:9)", "entry");
                        Button.width(36);
                        Button.height(36);
                        Button.margin({ top: 8 });
                        Button.backgroundColor('#4CAF50');
                        Button.onClick((event: ClickEvent) => {
                            // event.stopPropagation();
                            this.handleUnlock(number, stall);
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Detail.ets(113:11)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor(Color.White);
                    }, Image);
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
    private getStatusIcon(state: string): ResourceStr {
        const icons: Record<string, ResourceStr> = {
            'empty': { "id": 16777255, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" },
            'occupied': { "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" },
            'fault': { "id": 16777222, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" },
            'maintenance': { "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" },
            'disabled': { "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" },
            'smoke': { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" }
        };
        return icons[state] || icons.empty;
    }
    private getStatusColor(state: string): string {
        const colors: Record<string, string> = {
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
            await StorageUtil.setCurrentToilet(this.toilet!);
            const toilets = await StorageUtil.getToilets();
            const index = toilets.findIndex(t => t.name === this.toilet?.name);
            if (index !== -1) {
                toilets[index] = this.toilet!;
                await StorageUtil.saveToilets(toilets);
            }
            // 显示提示
            promptAction.showToast({ message: '开锁成功' });
        }
    }
    private showStatsModal() {
        // 计算统计数据
        const stats: Record<string, Record<string, number>> = {
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
                action: () => { }
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DetailPage";
    }
}
registerNamedRoute(() => new DetailPage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/Detail", pageFullPath: "entry/src/main/ets/pages/Detail", integratedHsp: "false", moduleType: "followWithHap" });
