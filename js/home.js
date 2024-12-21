let toilets = [
    { 
        id: 1, 
        name: '漕河泾公共厕所', 
        distance: 150,
        address: '宜山路1618号漕河泾开发区内'
    },
    { 
        id: 2, 
        name: '虹梅路公厕', 
        distance: 400,
        address: '虹梅路1801号近漕宝路'
    },
    { 
        id: 3, 
        name: '东兰路公厕', 
        distance: 650,
        address: '东兰路69号近虹梅路'
    },
    { 
        id: 4, 
        name: '虹漕路公厕', 
        distance: 800,
        address: '虹漕路461号近漕溪路'
    },
    { 
        id: 5, 
        name: '钦州路公厕', 
        distance: 1200,
        address: '钦州路788号近虹漕路'
    }
];

function initToiletList() {
    const toiletCount = document.querySelector('.toilet-count');
    toiletCount.textContent = `附近公厕数量：${toilets.length}`;

    const toiletList = document.getElementById('toiletList');
    toiletList.innerHTML = toilets
        .map(toilet => `
            <div class="toilet-item" onclick="goToDetail(${toilet.id}, '${toilet.name}')">
                <div class="toilet-name">${toilet.name}</div>
                <div class="toilet-info">
                    <div class="toilet-distance">距离: ${toilet.distance}米</div>
                    <div class="toilet-address">${toilet.address}</div>
                </div>
            </div>
        `).join('');
}

function goToDetail(id, name) {
    window.location.href = `detail.html?id=${id}&name=${encodeURIComponent(name)}`;
}

function switchTab(index) {
    const tabs = document.querySelectorAll('.tab');
    const pages = document.querySelectorAll('.page');
    
    // 更新tab状态
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[index].classList.add('active');
    
    // 更新页面显示
    pages.forEach(page => page.classList.remove('active'));
    if (index === 0) {
        document.getElementById('homePage').classList.add('active');
    } else if (index === 1) {
        document.getElementById('profilePage').classList.add('active');
        initProfile();
    }
}

function handleMenuClick(type) {
    // 处理菜单点击事件
    alert(`点击了${type}设置`);
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isAdmin');
        window.location.href = 'login.html';
    }
}

function initProfile() {
    // 获取用户名（从localStorage中获取）
    const username = localStorage.getItem('username') || 'user1';
    
    // 设置头像圆圈中的文字（用户名第一个字符）
    const avatarCircle = document.getElementById('avatarCircle');
    avatarCircle.textContent = username.charAt(0).toUpperCase();
    
    // 设置用户名文本
    const usernameText = document.getElementById('usernameText');
    usernameText.textContent = username;
}

// 页面加载时初始化
window.onload = function() {
    initToiletList();
    initProfile();
}; 