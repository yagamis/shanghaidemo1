function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        stallId: params.get('stallId'),
        status: params.get('status'),
        gender: params.get('gender')
    };
}

function generateRandomData(status) {
    return {
        usageTime: status === '占用' ? Math.floor(Math.random() * 30) : 0,
        temperature: (20 + Math.random() * 10).toFixed(1),
        smoke: Math.random() > 0.8 ? '有' : '无',
        humidity: Math.floor(40 + Math.random() * 20)
    };
}

function initPage() {
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('stallId');
    const toiletName = params.get('toilet');

    if (!stallId || !toiletName) {
        console.error('Missing required parameters');
        return;
    }

    // 从 localStorage 获取最新数据
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const toilet = toiletsData.find(t => t.name === decodeURIComponent(toiletName));
    
    if (toilet && toilet.stalls) {
        // 注意：stallId需要减1，因为数组索引从0开始
        const stallIndex = parseInt(stallId) - 1;
        const stall = toilet.stalls[stallIndex];
        
        if (stall) {
            console.log('Updating stall:', stallId, 'State:', stall.state);
            updatePageContent(stall, stallId);
        } else {
            console.error('Stall not found:', stallId);
        }
    } else {
        console.error('Toilet or stalls not found');
    }
}

function updatePageContent(stall, stallId) {
    if (!stall) return;
    
    console.log('Updating page with stall:', stall); // 调试日志
    const data = generateRandomData(stall.status);

    // 计算使用时长
    let useTimeText = '未使用';
    if (stall.state === 'occupied' && stall.unlockTime) {
        const now = Date.now();
        const duration = now - stall.unlockTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        useTimeText = `${minutes}分${seconds}秒`;
    }

    // 更新所有页面元素
    document.getElementById('stallNumber').textContent = stallId;
    document.getElementById('stallGender').textContent = stall.gender;
    document.getElementById('moduleId').textContent = stall.moduleId || '-';

    // 更新状态显示
    const statusElement = document.getElementById('stallStatus');
    statusElement.innerHTML = `
        <span class="status-badge status-${stall.state}">
            ${stall.status}
        </span>
    `;

    document.getElementById('useTime').textContent = useTimeText;
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('smoke').textContent = data.smoke;

    // 更新紧急求助按钮状态
    const helpBtn = document.querySelector('.help-btn');
    if (helpBtn) {
        if (stall.state === 'occupied') {
            helpBtn.disabled = false;
            helpBtn.classList.remove('requested');
        } else {
            helpBtn.disabled = true;
            helpBtn.classList.add('requested');
        }
    }
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

// 添加状态更新监听器
window.addEventListener('stallStatusUpdate', (event) => {
    console.log('Received status update:', event.detail);
    const { toiletName, stallId, newState, newStatus } = event.detail;
    
    // 获取当前页面的厕位信息
    const params = new URLSearchParams(window.location.search);
    const currentStallId = params.get('stallId');
    const currentToiletName = decodeURIComponent(params.get('toilet'));
    
    // 只有当更新的是当前查看的厕位时才刷新页面
    if (currentStallId === stallId.toString() && currentToiletName === toiletName) {
        console.log('Updating current stall view');
        initPage();
    }
});

// 修改自动刷新函数，确保在页面可见时才刷新
function startAutoRefresh() {
    const refreshInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            initPage();
        }
    }, 1000);

    // 清理函数
    return () => clearInterval(refreshInterval);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    initPage();
    startAutoRefresh();
});
  