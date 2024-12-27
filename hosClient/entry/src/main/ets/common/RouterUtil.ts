export class RouterUtil {
  static push(url: string, params: Record<string, any> = {}) {
    router.pushUrl({
      url,
      params: {
        ...params,
        toilet: params.toilet ? JSON.stringify(params.toilet) : undefined,
        stall: params.stall ? JSON.stringify(params.stall) : undefined
      }
    });
  }

  static getParams<T>(key: string): T | undefined {
    const params = router.getParams() as Record<string, string>;
    const value = params[key];
    return value ? JSON.parse(value) : undefined;
  }
} 