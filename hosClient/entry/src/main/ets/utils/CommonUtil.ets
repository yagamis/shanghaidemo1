export class CommonUtil {
  // 日期格式化
  static formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('HH', hour.toString().padStart(2, '0'))
      .replace('mm', minute.toString().padStart(2, '0'))
      .replace('ss', second.toString().padStart(2, '0'));
  }

  // 格式化时长
  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分`;
    }
    if (minutes > 0) {
      return `${minutes}分${seconds % 60}秒`;
    }
    return `${seconds}秒`;
  }

  // 防抖函数
  static debounce(fn: Function, delay: number): Function {
    let timer: number = -1;
    return function (...args: any[]) {
      if (timer !== -1) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  }

  // 节流函数
  static throttle(fn: Function, delay: number): Function {
    let last = 0;
    return function (...args: any[]) {
      const now = Date.now();
      if (now - last > delay) {
        fn.apply(this, args);
        last = now;
      }
    }
  }
} 