import { ToiletModel } from '../model/ToiletModel';

export class AppStore {
  private static instance: AppStore;
  @State toilets: ToiletModel[] = [];
  @State currentToilet: ToiletModel | null = null;
  @State isAdmin: boolean = false;
  @State isLoading: boolean = false;

  private constructor() {}

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  setToilets(toilets: ToiletModel[]) {
    this.toilets = toilets;
  }

  setCurrentToilet(toilet: ToiletModel) {
    this.currentToilet = toilet;
  }

  setIsAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }
}

export const appStore = AppStore.getInstance(); 