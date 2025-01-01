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
    // 保存统计数据
    const unlockStats = localStorage.getItem('unlockStats');

    const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
    if (!currentToilet) return;

    const params = new URLSearchParams();
    params.set('stallId', stallId);
    params.set('toilet', currentToilet.name);
    params.set('id', stallId);

    // 恢复统计数据
    if (unlockStats) {
        localStorage.setItem('unlockStats', unlockStats);
    }

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

// 预约超时时间（毫秒）
const RESERVATION_TIMEOUT = 10000;

// 处理开锁
function handleUnlock(event, stallId, gender) {
    event.stopPropagation();
    
    const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
    const stall = currentToilet.stalls[stallId - 1];
    const currentUser = localStorage.getItem('currentUser');
    
    // 检查是否是预约状态
    if (stall.state === 'reserved') {
        // 如果不是预约人，不能开锁
        if (stall.reservedBy !== currentUser) {
            showToast('该厕位已被他人预约', 'error');
            return;
        }
    }

    showConfirm(`确认要开启${stallId}号${gender}厕所吗？`, () => {
        // 显示加载动画
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.display = 'flex';
        }
        
        setTimeout(() => {
            // 隐藏加载动画
            if (loading) {
                loading.style.display = 'none';
            }
            
            // 获取当前公厕数据并更新状态
            const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
            if (currentToilet && currentToilet.stalls[stallId - 1]) {
                // 更新厕位状态
                currentToilet.stalls[stallId - 1].status = '占用';
                currentToilet.stalls[stallId - 1].state = 'occupied';
                currentToilet.stalls[stallId - 1].unlockTime = Date.now();
                
                // 记录开锁事件，确保传递厕所名称
                console.log('Recording unlock for toilet:', currentToilet.name); // 调试日志
                recordUnlock(stallId, gender, currentToilet.name);
                
                // 保存更新后的数据
                localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
                
                // 同步更新 toiletsData
                const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
                const toiletIndex = toiletsData.findIndex(t => t.name === currentToilet.name);
                if (toiletIndex !== -1) {
                    toiletsData[toiletIndex] = currentToilet;
                    localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
                    
                    // 触发状态更新事件
                    window.dispatchEvent(new CustomEvent('stallStatusUpdate', {
                        detail: {
                            toilet: currentToilet.name,
                            id: stallId,
                            state: 'occupied',
                            status: '占用'
                        }
                    }));
                }

                // 更新UI显示
                const gridItem = event.target.closest('.grid-item');
                if (gridItem) {
                    gridItem.className = 'grid-item occupied';
                    gridItem.querySelector('.status-text').innerHTML = `
                        ${getStatusIcon('occupied')}
                        占用
                    `;
                    // 移除开锁按钮
                    const unlockBtn = gridItem.querySelector('.unlock-btn');
                    if (unlockBtn) {
                        unlockBtn.remove();
                    }
                }

                showToast(`${stallId}号厕位开锁成功！请在5分钟内进入`, 'success');
            }
        }, 1500);
    }, () => {
        // 如果用户取消，什么也不做
    });
}

// 处理预约
function handleReserve(event, stallId, gender) {
    event.stopPropagation();
    
    const currentUser = localStorage.getItem('currentUser');
    const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
    const stall = currentToilet.stalls[stallId - 1];
    
    // 检查厕位状态
    if (stall.state !== 'empty') {
        showToast('该厕位不可预约', 'error');
        return;
    }
    
    // 检查用户是否已有预约
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
    const hasReservation = toiletsData.some(toilet => 
        toilet.stalls.some(stall => 
            stall.reservedBy === currentUser && 
            stall.state === 'reserved'  // 只检查状态为 reserved 的厕位
        )
    );
    
    if (hasReservation) {
        showToast('您已有预约的厕位，请先取消当前预约', 'error');
        return;
    }
    
    showConfirm(`确认预约${stallId}号${gender}厕所吗？`, () => {
        // 更新厕位状态
        stall.state = 'reserved';
        stall.status = '已预约';
        stall.reservedBy = currentUser;
        stall.reservationTime = Date.now();
        
        // 保存更新
        localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
        
        // 同步更新 toiletsData
        const toiletIndex = toiletsData.findIndex(t => t.name === currentToilet.name);
        if (toiletIndex !== -1) {
            toiletsData[toiletIndex] = currentToilet;
            localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
        }
        
        // 设置预约超时
        setTimeout(() => {
            if (stall.state === 'reserved') {
                // 重新获取最新数据
                const updatedToiletsData = JSON.parse(localStorage.getItem('toiletsData'));
                const updatedToilet = updatedToiletsData[toiletIndex];
                const updatedStall = updatedToilet.stalls[stallId - 1];
                
                // 只有当厕位仍然是被同一用户预约的状态时才重置
                if (updatedStall.state === 'reserved' && updatedStall.reservedBy === currentUser) {
                    // 更新当前厕位状态
                    updatedStall.state = 'empty';
                    updatedStall.status = '空';
                    updatedStall.reservedBy = null;
                    
                    // 清除所有厕位中该用户的预约状态
                    updatedToiletsData.forEach(toilet => {
                        toilet.stalls.forEach(s => {
                            if (s.reservedBy === currentUser) {
                                s.state = 'empty';
                                s.status = '空';
                                s.reservedBy = null;
                            }
                        });
                    });
                    
                    // 保存更新后的数据
                    localStorage.setItem('toiletsData', JSON.stringify(updatedToiletsData));
                    localStorage.setItem('currentToilet', JSON.stringify(updatedToilet));
                    
                    // 刷新页面
                    initPage();
                    
                    showToast('预约已超时，厕位已释放', 'warning');
                }
            }
        }, RESERVATION_TIMEOUT);
        
        showToast('预约成功！请在10秒内完成开锁', 'success');
        
        // 刷新页面显示
        initPage();
    });
}

// 初始化页面
function initPage() {
    try {
        // 检查登录状态
        if (!localStorage.getItem('isLoggedIn')) {
            showToast('请先登录', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return;
        }

        // 检查并处理超时的预约
        checkExpiredReservations();

        const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
        if (!currentToilet) {
            console.error('未找到公厕数据');
            return;
        }

        const statusGrid = document.getElementById('statusGrid');
        statusGrid.innerHTML = currentToilet.stalls.map((stall, index) => {
            const currentUser = localStorage.getItem('currentUser');
            const isReservedByMe = stall.reservedBy === currentUser;
            
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
                            <div class="button-group">
                                <button class="unlock-btn" 
                                        onclick="handleUnlock(event, ${index + 1}, '${stall.gender}')">
                                    开锁
                                </button>
                                <button class="reserve-btn"
                                        onclick="handleReserve(event, ${index + 1}, '${stall.gender}')">
                                    预约
                                </button>
                            </div>
                        ` : stall.state === 'reserved' && isReservedByMe ? `
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

// 检查并处理超时的预约
function checkExpiredReservations() {
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData'));
    let hasChanges = false;

    toiletsData.forEach(toilet => {
        toilet.stalls.forEach((stall, index) => {
            if (stall.state === 'reserved' && stall.reservationTime) {
                const now = Date.now();
                const reservationTime = parseInt(stall.reservationTime);
                
                // 如果预约已超过10秒
                if (now - reservationTime > RESERVATION_TIMEOUT) {
                    // 记录超时的预约到历史记录
                    const reservationHistory = JSON.parse(localStorage.getItem('reservationHistory') || '[]');
                    reservationHistory.push({
                        toiletName: toilet.name,
                        stallId: index + 1,
                        gender: stall.gender,
                        time: stall.reservationTime,
                        status: 'expired',
                        user: stall.reservedBy,
                        expireTime: now
                    });
                    localStorage.setItem('reservationHistory', JSON.stringify(reservationHistory));

                    stall.state = 'empty';
                    stall.status = '空';
                    stall.reservedBy = null;
                    delete stall.reservationTime;
                    hasChanges = true;
                }
            }
        });
    });

    if (hasChanges) {
        // 保存更新后的数据
        localStorage.setItem('toiletsData', JSON.stringify(toiletsData));
        
        // 更新当前厕所数据
        const currentToilet = JSON.parse(localStorage.getItem('currentToilet'));
        if (currentToilet) {
            const updatedToilet = toiletsData.find(t => t.name === currentToilet.name);
            if (updatedToilet) {
                localStorage.setItem('currentToilet', JSON.stringify(updatedToilet));
            }
        }
        
        // 刷新预约列表显示
        try {
            updateReservationList();
        } catch (error) {
            console.log('Not in reservation page');
        }

        // 刷新当前页面
        initPage();
    }
}

// 确保所有函数都在全局作用域
window.goBack = goBack;
window.goToStallDetail = goToStallDetail;
window.handleUnlock = handleUnlock;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    
    // 每秒检查一次预约状态
    const checkInterval = setInterval(checkExpiredReservations, 1000);

    // 在页面卸载时清除定时器
    window.addEventListener('unload', () => {
        clearInterval(checkInterval);
    });
});

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

// 获取统计数据
function getUnlockStats() {
    return JSON.parse(localStorage.getItem('unlockStats') || '{}');
}

// 保存统计数据
function saveUnlockStats(stats) {
    localStorage.setItem('unlockStats', JSON.stringify(stats));
}

// 在页面加载时添加关闭弹窗的点击事件
window.onclick = function(event) {
    const modal = document.getElementById('statsModal');
    if (event.target === modal) {
        closeStatsModal();
    }
}



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
        
        // 更新当前厕所数据
        currentToilet.rating = newRating;
        currentToilet.ratingCount = toilet.ratingCount;
        localStorage.setItem('currentToilet', JSON.stringify(currentToilet));
    }

    hideRatingDialog();
    showToast('评分成功！', 'success');
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