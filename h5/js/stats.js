// 获取开锁统计数据
function getUnlockStats() {
    try {
        const stats = localStorage.getItem('unlockStats');
        return stats ? JSON.parse(stats) : {};
    } catch (e) {
        console.error('解析统计数据失败:', e);
        return {};
    }
}

// 保存开锁统计数据
function saveUnlockStats(stats) {
    try {
        localStorage.setItem('unlockStats', JSON.stringify(stats));
    } catch (e) {
        console.error('保存统计数据失败:', e);
    }
}

// 记录开锁事件
function recordUnlock(stallId, gender, toiletName) {
    // 调试日志：开始记录
    console.log('Recording unlock:', { stallId, gender, toiletName });
    // 检查现有数据
    const existingStats = getUnlockStats();
    console.log('Existing stats before update:', existingStats);
    
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const stats = getUnlockStats();
    
    if (!stats[dateKey]) {
        stats[dateKey] = {};
    }
    if (!stats[dateKey][toiletName]) {
        stats[dateKey][toiletName] = {};
    }
    if (!stats[dateKey][toiletName][stallId]) {
        stats[dateKey][toiletName][stallId] = {
            count: 0,
            gender: gender
        };
    }
    
    stats[dateKey][toiletName][stallId].count++;
    
    console.log('Stats after update:', stats);
    saveUnlockStats(stats);
    
    // 验证保存是否成功
    const savedStats = getUnlockStats();
    console.log('Verified saved stats:', savedStats);
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
                dates.unshift(date.toISOString().split('T')[0]);
            }
            break;
        case 'month':
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                dates.unshift(date.toISOString().split('T')[0]);
            }
            break;
    }
    return dates;
}

// 获取统计数据
function getStatsForRange(filter) {
    const stats = getUnlockStats();
    const dateRange = getDateRange(filter);
    const toiletStats = {};
    
    // 获取当前所有厕所数据，用于统计异常状态
    const toiletsData = JSON.parse(localStorage.getItem('toiletsData')) || [];
    
    for (const date of dateRange) {
        const dateStats = stats[date] || {};
        
        for (const [toiletName, toiletData] of Object.entries(dateStats)) {
            if (!toiletStats[toiletName]) {
                toiletStats[toiletName] = {
                    totalCount: 0,
                    male: 0,
                    female: 0,
                    stalls: {},
                    abnormal: {
                        fault: 0,    // 故障数
                        maintenance: 0, // 维修数
                        smoke: 0,    // 烟雾数
                        total: 0     // 异常总数
                    }
                };
            }
            
            for (const [stallId, stallData] of Object.entries(toiletData)) {
                console.log('Processing stall:', stallId, stallData);
                if (!toiletStats[toiletName].stalls[stallId]) {
                    toiletStats[toiletName].stalls[stallId] = {
                        count: 0,
                        gender: stallData.gender
                    };
                }
                
                toiletStats[toiletName].stalls[stallId].count += stallData.count;
                toiletStats[toiletName].totalCount += stallData.count;
                
                if (stallData.gender === '男') {
                    toiletStats[toiletName].male += stallData.count;
                } else {
                    toiletStats[toiletName].female += stallData.count;
                }
            }
        }
    }
    
    // 统计当前异常状态
    toiletsData.forEach(toilet => {
        if (toiletStats[toilet.name]) {
            toilet.stalls.forEach(stall => {
                if (['fault', 'maintenance', 'smoke'].includes(stall.state)) {
                    toiletStats[toilet.name].abnormal[stall.state]++;
                    toiletStats[toilet.name].abnormal.total++;
                }
            });
        }
    });
    
    console.log('Final toilet stats:', toiletStats);
    return toiletStats;
} 