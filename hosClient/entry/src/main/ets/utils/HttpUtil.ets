import http from '@ohos.net.http';

interface RequestOptions {
  method?: http.RequestMethod;
  data?: object | string;
  headers?: object;
  timeout?: number;
}

export class HttpUtil {
  private static baseUrl: string = 'https://api.example.com';  // 替换为实际的API地址
  private static timeout: number = 10000;

  static async request(url: string, options: RequestOptions = {}) {
    const httpRequest = http.createHttp();
    
    try {
      const result = await httpRequest.request(
        this.baseUrl + url,
        {
          method: options.method || http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          extraData: options.data ? JSON.stringify(options.data) : undefined,
          connectTimeout: options.timeout || this.timeout,
          readTimeout: options.timeout || this.timeout
        }
      );

      if (result.responseCode === 200) {
        return JSON.parse(result.result.toString());
      } else {
        throw new Error(`HTTP Error: ${result.responseCode}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    } finally {
      httpRequest.destroy();
    }
  }

  static get(url: string, options: RequestOptions = {}) {
    return this.request(url, { ...options, method: http.RequestMethod.GET });
  }

  static post(url: string, data: object, options: RequestOptions = {}) {
    return this.request(url, { ...options, method: http.RequestMethod.POST, data });
  }

  static put(url: string, data: object, options: RequestOptions = {}) {
    return this.request(url, { ...options, method: http.RequestMethod.PUT, data });
  }

  static delete(url: string, options: RequestOptions = {}) {
    return this.request(url, { ...options, method: http.RequestMethod.DELETE });
  }
} 