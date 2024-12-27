if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    isLoading?: boolean;
}
import router from "@ohos:router";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import promptAction from "@ohos:promptAction";
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Login.ets(13:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Logo
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.toilets", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Login.ets(15:7)", "entry");
            // Logo
            Image.width(100);
            // Logo
            Image.height(100);
            // Logo
            Image.margin({ top: 80, bottom: 40 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入框
            TextInput.create({ placeholder: '请输入用户名' });
            TextInput.debugLine("entry/src/main/ets/pages/Login.ets(21:7)", "entry");
            // 用户名输入框
            TextInput.width('85%');
            // 用户名输入框
            TextInput.height(45);
            // 用户名输入框
            TextInput.margin({ bottom: 20 });
            // 用户名输入框
            TextInput.onChange((value: string) => {
                this.username = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码输入框
            TextInput.create({ placeholder: '请输入密码' });
            TextInput.debugLine("entry/src/main/ets/pages/Login.ets(30:7)", "entry");
            // 密码输入框
            TextInput.width('85%');
            // 密码输入框
            TextInput.height(45);
            // 密码输入框
            TextInput.type(InputType.Password);
            // 密码输入框
            TextInput.margin({ bottom: 30 });
            // 密码输入框
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Button.createWithLabel('登录');
            Button.debugLine("entry/src/main/ets/pages/Login.ets(40:7)", "entry");
            // 登录按钮
            Button.width('85%');
            // 登录按钮
            Button.height(45);
            // 登录按钮
            Button.backgroundColor('#2196F3');
            // 登录按钮
            Button.fontColor(Color.White);
            // 登录按钮
            Button.onClick(() => this.handleLogin());
        }, Button);
        // 登录按钮
        Button.pop();
        Column.pop();
    }
    async handleLogin() {
        if (!this.username || !this.password) {
            promptAction.showToast({ message: '请输入用户名和密码' });
            return;
        }
        this.isLoading = true;
        // 模拟登录请求
        setTimeout(async () => {
            this.isLoading = false;
            // 判断是否是管理员
            const isAdmin = this.username === 'admin' && this.password === 'admin';
            StorageUtil.set('isAdmin', isAdmin);
            StorageUtil.set('isLoggedIn', true);
            // await preferences.putSync('isAdmin', isAdmin);
            // await preferences.putSync('isLoggedIn', true);
            router.replaceUrl({
                url: 'pages/Home'
            });
        }, 1000);
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false", moduleType: "followWithHap" });
