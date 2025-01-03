// 公厕数据
const toilets = [
    {
        id: 1,
        name: '西湖公园公厕',
        address: '杭州市西湖区西湖公园内',
        distance: '100m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            // 女厕位（15个）
            ...Array(15).fill().map((_, i) => ({ 
                status: '空', 
                gender: '女', 
                state: 'empty', 
                reservedBy: null 
            })),
            // 男厕位（10个）
            ...Array(10).fill().map((_, i) => ({ 
                status: '空', 
                gender: '男', 
                state: 'empty', 
                reservedBy: null 
            }))
        ]
    },
    {
        id: 2,
        name: '断桥公厕',
        address: '杭州市西湖区断桥景区附近',
        distance: '300m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            // 女厕位（12个）
            ...Array(12).fill().map((_, i) => ({ 
                status: '空', 
                gender: '女', 
                state: 'empty', 
                reservedBy: null 
            })),
            // 男厕位（8个）
            ...Array(8).fill().map((_, i) => ({ 
                status: '空', 
                gender: '男', 
                state: 'empty', 
                reservedBy: null 
            }))
        ]
    },
    {
        id: 3,
        name: '雷峰塔公厕',
        address: '杭州市西湖区雷峰塔景区内',
        distance: '500m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            // 女厕位（10个）
            ...Array(10).fill().map((_, i) => ({ 
                status: '空', 
                gender: '女', 
                state: 'empty', 
                reservedBy: null 
            })),
            // 男厕位（6个）
            ...Array(6).fill().map((_, i) => ({ 
                status: '空', 
                gender: '男', 
                state: 'empty', 
                reservedBy: null 
            }))
        ]
    },
    {
        id: 4,
        name: '苏堤公厕',
        address: '杭州市西湖区苏堤春晓景点附近',
        distance: '800m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            // 女厕位（8个）
            ...Array(8).fill().map((_, i) => ({ 
                status: '空', 
                gender: '女', 
                state: 'empty', 
                reservedBy: null 
            })),
            // 男厕位（5个）
            ...Array(5).fill().map((_, i) => ({ 
                status: '空', 
                gender: '男', 
                state: 'empty', 
                reservedBy: null 
            }))
        ]
    }
];

// 计算厕位统计信息
function calculateStats(stalls) {
    return stalls.reduce((acc, stall) => {
        if (stall.gender === '男') {
            acc.male.total++;
            if (stall.state === 'empty') acc.male.empty++;
        } else {
            acc.female.total++;
            if (stall.state === 'empty') acc.female.empty++;
        }
        return acc;
    }, {
        male: { total: 0, empty: 0 },
        female: { total: 0, empty: 0 }
    });
}

// 获取公厕数据
function getToiletData() {
    // 优先从 localStorage 获取数据
    const savedData = localStorage.getItem('toiletsData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    // 如果没有保存的数据，返回默认数据
    return toilets;
}

// 保存公厕数据
function saveToiletData(data) {
    localStorage.setItem('toiletsData', JSON.stringify(data));
}

// 初始化页面
function initPage() {
    const toiletList = document.getElementById('toiletList');
    // 如果找不到元素，直接返回
    if (!toiletList) {
        console.warn('toiletList element not found');
        return;
    }

    // 获取厕所数据
    let toiletsData = localStorage.getItem('toiletsData');
    if (!toiletsData) {
        // 如果没有数据，初始化默认数据
        toiletsData = DEFAULT_TOILETS;
        localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
    } else {
        toiletsData = JSON.parse(toiletsData);
    }

    // 确保所有厕所数据都有 isTemporary 属性
    toiletsData = toiletsData.map(toilet => ({
        ...toilet,
        isTemporary: toilet.isTemporary || false
    }));

    // 渲染厕所列表
    renderToiletList(toiletsData);
}

// 跳转到详情页
function goToDetail(name) {
    // 从 localStorage 获取数据而不是使用全局变量
    const toiletsData = getToiletData();
    const toilet = toiletsData.find(t => t.name === decodeURIComponent(name));
    
    if (toilet) {
        // 将当前选中的公厕数据存储到 localStorage
        localStorage.setItem('currentToilet', JSON.stringify(toilet));
        // 同时更新 toiletsData，确保数据一致性
        if (!localStorage.getItem('toiletsData')) {
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
        }
        
        // 跳转到详情页
        window.location.href = `detail.html?name=${encodeURIComponent(name)}`;
    } else {
        showToast('未找到厕所数据', 'error');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化用户信息显示
    updateUserProfile();
    
    // 如果 localStorage 中没有数据，初始化默认数据
    if (!localStorage.getItem('toiletsData')) {
        localStorage.setItem('toiletsData', JSON.stringify(toilets));
    }
    
    // 初始化页面
    initPage();

    // 检查并恢复上次的 tab 状态
    const lastTab = localStorage.getItem('currentTab');
    if (lastTab) {
        switchTab(lastTab);
    }
});

// 更新用户信息显示
function updateUserProfile() {
    const username = localStorage.getItem('currentUser');
    const profileUsername = document.getElementById('profileUsername');
    if (profileUsername && username) {
        profileUsername.textContent = username;
    }
    
    // 更新积分显示
    const points = localStorage.getItem('userPoints') || '0';
    const pointsElement = document.getElementById('userPoints');
    if (pointsElement) {
        pointsElement.textContent = points;
    }
}

// 退出登录
function logout() {
    showConfirm('确认退出登录？', () => {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('currentUser');
        // 跳转到登录页
        window.location.href = 'login.html';
    });
}

// 确保函数在全局可用
window.logout = logout;

// 添加评分功能
function rateToilet(toiletName, score) {
    const toiletsData = getToiletData();
    const toilet = toiletsData.find(t => t.name === toiletName);
    
    if (toilet) {
        // 更新评分
        const newRating = (toilet.rating * toilet.ratingCount + score) / (toilet.ratingCount + 1);
        toilet.rating = newRating;
        toilet.ratingCount++;
        
        // 保存更新
        saveToiletData(toiletsData);
        
        // 刷新页面
        initPage();
    }
}

// 添加状态更新监听器
window.addEventListener('stallStatusUpdate', (event) => {
    // 状态更新时刷新页面
    initPage();
});

// 预约超时时间（毫秒）与 detail.js 保持一致
const RESERVATION_TIMEOUT = 10000;

// 显示预约记录页面
function showReservations() {
    document.getElementById('settingsPage').classList.remove('active');
    document.getElementById('reservationsPage').classList.add('active');
    updateReservationList();

    // 启动定时刷新
    startReservationRefresh();
}

// 隐藏预约记录页面
function hideReservations() {
    document.getElementById('reservationsPage').classList.remove('active');
    document.getElementById('settingsPage').classList.add('active');

    // 停止定时刷新
    stopReservationRefresh();
}

// 定时器ID
let reservationRefreshTimer = null;

// 启动定时刷新
function startReservationRefresh() {
    // 清除可能存在的旧定时器
    if (reservationRefreshTimer) {
        clearInterval(reservationRefreshTimer);
    }

    // 设置新的定时器，每秒刷新一次
    reservationRefreshTimer = setInterval(() => {
        if (document.getElementById('reservationsPage').classList.contains('active')) {
            updateReservationList();
        } else {
            // 如果页面不再显示，停止定时器
            stopReservationRefresh();
        }
    }, 1000);
}

// 停止定时刷新
function stopReservationRefresh() {
    if (reservationRefreshTimer) {
        clearInterval(reservationRefreshTimer);
        reservationRefreshTimer = null;
    }
}

// 页面卸载时清理定时器
window.addEventListener('unload', () => {
    stopReservationRefresh();
});

// 获取预约记录
function getReservationHistory() {
    const currentUser = localStorage.getItem('currentUser');
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    const reservationHistory = JSON.parse(localStorage.getItem('reservationHistory') || '[]');
    
    // 获取当前有效预约
    const activeReservations = toiletsData.reduce((acc, toilet) => {
        toilet.stalls.forEach((stall, index) => {
            if (stall.reservedBy === currentUser) {
                const now = Date.now();
                const reservationTime = parseInt(stall.reservationTime);
                // 检查是否已超时
                if (now - reservationTime > RESERVATION_TIMEOUT) {
                    // 记录超时的预约
                    const reservationHistory = JSON.parse(localStorage.getItem('reservationHistory') || '[]');
                    reservationHistory.push({
                        toiletName: toilet.name,
                        stallId: index + 1,
                        gender: stall.gender,
                        time: stall.reservationTime,
                        status: 'expired',
                        user: currentUser,
                        expireTime: now
                    });
                    localStorage.setItem('reservationHistory', JSON.stringify(reservationHistory));
                    
                    // 重置厕位状态
                    stall.state = 'empty';
                    stall.status = '空';
                    stall.reservedBy = null;
                    delete stall.reservationTime;
                    
                    // 保存更新后的数据
                    localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
                } else {
                    acc.push({
                        toiletName: toilet.name,
                        stallId: index + 1,
                        gender: stall.gender,
                        time: stall.reservationTime,
                        status: 'active',
                        user: currentUser
                    });
                }
            }
        });
        return acc;
    }, []);
    
    // 合并并排序所有预约记录
    return [...activeReservations, ...reservationHistory]
        .filter(r => r.user === currentUser && r.time)
        .sort((a, b) => b.time - a.time);
}

// 更新预约列表显示
function updateReservationList() {
    const reservationList = document.getElementById('reservationList');
    if (!reservationList) return;
    
    const reservations = getReservationHistory();
    
    if (reservations.length === 0) {
        reservationList.innerHTML = '<div class="no-data">暂无预约记录</div>';
        return;
    }
    
    reservationList.innerHTML = reservations.map(reservation => `
        <div class="reservation-item">
            <div class="toilet-name">${reservation.toiletName}</div>
            <div class="stall-info">
                <span class="stall-number">${reservation.stallId}号${reservation.gender}厕</span>
                <span class="status-badge ${reservation.status}">
                    ${getStatusText(reservation.status)}
                </span>
            </div>
            <div class="time">预约时间：${new Date(reservation.time).toLocaleString()}</div>
            ${reservation.status === 'expired' ? `
                <div class="time">超时时间：${new Date(reservation.expireTime).toLocaleString()}</div>
            ` : ''}
            ${reservation.status === 'cancelled' ? `
                <div class="time">取消时间：${new Date(reservation.cancelTime).toLocaleString()}</div>
            ` : ''}
            ${reservation.status === 'active' ? `
                <button class="cancel-btn" onclick="cancelReservation('${reservation.toiletName}', ${reservation.stallId})">
                    取消预约
                </button>
            ` : ''}
        </div>
    `).join('');
}

// 取消预约
function cancelReservation(toiletName, stallId) {
    showConfirm('确认取消预约？', () => {
        const toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
        const toilet = toiletsData.find(t => t.name === toiletName);
        
        if (toilet && toilet.stalls[stallId - 1]) {
            const stall = toilet.stalls[stallId - 1];
            const currentUser = localStorage.getItem('currentUser');
            
            if (stall.reservedBy === currentUser) {
                // 记录取消的预约
                const reservationHistory = JSON.parse(localStorage.getItem('reservationHistory') || '[]');
                reservationHistory.push({
                    toiletName,
                    stallId,
                    gender: stall.gender,
                    time: stall.reservationTime,
                    status: 'cancelled',
                    user: currentUser,
                    cancelTime: Date.now()
                });
                localStorage.setItem('reservationHistory', JSON.stringify(reservationHistory));
                
                // 重置厕位状态
                stall.state = 'empty';
                stall.status = '空';
                stall.reservedBy = null;
                delete stall.reservationTime;
                
                localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
                
                // 更新显示
                updateReservationList();
                showToast('预约已取消', 'success');
            }
        }
    });
}

// 确保函数在全局作用域可用
window.showReservations = showReservations;
window.hideReservations = hideReservations;
window.cancelReservation = cancelReservation;

// 获取预约状态文本
function getStatusText(status) {
    switch (status) {
        case 'active': return '预约中';
        case 'expired': return '已超时';
        case 'cancelled': return '已取消';
        default: return status;
    }
}

// 切换标签页
function switchTab(tabName) {
    // 保存当前标签页
    localStorage.setItem('currentTab', tabName);
    
    // 隐藏所有页面
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.remove('active');
    });
    
    // 取消所有标签页的激活状态
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的页面
    document.getElementById(tabName + 'Page').classList.add('active');
    
    // 激活对应的标签
    document.querySelector(`.tab-item[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // 如果切换到"我的"标签页，更新用户信息
    if (tabName === 'settings') {
        updateUserProfile();
    }
    
    // 如果切换到"统计"标签页，初始化统计页面
    if (tabName === 'stats') {
        initStatsPage();
    }
}

function renderToiletList(toilets) {
    const toiletList = document.querySelector('.toilet-list');
    toiletList.innerHTML = toilets.map(toilet => `
        <div class="toilet-item" 
             data-toilet-id="${toilet.id}" 
             data-temporary="${toilet.isTemporary}"
             onclick="goToDetail('${encodeURIComponent(toilet.name)}')">
            <div class="toilet-info">
                <h3>
                    ${toilet.name}
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${toilet.rating.toFixed(1)}
                    </span>
                    <span class="rating-count">(${toilet.ratingCount})</span>
                </h3>
                <p><i class="fas fa-map-marker-alt"></i>${toilet.address}</p>
                <p class="distance"><i class="fas fa-walking"></i>${toilet.distance}</p>
                <div class="stall-stats">
                    <span class="male-stats">
                        <i class="fas fa-male"></i>
                        ${toilet.stalls.filter(s => s.gender === '男').length}个
                    </span>
                    <span class="female-stats">
                        <i class="fas fa-female"></i>
                        ${toilet.stalls.filter(s => s.gender === '女').length}个
                    </span>
                </div>
            </div>
            ${toilet.isTemporary ? `
                <div class="temporary-tag">
                    <i class="fas fa-clock"></i>
                    临时厕所
                </div>
            ` : ''}
        </div>
    `).join('');
}