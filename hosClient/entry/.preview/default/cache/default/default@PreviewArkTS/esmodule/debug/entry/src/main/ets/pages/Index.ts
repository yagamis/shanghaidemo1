if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface IndexPage_Params {
}
import router from "@ohos:router";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
class IndexPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: IndexPage_Params) {
    }
    updateStateVars(params: IndexPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    aboutToAppear() {
        this.checkLoginStatus();
    }
    async checkLoginStatus() {
        // 检查是否已登录
        const isLoggedIn = await StorageUtil.get('isLoggedIn');
        // 延迟跳转，确保启动动画显示完整
        setTimeout(() => {
            router.replaceUrl({
                url: isLoggedIn ? 'pages/Home' : 'pages/Login'
            });
        }, 1000);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(24:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 启动页面内容
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Index.ets(26:7)", "entry");
            // 启动页面内容
            Image.width(120);
            // 启动页面内容
            Image.height(120);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智能公厕');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(29:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "IndexPage";
    }
}
registerNamedRoute(() => new IndexPage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
