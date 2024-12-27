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
    const stallId = params.get('id');
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
            // 强制重新获取最新状态
            const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
            if (currentToilet && currentToilet.stalls[stallIndex]) {
                Object.assign(stall, currentToilet.stalls[stallIndex]);
            }
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

    // 更新照明开关状态
    const lightToggle = document.getElementById('lightToggle');
    const lightLabel = document.getElementById('lightLabel');
    if (lightToggle && lightLabel) {
        lightToggle.checked = stall.lightOn ?? true; // 默认为开启状态
        lightLabel.textContent = stall.lightOn ? '开' : '关';
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
    const { toilet, id, state, status } = event.detail;
    
    // 获取当前页面的厕位信息
    const params = new URLSearchParams(window.location.search);
    const currentStallId = params.get('id');
    const currentToiletName = decodeURIComponent(params.get('toilet') || '');
    
    // 只有当更新的是当前查看的厕位时才刷新页面
    if (currentStallId === id.toString() && currentToiletName === toilet) {
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

// 在现有代码后添加照明控制函数
function toggleLight(isOn) {
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    // 更新 toiletsData
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
    
    if (toiletIndex !== -1 && stallId) {
        const stall = toiletsData[toiletIndex].stalls[stallId - 1];
        if (stall) {
            // 更新照明状态
            stall.lightOn = isOn;
            
            // 保存到 toiletsData
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));

            // 更新显示
            document.getElementById('lightLabel').textContent = isOn ? '开' : '关';

            // 显示提示
            showToast(`已${isOn ? '打开' : '关闭'}照明`, 'success');
        }
    }
}
  