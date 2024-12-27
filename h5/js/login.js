function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'home.html';
    } else if (username === 'user1' && password === 'user1') {
        localStorage.setItem('isAdmin', 'false');
        window.location.href = 'home.html';
    } else {
        alert('用户名或密码错误！');
    }
} 