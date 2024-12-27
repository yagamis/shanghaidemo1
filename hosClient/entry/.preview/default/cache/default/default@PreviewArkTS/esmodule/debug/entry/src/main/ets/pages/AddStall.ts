if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AddStallPage_Params {
    stallNumber?: string;
    gender?: string;
    state?: string;
    moduleId?: string;
    isLoading?: boolean;
}
import { StallModel } from "@normalized:N&&&entry/src/main/ets/model/ToiletModel&";
import { StorageUtil } from "@normalized:N&&&entry/src/main/ets/utils/StorageUtil&";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class AddStallPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__stallNumber = new ObservedPropertySimplePU('', this, "stallNumber");
        this.__gender = new ObservedPropertySimplePU('男', this, "gender");
        this.__state = new ObservedPropertySimplePU('empty', this, "state");
        this.__moduleId = new ObservedPropertySimplePU('', this, "moduleId");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AddStallPage_Params) {
        if (params.stallNumber !== undefined) {
            this.stallNumber = params.stallNumber;
        }
        if (params.gender !== undefined) {
            this.gender = params.gender;
        }
        if (params.state !== undefined) {
            this.state = params.state;
        }
        if (params.moduleId !== undefined) {
            this.moduleId = params.moduleId;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: AddStallPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__stallNumber.purgeDependencyOnElmtId(rmElmtId);
        this.__gender.purgeDependencyOnElmtId(rmElmtId);
        this.__state.purgeDependencyOnElmtId(rmElmtId);
        this.__moduleId.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__stallNumber.aboutToBeDeleted();
        this.__gender.aboutToBeDeleted();
        this.__state.aboutToBeDeleted();
        this.__moduleId.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __stallNumber: ObservedPropertySimplePU<string>;
    get stallNumber() {
        return this.__stallNumber.get();
    }
    set stallNumber(newValue: string) {
        this.__stallNumber.set(newValue);
    }
    private __gender: ObservedPropertySimplePU<string>;
    get gender() {
        return this.__gender.get();
    }
    set gender(newValue: string) {
        this.__gender.set(newValue);
    }
    private __state: ObservedPropertySimplePU<string>;
    get state() {
        return this.__state.get();
    }
    set state(newValue: string) {
        this.__state.set(newValue);
    }
    private __moduleId: ObservedPropertySimplePU<string>;
    get moduleId() {
        return this.__moduleId.get();
    }
    set moduleId(newValue: string) {
        this.__moduleId.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    aboutToAppear() {
        this.loadSuggestedNumber();
    }
    async loadSuggestedNumber() {
        const toilet = await StorageUtil.getCurrentToilet();
        if (toilet) {
            this.stallNumber = (toilet.stalls.length + 1).toString();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(27:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/AddStall.ets(29:7)", "entry");
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
            Image.debugLine("entry/src/main/ets/pages/AddStall.ets(30:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => router.back());
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新增厕位');
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(34:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单内容
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(46:7)", "entry");
            // 表单内容
            Column.padding(15);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 厕位编号
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(48:9)", "entry");
            // 厕位编号
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('厕位编号');
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(49:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入厕位编号', text: this.stallNumber });
            TextInput.debugLine("entry/src/main/ets/pages/AddStall.ets(53:11)", "entry");
            TextInput.type(InputType.Number);
            TextInput.width('100%');
            TextInput.height(45);
            TextInput.backgroundColor('#f8f8f8');
            TextInput.borderRadius(8);
            TextInput.onChange((value: string) => {
                this.stallNumber = value;
            });
        }, TextInput);
        // 厕位编号
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 性别选择
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(67:9)", "entry");
            // 性别选择
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('性别');
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(68:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/AddStall.ets(72:11)", "entry");
            Row.width('100%');
        }, Row);
        this.RadioButton.bind(this)('男', '男');
        this.RadioButton.bind(this)('女', '女');
        Row.pop();
        // 性别选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 初始状态
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(81:9)", "entry");
            // 初始状态
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('初始状态');
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(82:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([
                { value: 'empty' },
                { value: 'occupied', },
                { value: 'fault', },
                { value: 'maintenance', },
                { value: 'disabled', }
            ]);
            Select.debugLine("entry/src/main/ets/pages/AddStall.ets(86:11)", "entry");
            Select.selected(0);
            Select.value(this.state);
            Select.width('100%');
            Select.height(45);
            Select.backgroundColor('#f8f8f8');
            Select.borderRadius(8);
            Select.onSelect((index: number, value: string) => {
                this.state = value;
            });
        }, Select);
        Select.pop();
        // 初始状态
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星闪模组ID
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/AddStall.ets(106:9)", "entry");
            // 星闪模组ID
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('星闪模组ID');
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(107:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入星闪模组ID' });
            TextInput.debugLine("entry/src/main/ets/pages/AddStall.ets(111:11)", "entry");
            TextInput.width('100%');
            TextInput.height(45);
            TextInput.backgroundColor('#f8f8f8');
            TextInput.borderRadius(8);
            TextInput.onChange((value: string) => {
                this.moduleId = value;
            });
        }, TextInput);
        // 星闪模组ID
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 保存按钮
            Button.createWithLabel('保存');
            Button.debugLine("entry/src/main/ets/pages/AddStall.ets(123:9)", "entry");
            // 保存按钮
            Button.width('100%');
            // 保存按钮
            Button.height(45);
            // 保存按钮
            Button.backgroundColor('#2196F3');
            // 保存按钮
            Button.fontColor(Color.White);
            // 保存按钮
            Button.borderRadius(8);
            // 保存按钮
            Button.enabled(!this.isLoading);
            // 保存按钮
            Button.onClick(() => this.handleSave());
        }, Button);
        // 保存按钮
        Button.pop();
        // 表单内容
        Column.pop();
        Column.pop();
    }
    RadioButton(value: string, text: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/AddStall.ets(141:5)", "entry");
            Row.layoutWeight(1);
            Row.height(45);
            Row.backgroundColor('#f8f8f8');
            Row.borderRadius(8);
            Row.padding({ left: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: value, group: 'gender' });
            Radio.debugLine("entry/src/main/ets/pages/AddStall.ets(142:7)", "entry");
            Radio.checked(this.gender === value);
            Radio.onChange((isChecked: boolean) => {
                if (isChecked) {
                    this.gender = value;
                }
            });
        }, Radio);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.debugLine("entry/src/main/ets/pages/AddStall.ets(149:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
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
        }
        catch (error) {
            promptAction.showToast({ message: '保存失败：' + error.message });
        }
        finally {
            this.isLoading = false;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AddStallPage";
    }
}
registerNamedRoute(() => new AddStallPage(undefined, {}), "", { bundleName: "com.example.toilets", moduleName: "entry", pagePath: "pages/AddStall", pageFullPath: "entry/src/main/ets/pages/AddStall", integratedHsp: "false", moduleType: "followWithHap" });
