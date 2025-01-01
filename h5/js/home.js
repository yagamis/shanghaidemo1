// 公厕数据
const toilets = [
    {
        id: 1,
        name: '西湖公园公厕',
        address: '杭州市西湖区西湖公园内',
        distance: '50m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            { status: '空', gender: '女', state: 'empty', reservedBy: null },      // 1号
            { status: '空', gender: '女', state: 'empty' },      // 2号
            { status: '空', gender: '男', state: 'empty' },      // 3号
            { status: '故障', gender: '男', state: 'fault' },    // 4号
            { status: '空', gender: '女', state: 'empty' },      // 5号
            { status: '维修', gender: '男', state: 'maintenance' }, // 6号
            { status: '空', gender: '女', state: 'empty' },      // 7号
            { status: '空', gender: '男', state: 'empty' },      // 8号
            { status: '空', gender: '女', state: 'empty' },      // 9号
            { status: '空', gender: '男', state: 'empty' },      // 10号
            { status: '空', gender: '女', state: 'empty' },      // 11号
            { status: '空', gender: '男', state: 'empty' },      // 12号
            { status: '空', gender: '女', state: 'empty' },      // 13号
            { status: '空', gender: '男', state: 'empty' }       // 14号
        ]
    },
    {
        id: 2,
        name: '湖滨银泰公厕',
        address: '杭州市上城区湖滨路与平海路交叉口',
        distance: '120m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            { status: '空', gender: '男', state: 'empty' },      // 1号
            { status: '空', gender: '男', state: 'empty' },      // 2号
            { status: '空', gender: '男', state: 'empty' },      // 3号
            { status: '维修', gender: '男', state: 'maintenance' }, // 4号
            { status: '空', gender: '女', state: 'empty' },      // 5号
            { status: '空', gender: '女', state: 'empty' },      // 6号
            { status: '空', gender: '女', state: 'empty' },      // 7号
            { status: '空', gender: '男', state: 'empty' },      // 8号
            { status: '空', gender: '女', state: 'empty' },      // 9号
            { status: '空', gender: '男', state: 'empty' },      // 10号
            { status: '空', gender: '女', state: 'empty' },      // 11号
            { status: '空', gender: '男', state: 'empty' }       // 12号
        ]
    },
    {
        id: 3,
        name: '黄龙体育中心公厕',
        address: '杭州市西湖区黄龙路1号',
        distance: '300m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            { status: '空', gender: '女', state: 'empty' },      // 1号
            { status: '空', gender: '女', state: 'empty' },      // 2号
            { status: '烟雾', gender: '女', state: 'smoke' },    // 3号
            { status: '空', gender: '女', state: 'empty' },      // 4号
            { status: '空', gender: '男', state: 'empty' },      // 5号
            { status: '空', gender: '男', state: 'empty' },      // 6号
            { status: '维修', gender: '男', state: 'maintenance' }, // 7号
            { status: '空', gender: '男', state: 'empty' },      // 8号
            { status: '空', gender: '男', state: 'empty' },      // 9号
            { status: '空', gender: '男', state: 'empty' },      // 10号
            { status: '空', gender: '女', state: 'empty' },      // 11号
            { status: '空', gender: '男', state: 'empty' },      // 12号
            { status: '空', gender: '女', state: 'empty' },      // 13号
            { status: '空', gender: '男', state: 'empty' },      // 14号
            { status: '空', gender: '女', state: 'empty' },      // 15号
            { status: '空', gender: '男', state: 'empty' }       // 16号
        ]
    },
    {
        id: 4,
        name: '武林广场公厕',
        address: '杭州市下城区武林广场',
        distance: '500m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            { status: '空', gender: '女', state: 'empty' },      // 1号
            { status: '空', gender: '女', state: 'empty' },      // 2号
            { status: '空', gender: '女', state: 'empty' },      // 3号
            { status: '空', gender: '女', state: 'empty' },      // 4号
            { status: '故障', gender: '女', state: 'fault' },    // 5号
            { status: '空', gender: '男', state: 'empty' },      // 6号
            { status: '空', gender: '男', state: 'empty' },      // 7号
            { status: '维修', gender: '男', state: 'maintenance' }, // 8号
            { status: '空', gender: '女', state: 'empty' },      // 9号
            { status: '空', gender: '男', state: 'empty' },      // 10号
            { status: '空', gender: '女', state: 'empty' },      // 11号
            { status: '空', gender: '男', state: 'empty' },      // 12号
            { status: '空', gender: '女', state: 'empty' },      // 13号
            { status: '空', gender: '男', state: 'empty' }       // 14号
        ]
    },
    {
        id: 5,
        name: '运河公园公厕',
        address: '杭州市拱墅区运河公园内',
        distance: '800m',
        status: '正常',
        rating: 0,
        ratingCount: 0,
        stalls: [
            { status: '空', gender: '男', state: 'empty' },      // 1号
            { status: '空', gender: '男', state: 'empty' },      // 2号
            { status: '空', gender: '男', state: 'empty' },      // 3号
            { status: '空', gender: '男', state: 'empty' },      // 4号
            { status: '空', gender: '女', state: 'empty' },      // 5号
            { status: '空', gender: '女', state: 'empty' },      // 6号
            { status: '空', gender: '女', state: 'empty' },      // 7号
            { status: '烟雾', gender: '女', state: 'smoke' },    // 8号
            { status: '维修', gender: '女', state: 'maintenance' }, // 9号
            { status: '空', gender: '女', state: 'empty' },      // 10号
            { status: '空', gender: '男', state: 'empty' },      // 11号
            { status: '空', gender: '女', state: 'empty' },      // 12号
            { status: '空', gender: '男', state: 'empty' },      // 13号
            { status: '空', gender: '女', state: 'empty' },      // 14号
            { status: '空', gender: '男', state: 'empty' },      // 15号
            { status: '空', gender: '女', state: 'empty' }       // 16号
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

    const toiletsData = getToiletData();
    
    toiletList.innerHTML = toiletsData.map(toilet => {
        const stats = calculateStats(toilet.stalls);
        const ratingDisplay = toilet.ratingCount > 0 
            ? `${toilet.rating.toFixed(1)} <span class="rating-count">(${toilet.ratingCount})</span>`
            : '暂无评分';

        return `
            <div class="toilet-item" onclick="goToDetail('${encodeURIComponent(toilet.name)}')">
                <div class="toilet-info">
                    <h3>
                        <i class="fas fa-toilet"></i>
                        ${toilet.name}
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            ${ratingDisplay}
                        </span>
                    </h3>
                    <p class="address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${toilet.address}
                    </p>
                    <p class="distance">
                        <i class="fas fa-walking"></i>
                        ${toilet.distance}
                    </p>
                    <div class="stall-stats">
                        <span class="male-stats">
                            <i class="fas fa-male"></i>
                            空位 ${stats.male.empty}/${stats.male.total}
                        </span>
                        <span class="female-stats">
                            <i class="fas fa-female"></i>
                            空位 ${stats.female.empty}/${stats.female.total}
                        </span>
                    </div>
                </div>
                <div class="toilet-status ${toilet.status === '正常' ? 'normal' : 'warning'}">
                    <i class="fas ${toilet.status === '正常' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    ${toilet.status}
                </div>
            </div>
        `;
    }).join('');
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

// 退出登录
function logout() {
    showConfirm('确认退出登录？', () => {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
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