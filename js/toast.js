// 通用的 Toast 提示函数
function showToast(message, type = 'normal', duration = 2000) {
    // 获取或创建 toast 容器
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // 设置消息内容
    toast.textContent = message;
    
    // 重置类名
    toast.className = 'toast';
    
    // 添加类型样式
    if (type === 'success') {
        toast.classList.add('success');
    } else if (type === 'error') {
        toast.classList.add('error');
    }
    
    // 显示 Toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Toast 样式
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        left: 50%;
        bottom: 100px;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    }

    .toast.show {
        opacity: 1;
    }

    .toast.success {
        background: rgba(76, 175, 80, 0.9);
    }

    .toast.error {
        background: rgba(244, 67, 54, 0.9);
    }
`;
document.head.appendChild(style); 