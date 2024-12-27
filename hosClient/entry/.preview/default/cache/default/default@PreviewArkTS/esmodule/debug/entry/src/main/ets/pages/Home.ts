if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    toilets?: ToiletModel[];
    currentToilet?: ToiletModel;
    currentTab?: string;
}
import { toiletsInitData } from "@normalized:N&&&entry/src/main/ets/model/ToiletModel&";
import type { ToiletModel, StallModel } from "@normalized:N&&&entry/src/main/ets/model/ToiletModel&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import router from "@ohos:router";
class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__toilets = new ObservedPropertyObjectPU([], this, "toilets");
        this.__currentToilet = new SynchedPropertyObjectTwoWayPU(params.currentToilet, this, "currentToilet");
        this.__currentTab = new ObservedPropertySimplePU('home', this, "currentTab");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.toilets !== undefined) {
            this.toilets = params.toilets;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__toilets.purgeDependencyOnElmtId(rmElmtId);
        this.__currentToilet.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__toilets.aboutToBeDeleted();
        this.__currentToilet.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __toilets: ObservedPropertyObjectPU<ToiletModel[]>;
    get toilets() {
        return this.__toilets.get();
    }
    set toilets(newValue: ToiletModel[]) {
        this.__toilets.set(newValue);
    }
    private __currentToilet: SynchedPropertySimpleOneWayPU<ToiletModel>;
    get currentToilet() {
        return this.__currentToilet.get();
    }
    set currentToilet(newValue: ToiletModel) {
        this.__currentToilet.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<string>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: string) {
        this.__currentTab.set(newValue);
    }
    aboutToAppear() {
        if (this.toilets.length === 0) {
            this.toilets = toiletsInitData;
        }
        else {
            this.loadToilets();
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Home.ets(34:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题
            Text.create('附近公厕');
            Text.debugLine("entry/src/main/ets/pages/Home.ets(36:7)", "entry");
            // 顶部标题
            Text.fontSize(18);
            // 顶部标题
            Text.fontWeight(FontWeight.Medium);
            // 顶部标题
            Text.width('100%');
            // 顶部标题
            Text.textAlign(TextAlign.Center);
            // 顶部标题
            Text.padding(15);
            // 顶部标题
            Text.backgroundColor(Color.White);
        }, Text);
        // 顶部标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 公厕列表
            List.create({ space: 8 });
            List.debugLine("entry/src/main/ets/pages/Home.ets(45:7)", "entry");
            // 公厕列表
            List.width('100%');
            // 公厕列表
            List.layoutWeight(1);
            // 公厕列表
            List.padding({ left: 15, right: 15 });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const toilet = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        itemCreation2(elmtId, isInitialRender);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.debugLine("entry/src/main/ets/pages/Home.ets(47:11)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.ToiletItem.bind(this)(toilet);
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.toilets, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 公厕列表
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(58:7)", "entry");
            // 底部导航栏
            Row.width('100%');
            // 底部导航栏
            Row.height(50);
            // 底部导航栏
            Row.backgroundColor(Color.White);
            // 底部导航栏
            Row.border({ width: { top: 0.5 }, color: '#eeeeee' });
        }, Row);
        this.TabItem.bind(this)('home', '首页', 'home');
        this.TabItem.bind(this)('settings', '我的', 'user');
        // 底部导航栏
        Row.pop();
        Column.pop();
    }
    ToiletItem(toilet: ToiletModel, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Home.ets(74:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(75:7)", "entry");
            Row.width('100%');
            Row.padding(15);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.onClick(() => {
                this.currentToilet = toilet;
                router.pushUrl({
                    url: 'pages/Detail'
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Home.ets(76:9)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(77:11)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(78:13)", "entry");
            Image.width(20);
            Image.height(20);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(toilet.name);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(81:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(84:13)", "entry");
            Row.margin({ left: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(85:15)", "entry");
            Image.width(14);
            Image.height(14);
            Image.fillColor('#ffa000');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(toilet.ratingCount > 0 ?
                `${toilet.rating.toFixed(1)} (${toilet.ratingCount})` :
                '暂无评分');
            Text.debugLine("entry/src/main/ets/pages/Home.ets(89:15)", "entry");
            Text.fontSize(13);
            Text.fontColor('#ffa000');
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(99:11)", "entry");
            Row.width('100%');
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(100:13)", "entry");
            Image.width(16);
            Image.height(16);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(toilet.address);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(103:13)", "entry");
            Text.fontSize(13);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(110:11)", "entry");
            Row.width('100%');
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(111:13)", "entry");
            Image.width(16);
            Image.height(16);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(toilet.distance);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(114:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(120:11)", "entry");
            Row.margin({ top: 8 });
            Row.width('100%');
        }, Row);
        this.StallStats.bind(this)('男', toilet.stalls);
        this.StallStats.bind(this)('女', toilet.stalls);
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Home.ets(129:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(toilet.status);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(130:11)", "entry");
            Text.fontSize(12);
            Text.fontColor(toilet.status === '正常' ? '#4CAF50' : '#FF9800');
            Text.backgroundColor(toilet.status === '正常' ? '#E8F5E9' : '#FFF3E0');
            Text.padding({
                left: 8,
                right: 8,
                top: 4,
                bottom: 4
            });
            Text.borderRadius(4);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    StallStats(gender: string, stalls: StallModel[], parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Home.ets(158:5)", "entry");
            Row.backgroundColor('#f5f5f5');
            Row.padding({
                left: 8,
                right: 8,
                top: 3,
                bottom: 3
            });
            Row.borderRadius(12);
            Row.margin({ right: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": -1, "type": -1, params: [`app.media.${gender === '男' ? 'male' : 'female'}`], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(159:7)", "entry");
            Image.width(14);
            Image.height(14);
            Image.fillColor(gender === '男' ? '#1976d2' : '#d81b60');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`空位 ${this.getEmptyCount(gender, stalls)}/${this.getTotalCount(gender, stalls)}`);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(163:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
    }
    private getEmptyCount(gender: string, stalls: StallModel[]): number {
        return stalls.filter(s => s.gender === gender && s.state === 'empty').length;
    }
    private getTotalCount(gender: string, stalls: StallModel[]): number {
        return stalls.filter(s => s.gender === gender).length;
    }
    TabItem(id: string, text: string, icon: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Home.ets(188:5)", "entry");
            Column.layoutWeight(1);
            Column.onClick(() => this.currentTab = id);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": -1, "type": -1, params: ['app.media.' + icon], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Home.ets(189:7)", "entry");
            Image.width(20);
            Image.height(20);
            Image.fillColor(this.currentTab === id ? '#2196F3' : '#666666');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.debugLine("entry/src/main/ets/pages/Home.ets(193:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.currentTab === id ? '#2196F3' : '#666666');
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
