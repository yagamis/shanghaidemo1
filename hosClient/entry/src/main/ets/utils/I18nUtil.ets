import { StorageUtil } from './StorageUtil';
import { eventBus } from './EventBus';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export class I18nUtil {
  private static instance: I18nUtil;
  private currentLocale: string = 'zh-CN';
  private translations: Translations = {
    'zh-CN': {
      app_name: '智能公厕',
      login: '登录',
      username: '用户名',
      password: '密码',
      home: '首页',
      mine: '我的',
      empty: '空闲',
      occupied: '占用',
      fault: '故障',
      maintenance: '维修',
      disabled: '禁用',
      male: '男',
      female: '女',
      add_stall: '新增厕位',
      stall_detail: '厕位详情',
      emergency: '紧急求助',
      save: '保存',
      cancel: '取消',
      confirm: '确定',
      loading: '加载中...',
      success: '成功',
      error: '错误',
      // ... 更多翻译
    },
    'en-US': {
      app_name: 'Smart Toilet',
      login: 'Login',
      username: 'Username',
      password: 'Password',
      home: 'Home',
      mine: 'Mine',
      empty: 'Empty',
      occupied: 'Occupied',
      fault: 'Fault',
      maintenance: 'Maintenance',
      disabled: 'Disabled',
      male: 'Male',
      female: 'Female',
      add_stall: 'Add Stall',
      stall_detail: 'Stall Detail',
      emergency: 'Emergency',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      // ... 更多翻译
    }
  };

  private constructor() {}

  static getInstance(): I18nUtil {
    if (!I18nUtil.instance) {
      I18nUtil.instance = new I18nUtil();
    }
    return I18nUtil.instance;
  }

  async init() {
    const locale = await StorageUtil.getLocale();
    this.setLocale(locale || 'zh-CN');
  }

  setLocale(locale: string) {
    if (this.translations[locale]) {
      this.currentLocale = locale;
      StorageUtil.setLocale(locale);
      eventBus.emit('localeChange', locale);
    }
  }

  t(key: string): string {
    return this.translations[this.currentLocale]?.[key] || key;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }
}

export const i18n = I18nUtil.getInstance(); 