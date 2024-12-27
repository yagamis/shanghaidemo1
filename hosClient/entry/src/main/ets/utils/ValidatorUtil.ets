export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export class ValidatorUtil {
  static async validate(value: any, rules: ValidationRule[]): Promise<ValidationResult> {
    for (const rule of rules) {
      // 必填检查
      if (rule.required && !value) {
        return {
          valid: false,
          message: rule.message || '此项为必填项'
        };
      }

      // 最小值检查
      if (rule.min !== undefined && value < rule.min) {
        return {
          valid: false,
          message: rule.message || `不能小于${rule.min}`
        };
      }

      // 最大值检查
      if (rule.max !== undefined && value > rule.max) {
        return {
          valid: false,
          message: rule.message || `不能大于${rule.max}`
        };
      }

      // 正则匹配
      if (rule.pattern && !rule.pattern.test(value)) {
        return {
          valid: false,
          message: rule.message || '格式不正确'
        };
      }

      // 自定义验证
      if (rule.validator) {
        const result = await Promise.resolve(rule.validator(value));
        if (!result) {
          return {
            valid: false,
            message: rule.message || '验证失败'
          };
        }
      }
    }

    return { valid: true };
  }

  // 预定义的验证规则
  static rules = {
    required: (message?: string): ValidationRule => ({
      required: true,
      message: message || '此项为必填项'
    }),

    number: (message?: string): ValidationRule => ({
      pattern: /^\d+$/,
      message: message || '请输入数字'
    }),

    email: (message?: string): ValidationRule => ({
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: message || '请输入有效的邮箱地址'
    }),

    phone: (message?: string): ValidationRule => ({
      pattern: /^1[3-9]\d{9}$/,
      message: message || '请输入有效的手机号'
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      validator: (value: string) => value.length >= min,
      message: message || `长度不能小于${min}个字符`
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      validator: (value: string) => value.length <= max,
      message: message || `长度不能大于${max}个字符`
    })
  };
} 