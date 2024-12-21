function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        name: params.get('name')
    };
}

function initPage() {
    const { name } = getUrlParams();
    document.getElementById('toiletName').textContent = decodeURIComponent(name);

    const statusList = ['男', '女', '空', '男', '空', '女', '空', '男', '女', '空'];
    
    const statusGrid = document.getElementById('statusGrid');
    statusGrid.innerHTML = statusList
        .map((status, index) => `
            <div class="grid-item ${status === '空' ? 'empty' : ''}" 
                 onclick="goToStallDetail(${index + 1}, '${status}')">${status}</div>
        `).join('');
}

function goBack() {
    window.history.back();
}

function goToStallDetail(stallId, status) {
    window.location.href = `stall-detail.html?stallId=${stallId}&status=${status}`;
}

// 页面加载时初始化
window.onload = initPage; 