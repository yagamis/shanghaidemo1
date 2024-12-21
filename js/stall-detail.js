function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        stallId: params.get('stallId'),
        status: params.get('status')
    };
}

function generateRandomData() {
    return {
        usageTime: Math.floor(Math.random() * 30),
        temperature: (20 + Math.random() * 10).toFixed(1),
        smoke: Math.random() > 0.8 ? '有' : '无',
        lockStatus: Math.random() > 0.5 ? '是' : '否',
        paper: ['多', '中', '少'][Math.floor(Math.random() * 3)]
    };
}

function initPage() {
    const { stallId, status } = getUrlParams();
    const data = generateRandomData();

    // 填充信息
    document.getElementById('status').textContent = status;
    document.getElementById('usageTime').textContent = `${data.usageTime}分钟`;
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('smoke').textContent = data.smoke;
    document.getElementById('lockStatus').textContent = data.lockStatus;
    document.getElementById('paper').textContent = data.paper;

    // 检查是否为管理员
    checkAdminAccess();
}

function checkAdminAccess() {
    // 这里应该从登录状态中获取用户信息
    // 简单起见，这里直接检查localStorage中是否存在admin标记
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminPanel = document.getElementById('adminPanel');
    if (isAdmin) {
        adminPanel.classList.remove('hidden');
    }
}

function handleControl(action) {
    // 处理控制按钮点击
    alert(`执行操作: ${action}`);
}

function goBack() {
    window.history.back();
}

// 页面加载时初始化
window.onload = initPage; 