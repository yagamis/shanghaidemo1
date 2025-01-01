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

    /* 确认对话框样式 */
    .confirm-dialog {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        min-width: 280px;
        max-width: 90%;
    }

    .confirm-dialog.show {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        pointer-events: auto;
    }

    .confirm-dialog .message {
        margin: 0 0 20px 0;
        font-size: 16px;
        color: #333;
        text-align: center;
    }

    .confirm-dialog .buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
    }

    .confirm-dialog button {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .confirm-dialog .cancel-btn {
        background: #f5f5f5;
        color: #666;
    }

    .confirm-dialog .confirm-btn {
        background: #2196F3;
        color: white;
    }

    .confirm-dialog button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    .confirm-dialog button:active {
        transform: translateY(0);
    }

    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 1000;
    }

    .dialog-overlay.show {
        opacity: 1;
        pointer-events: auto;
    }
`;
document.head.appendChild(style);

// 创建确认对话框元素
let confirmDialog = null;
let dialogOverlay = null;

// 显示确认对话框
function showConfirm(message, onConfirm, onCancel) {
    // 如果对话框元素不存在，创建它
    if (!confirmDialog) {
        confirmDialog = document.createElement('div');
        confirmDialog.className = 'confirm-dialog';
        document.body.appendChild(confirmDialog);
        
        dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        document.body.appendChild(dialogOverlay);
    }
    
    // 设置对话框内容
    confirmDialog.innerHTML = `
        <div class="message">${message}</div>
        <div class="buttons">
            <button class="cancel-btn">取消</button>
            <button class="confirm-btn">确定</button>
        </div>
    `;
    
    // 添加按钮事件
    const cancelBtn = confirmDialog.querySelector('.cancel-btn');
    const confirmBtn = confirmDialog.querySelector('.confirm-btn');
    
    cancelBtn.onclick = () => {
        hideConfirm();
        if (onCancel) onCancel();
    };
    
    confirmBtn.onclick = () => {
        hideConfirm();
        if (onConfirm) onConfirm();
    };
    
    // 显示对话框和遮罩
    requestAnimationFrame(() => {
        dialogOverlay.classList.add('show');
        confirmDialog.classList.add('show');
    });
    
    // 点击遮罩关闭对话框
    dialogOverlay.onclick = () => {
        hideConfirm();
        if (onCancel) onCancel();
    };
}

// 隐藏确认对话框
function hideConfirm() {
    if (confirmDialog && dialogOverlay) {
        confirmDialog.classList.remove('show');
        dialogOverlay.classList.remove('show');
    }
}

// 导出函数到全局作用域
window.showConfirm = showConfirm; 