import type { ToiletModel } from '../model/ToiletModel';
import preferences from "@ohos:data.preferences";
export class StorageUtil {
    private static readonly STORE_NAME = 'toilets_data';
    private static readonly KEY_TOILETS = 'toilets';
    private static readonly KEY_CURRENT_TOILET = 'current_toilet';
    private static readonly KEY_THEME = 'theme';
    private static readonly KEY_LANGUAGE = 'language';
    private static prefer: preferences.Preferences;
    static async init(context: Context) {
        StorageUtil.prefer = await preferences.getPreferences(context, StorageUtil.STORE_NAME);
    }
    static async set(key: string, value: boolean) {
        await StorageUtil.prefer.put(key, value);
        await StorageUtil.prefer.flush();
    }
    static async get(key: string): Promise<boolean> {
        return await StorageUtil.prefer.get(key, false) as boolean;
    }
    static async saveToilets(toilets: ToiletModel[]) {
        await StorageUtil.prefer.put(StorageUtil.KEY_TOILETS, JSON.stringify(toilets));
        await StorageUtil.prefer.flush();
    }
    static async getToilets(): Promise<ToiletModel[]> {
        const data = await StorageUtil.prefer.get(StorageUtil.KEY_TOILETS, '[]');
        return JSON.parse(data.toString());
    }
    static async setCurrentToilet(toilet: ToiletModel) {
        await StorageUtil.prefer.put(StorageUtil.KEY_CURRENT_TOILET, JSON.stringify(toilet));
        await StorageUtil.prefer.flush();
    }
    static async getCurrentToilet(): Promise<ToiletModel | null> {
        const data = await StorageUtil.prefer.get(StorageUtil.KEY_CURRENT_TOILET, '');
        return data ? JSON.parse(data.toString()) : null;
    }
    static async setTheme(isDark: boolean) {
        await StorageUtil.prefer.put(StorageUtil.KEY_THEME, isDark);
        await StorageUtil.prefer.flush();
    }
    static async getTheme(): Promise<boolean> {
        return await StorageUtil.prefer.get(StorageUtil.KEY_THEME, false) as boolean;
    }
    static async setLocale(locale: string) {
        await StorageUtil.prefer.put('locale', locale);
        await StorageUtil.prefer.flush();
    }
    static async getLocale(): Promise<string> {
        return await StorageUtil.prefer.get('locale', 'zh-CN') as string;
    }
}
