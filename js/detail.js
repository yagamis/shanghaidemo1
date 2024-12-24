function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        name: params.get('name')
    };
}

// 返回首页
function goBack() {
    window.location.href = 'home.html';
}

// 跳转到厕位详情页
function goToStallDetail(stallId, status, gender) {
    const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
    if (!currentToilet) return;



    // 所有用户（包括管理员）都可以点击查看详情
    const params = new URLSearchParams({
        id: stallId,
        toilet: currentToilet.name
    });
    window.location.href = `stall-detail.html?${params.toString()}`;
}

// 获取厕位数据
function getStallsData() {
    const savedData = localStorage.getItem('stallsData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // 默认数据：10个厕位，包含所有状态，3个空位
    const defaultData = [
        { status: '空', gender: '女', state: 'empty' },      // 1号：空位
        { status: '占用', gender: '女', state: 'occupied' }, // 2号：占用
        { status: '空', gender: '男', state: 'empty' },      // 3号：空位
        { status: '故障', gender: '男', state: 'fault' },    // 4号：故障
        { status: '空', gender: '女', state: 'empty' },      // 5号：空位
        { status: '维修', gender: '男', state: 'maintenance' }, // 6号：维修
        { status: '禁用', gender: '女', state: 'disabled' }, // 7号：禁用
        { status: '烟雾', gender: '男', state: 'smoke' },    // 8号：烟雾
        { status: '占用', gender: '女', state: 'occupied' }, // 9号：占用
        { status: '维修', gender: '男', state: 'maintenance' } // 10号：维修
    ];
    
    // 保存默认数据
    saveStallsData(defaultData);
    return defaultData;
}

// 保存厕位数据
function saveStallsData(data) {
    localStorage.setItem('stallsData', JSON.stringify(data));
}

// 更新单个厕位数据
function updateStall(stallId, updates) {
    try {
        const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
        if (currentToilet && currentToilet.stalls[stallId - 1]) {
            Object.assign(currentToilet.stalls[stallId - 1], updates);
            localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
        }
    } catch (error) {
        console.error('更新厕位状态失败:', error);
    }
}

// 获取状态图标
function getStatusIcon(state) {
    const icons = {
        empty: '<i class="fas fa-door-open"></i>',
        occupied: '<i class="fas fa-door-closed"></i>',
        fault: '<i class="fas fa-exclamation-triangle"></i>',
        maintenance: '<i class="fas fa-tools"></i>',
        disabled: '<i class="fas fa-ban"></i>',
        smoke: '<i class="fas fa-smoking"></i>'
    };
    return icons[state] || '';
}

// 获取警告图标
function getWarningIcon(state) {
    const icons = {
        fault: '<i class="fas fa-exclamation-triangle warning-icon"></i>',
        maintenance: '<i class="fas fa-tools warning-icon"></i>',
        disabled: '<i class="fas fa-ban warning-icon"></i>',
        smoke: '<i class="fas fa-smoking warning-icon"></i>'
    };
    return icons[state] ? icons[state] : '';
}

// 处理开锁
function handleUnlock(event, stallId, gender) {
    event.stopPropagation();
    
    if (confirm(`确认要开启${stallId}号${gender}厕所吗？`)) {
        const loading = document.getElementById('loading');
        loading.style.display = 'flex';
        
        setTimeout(() => {
            loading.style.display = 'none';
            alert(`${stallId}号厕位开锁成功！请在5分钟内进入`);
            
            // 记录开锁次数
            recordUnlock(stallId, gender);
            
            // 更新并保存厕位状态
            const updatedStall = updateStall(stallId, {
                status: '占用',
                state: 'occupied'
            });
            
            // 更新UI
            const gridItem = event.target.parentElement;
            gridItem.className = 'grid-item occupied';
            gridItem.dataset.state = 'occupied';
            gridItem.querySelector('.status-text').innerHTML = 
                `${getStatusIcon('occupied')}占用`;
            event.target.remove();
        }, 1500);
    }
}

// 初始化页面
function initPage() {
    try {
        const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
        if (!currentToilet) {
            console.error('未找到公厕数据');
            return;
        }

        document.getElementById('toiletName').textContent = currentToilet.name;

        const statusGrid = document.getElementById('statusGrid');
        statusGrid.innerHTML = currentToilet.stalls.map((stall, index) => {
            return `
                <div class="grid-item ${stall.state}" onclick="goToStallDetail(${index + 1}, '${stall.status}', '${stall.gender}')">
                    <div class="stall-number">${index + 1}</div>
                    <div class="gender-badge ${stall.gender === '男' ? 'male' : 'female'}">
                        ${stall.gender}
                    </div>
                    <div class="stall-info">
                        <span class="status-text">
                            ${getStatusIcon(stall.state)}
                            ${stall.status}
                        </span>
                        ${getWarningIcon(stall.state)}
                        ${stall.state === 'empty' ? `
                            <button class="unlock-btn" 
                                    onclick="handleUnlock(event, ${index + 1}, '${stall.gender}')">
                                开锁
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

      
    } catch (error) {
        console.error('初始化页面失败:', error);
    
    }
}

// 确保所有函数都在全局作用域
window.goBack = goBack;
window.goToStallDetail = goToStallDetail;
window.handleUnlock = handleUnlock;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);

// 添加状态循环切换函数
function cycleStallStatus(stallId) {
    const item = document.querySelector(`[data-stall-id="${stallId}"]`);
    if (!item) return;

    // 定义状态循环顺序
    const statusCycle = [
        { state: 'empty', text: '空闲' },
        { state: 'occupied', text: '占用' },
        { state: 'fault', text: '故障' },
        { state: 'maintenance', text: '维修' },
        { state: 'smoke', text: '烟雾' }
    ];

    // 获取当前状态
    let currentIndex = statusCycle.findIndex(status => 
        item.classList.contains(status.state)
    );

    // 切换到下一个状态
    currentIndex = (currentIndex + 1) % statusCycle.length;
    const newStatus = statusCycle[currentIndex];

    // 移除所有状态类
    statusCycle.forEach(status => item.classList.remove(status.state));
    
    // 添加新状态类
    item.classList.add(newStatus.state);

    // 更新显示文本
    const statusText = item.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = newStatus.text;
    }

    // 更新图标
    updateStatusIcon(item, newStatus.state);

    // 显示 Toast 提示
    showToast(`已将${stallId}号厕位设为${newStatus.text}`, 'success');
}

// 更新状态图标
function updateStatusIcon(item, state) {
    const statusIcon = item.querySelector('.status-text i');
    if (!statusIcon) return;

    // 移除所有图标类
    statusIcon.className = 'fas';

    // 添加对应状态的图标
    switch (state) {
        case 'empty':
            statusIcon.classList.add('fa-door-open');
            break;
        case 'occupied':
            statusIcon.classList.add('fa-door-closed');
            break;
        case 'fault':
            statusIcon.classList.add('fa-exclamation-triangle');
            break;
        case 'maintenance':
            statusIcon.classList.add('fa-tools');
            break;
        case 'smoke':
            statusIcon.classList.add('fa-smoking');
            break;
    }
}

// 在页面加载时清除所有统计数据（临时添加，用于重置）
localStorage.removeItem('unlockStats');

// 获取统计数据
function getUnlockStats() {
    return JSON.parse(localStorage.getItem('unlockStats') || '{}');
}

// 保存统计数据
function saveUnlockStats(stats) {
    localStorage.setItem('unlockStats', JSON.stringify(stats));
}

// 记录开锁
function recordUnlock(stallId, gender) {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const stats = getUnlockStats();
    
    if (!stats[dateKey]) {
        stats[dateKey] = {};
    }
    if (!stats[dateKey][stallId]) {
        stats[dateKey][stallId] = {
            count: 0,
            gender: gender
        };
    }
    
    stats[dateKey][stallId].count++;
    saveUnlockStats(stats);
}

// 显示统计弹窗
function showStatsModal() {
    document.getElementById('statsModal').style.display = 'block';
    updateStatsView();
}

// 关闭统计弹窗
function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

// 更新统计视图
function updateStatsView() {
    const filter = document.getElementById('statsFilter').value;
    const stats = getUnlockStats();
    const statsList = document.getElementById('statsList');
    
    // 获取日期范围
    const dateRange = getDateRange(filter);
    
    // 统计数据
    const stallStats = {};
    let totalMale = 0;
    let totalFemale = 0;
    
    // 计算各厕位统计和性别总计
    for (const date of dateRange) {
        const dateStats = stats[date] || {};
        for (const [stallId, data] of Object.entries(dateStats)) {
            if (!stallStats[stallId]) {
                stallStats[stallId] = {
                    count: 0,
                    gender: data.gender
                };
            }
            stallStats[stallId].count += data.count;
            
            // 累计男女使用次数
            if (data.gender === '男') {
                totalMale += data.count;
            } else {
                totalFemale += data.count;
            }
        }
    }
    
    // 渲染统计列表
    const timeRange = filter === 'today' ? '今日' : (filter === 'week' ? '本周' : '本月');
    
    // 如果没有任何数据，显示暂无数据
    if (Object.keys(stallStats).length === 0) {
        statsList.innerHTML = `
            <div class="stats-summary">
                <h4>${timeRange}使用统计</h4>
                <div class="stats-total">
                    <div class="stats-total-item male">
                        <i class="fas fa-male"></i>
                        <span>男厕：0次</span>
                    </div>
                    <div class="stats-total-item female">
                        <i class="fas fa-female"></i>
                        <span>女厕：0次</span>
                    </div>
                </div>
            </div>
            <div class="stats-divider"></div>
            <div class="stats-details">
                <h4>厕位详情</h4>
                <div class="no-data">暂无数据</div>
            </div>
        `;
        return;
    }
    
    statsList.innerHTML = `
        <!-- 总计统计 -->
        <div class="stats-summary">
            <h4>${timeRange}使用统计</h4>
            <div class="stats-total">
                <div class="stats-total-item male">
                    <i class="fas fa-male"></i>
                    <span>男厕：${totalMale}次</span>
                </div>
                <div class="stats-total-item female">
                    <i class="fas fa-female"></i>
                    <span>女厕：${totalFemale}次</span>
                </div>
            </div>
        </div>
        
        <!-- 分割线 -->
        <div class="stats-divider"></div>
        
        <!-- 详细统计 -->
        <div class="stats-details">
            <h4>厕位详情</h4>
            ${Object.entries(stallStats)
                .sort(([a], [b]) => a - b)
                .map(([stallId, data]) => `
                    <div class="stats-item">
                        <div class="stats-item-info">
                            <span>${stallId}号</span>
                            <span class="gender-badge ${data.gender === '男' ? 'male' : 'female'}">
                                ${data.gender}
                            </span>
                        </div>
                        <span class="stats-count">${data.count}次</span>
                    </div>
                `).join('') || '<div class="no-data">暂无数据</div>'}
        </div>
    `;
}

// 获取日期范围
function getDateRange(filter) {
    const today = new Date();
    const dates = [];
    
    switch (filter) {
        case 'today':
            dates.push(today.toISOString().split('T')[0]);
            break;
            
        case 'week':
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            break;
            
        case 'month':
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            break;
    }
    
    return dates;
}

// 在页面加载时添加关闭弹窗的点击事件
window.onclick = function(event) {
    const modal = document.getElementById('statsModal');
    if (event.target === modal) {
        closeStatsModal();
    }
}

// 确保所有函数都在全局作用域
window.showStatsModal = showStatsModal;
window.closeStatsModal = closeStatsModal;
window.updateStatsView = updateStatsView;

let selectedScore = 0;

// 显示评分对话框
function showRatingDialog() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('ratingDialog').style.display = 'block';
}

// 隐藏评分对话框
function hideRatingDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('ratingDialog').style.display = 'none';
    selectedScore = 0;
    updateStarDisplay();
}

// 更新星星显示
function updateStarDisplay() {
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach(star => {
        const score = parseInt(star.dataset.score);
        if (score <= selectedScore) {
            star.classList.add('active');
            star.style.color = '#ffa000';
        } else {
            star.classList.remove('active');
            star.style.color = '#ddd';
        }
    });
}

// 处理星星点击
function handleStarClick(score) {
    selectedScore = score;
    updateStarDisplay();
}

// 提交评分
function submitRating() {
    if (selectedScore === 0) {
        alert('请选择评分');
        return;
    }

    const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
    if (!currentToilet) {
        alert('数据错误');
        return;
    }

    // 获取所有厕所数据
    let toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    
    // 找到当前厕所并更新评分
    const toilet = toiletsData.find(t => t.name === currentToilet.name);
    if (toilet) {
        const newRating = (toilet.rating * toilet.ratingCount + selectedScore) / (toilet.ratingCount + 1);
        toilet.rating = newRating;
        toilet.ratingCount++;
        
        // 保存更新后的数据
        localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
        
        // 更新当前���所数据
        currentToilet.rating = newRating;
        currentToilet.ratingCount = toilet.ratingCount;
        localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
    }

    hideRatingDialog();
    alert('评分成功！');
}

// 初始化评分功能
document.addEventListener('DOMContentLoaded', () => {
    // 添加星星点击事件
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            handleStarClick(parseInt(star.dataset.score));
        });
    });
});