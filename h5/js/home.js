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
            { status: '空', gender: '女', state: 'empty' },      // 1号
            { status: '占用', gender: '女', state: 'occupied' }, // 2号
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
            { status: '占用', gender: '男', state: 'occupied' }, // 3号
            { status: '维修', gender: '男', state: 'maintenance' }, // 4号
            { status: '空', gender: '女', state: 'empty' },      // 5号
            { status: '占用', gender: '女', state: 'occupied' }, // 6号
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
            { status: '占用', gender: '女', state: 'occupied' }, // 4号
            { status: '空', gender: '男', state: 'empty' },      // 5号
            { status: '占用', gender: '男', state: 'occupied' }, // 6号
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
            { status: '占用', gender: '女', state: 'occupied' }, // 4号
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
            { status: '占用', gender: '男', state: 'occupied' }, // 3号
            { status: '空', gender: '男', state: 'empty' },      // 4号
            { status: '空', gender: '女', state: 'empty' },      // 5号
            { status: '空', gender: '女', state: 'empty' },      // 6号
            { status: '占用', gender: '女', state: 'occupied' }, // 7号
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
    const savedData = localStorage.getItem('toiletsData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // 保存默认数据
    saveToiletData(toilets);
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
        // 跳转到详情页
        window.location.href = `detail.html?name=${encodeURIComponent(name)}`;
    } else {
        showToast('未找到厕所数据', 'error');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 如果 localStorage 中没有数据，初始化默认数据
    if (!localStorage.getItem('toiletsData')) {
        saveToiletData(toilets);
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
    if (confirm('确认退出登录？')) {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        // 跳转到登录页
        window.location.href = 'login.html';
    }
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