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

    // 检查管理员权限并显示/隐藏管理员面板
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = isAdmin ? 'block' : 'none';
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
    
    console.log('Updating page with stall:', stall);
    const data = generateRandomData(stall.status);
    
    // 更新管理员面板状态
    if (document.getElementById('adminPanel')) {
        // 更新性别按钮状态
        const maleBtn = document.getElementById('maleBtn');
        const femaleBtn = document.getElementById('femaleBtn');
        if (maleBtn && femaleBtn) {
            maleBtn.classList.toggle('active', stall.gender === '男');
            femaleBtn.classList.toggle('active', stall.gender === '女');
        }
        
        // 更新维修状态按钮
        const maintenanceBtns = document.querySelectorAll('.maintenance-btn');
        maintenanceBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.state === stall.state);
        });
        
        // 更新启用/禁用开关
        const enableToggle = document.getElementById('enableToggle');
        const toggleLabel = document.getElementById('toggleLabel');
        if (enableToggle && toggleLabel) {
            const isEnabled = stall.state !== 'disabled';
            enableToggle.checked = isEnabled;
            toggleLabel.textContent = isEnabled ? '启用' : '禁用';
        }
        
        // 更新快捷操作按钮状态
        const repairBtn = document.querySelector('.action-btn.repair');
        if (repairBtn) {
            const needsRepair = ['fault', 'maintenance', 'smoke'].includes(stall.state);
            repairBtn.disabled = !needsRepair;
        }
        
        const emergencyBtn = document.querySelector('.action-btn.emergency');
        if (emergencyBtn) {
            emergencyBtn.disabled = !stall.emergency;
        }
    }
    
    // 控制结束使用按钮的显示
    const endUseContainer = document.getElementById('endUseContainer');
    if (endUseContainer) {
        // 调试日志
        console.log('Checking occupancy - State:', stall.state, 'Status:', stall.status);
        // 检查占用状态 - 只要有一个条件满足即可
        const isOccupied = stall.state === 'occupied' || stall.status === '占用';
        console.log('Is occupied:', isOccupied);
        endUseContainer.style.display = isOccupied ? 'block' : 'none';
        
        // 更新帮助按钮状态
        const helpBtn = endUseContainer.querySelector('.help-btn');
        if (helpBtn && stall.emergency) {
            helpBtn.disabled = true;
            helpBtn.classList.add('requested');
            helpBtn.innerHTML = '<i class="fas fa-check-circle"></i> 已发送求助';
        }
    }
    
    // 计算使用时长
    let useTimeText = '未使用';
    if ((stall.state === 'occupied' || stall.status === '占用') && stall.unlockTime) {
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
    const emergencyHelpContainer = document.getElementById('emergencyHelpContainer');
    if (emergencyHelpContainer) {
        // 只在占用状态下显示紧急求助区域
        const isOccupied = stall.state === 'occupied' || stall.status === '占用';
        emergencyHelpContainer.style.display = isOccupied ? 'block' : 'none';
        
        // 如果显示，则更新按钮状态
        if (isOccupied) {
            const helpBtn = emergencyHelpContainer.querySelector('.help-btn');
            if (helpBtn) {
                if (stall.emergency) {
                    helpBtn.disabled = true;
                    helpBtn.classList.add('requested');
                    helpBtn.innerHTML = '<i class="fas fa-check-circle"></i> 已发送求助';
                } else {
                    helpBtn.disabled = false;
                    helpBtn.classList.remove('requested');
                    helpBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> 呼叫帮助';
                }
            }
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
    const params = new URLSearchParams(window.location.search);
    const toiletName = params.get('toilet');
    
    // 返回到详情页
    window.location.href = `detail.html?name=${encodeURIComponent(toiletName)}`;
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

// 添加结束使用功能
function endUse() {
    console.log('End use function called');
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    console.log('Params:', { stallId, toiletName });
    
    showConfirm('确认结束使用该厕位？', () => {
        // 更新 toiletsData
        const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
        console.log('Current toiletsData:', toiletsData);
        const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
        
        if (toiletIndex !== -1 && stallId) {
            const stall = toiletsData[toiletIndex].stalls[stallId - 1];
            if (stall) {
                // 更新厕位状态
                stall.state = 'empty';
                stall.status = '空';
                delete stall.unlockTime;
                
                console.log('Updated stall:', stall);
                
                // 保存到 toiletsData
                localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
                
                // 同步更新 currentToilet
                const currentToilet = toiletsData[toiletIndex];
                localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
                
                // 显示提示
                showToast('已结束使用', 'success');
                
                // 触发状态更新事件
                window.dispatchEvent(new CustomEvent('stallStatusUpdate', {
                    detail: {
                        toilet: toiletName,
                        id: stallId,
                        state: 'empty',
                        status: '空'
                    }
                }));
                
                // 延迟返回上一页，等待 Toast 显示完
                setTimeout(() => {
                    history.back();
                }, 1000);
            }
        }
    });
}

// 添加紧急求助功能
function requestEmergencyHelp() {
    const helpBtn = document.querySelector('.help-btn');
    const emergencyBtn = document.querySelector('.action-btn.emergency');
    
    // 更新按钮状态
    helpBtn.classList.add('requested');
    helpBtn.innerHTML = '<i class="fas fa-check-circle"></i> 已发送求助';
    helpBtn.disabled = true;
    
    // 如果是管理员，激活紧急开锁按钮
    if (localStorage.getItem('isAdmin') === 'true' && emergencyBtn) {
        emergencyBtn.classList.add('active');
        emergencyBtn.disabled = false;
    }
    
    // 更新厕位状态为紧急求助
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
    
    if (toiletIndex !== -1 && stallId) {
        const stall = toiletsData[toiletIndex].stalls[stallId - 1];
        if (stall) {
            // 设置紧急状态标记
            stall.emergency = true;
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
            
            // 同步更新 currentToilet
            const currentToilet = toiletsData[toiletIndex];
            localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
            
            // 刷新页面显示
            initPage();
        }
    }
    
    showToast('紧急求助已发送', 'success');
}

// 添加快捷操作功能
function quickAction(type) {
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    showConfirm(`确认要${type === 'emergency' ? '紧急开锁' : '完成维修'}？`, () => {
        const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
        const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
        
        if (toiletIndex !== -1 && stallId) {
            const stall = toiletsData[toiletIndex].stalls[stallId - 1];
            if (stall) {
                // 更新状态
                stall.state = 'empty';
                stall.status = '空';
                if (type === 'emergency') {
                    delete stall.emergency;  // 清除紧急状态
                }
                
                localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
                
                // 同步更新 currentToilet
                const currentToilet = toiletsData[toiletIndex];
                localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
                
                // 刷新页面显示
                initPage();
                
                showToast(type === 'emergency' ? '紧急开锁成功' : '维修完成', 'success');
            }
        }
    });
}

// 确保所有函数在全局作用域可用
window.goBack = goBack;
window.toggleLight = toggleLight;
window.endUse = endUse;
window.requestEmergencyHelp = requestEmergencyHelp;
window.quickAction = quickAction;

// 切换性别
function changeGender(gender) {
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
    
    if (toiletIndex !== -1 && stallId) {
        const stall = toiletsData[toiletIndex].stalls[stallId - 1];
        if (stall) {
            stall.gender = gender;
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
            
            // 更新当前厕所数据
            const currentToilet = toiletsData[toiletIndex];
            localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
            
            // 刷新页面显示
            initPage();
            
            showToast(`已将性别设置为${gender}厕`, 'success');
        }
    }
}

// 切换启用状态
function toggleEnable(enabled) {
    const params = new URLSearchParams(window.location.search);
    const stallId = params.get('id');
    const toiletName = params.get('toilet');
    
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const toiletIndex = toiletsData.findIndex(t => t.name === decodeURIComponent(toiletName));
    
    if (toiletIndex !== -1 && stallId) {
        const stall = toiletsData[toiletIndex].stalls[stallId - 1];
        if (stall) {
            if (enabled) {
                stall.state = 'empty';
                stall.status = '空';
            } else {
                stall.state = 'disabled';
                stall.status = '禁用';
            }
            
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
            
            // 更新当前厕所数据
            const currentToilet = toiletsData[toiletIndex];
            localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
            
            // 刷新页面显示
            initPage();
            
            showToast(`已${enabled ? '启用' : '禁用'}该厕位`, 'success');
        }
    }
}
  