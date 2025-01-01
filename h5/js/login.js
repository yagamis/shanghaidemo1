function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('currentUser', username);
        window.location.href = 'home.html';
    } else if (username === 'user' && password === 'user') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('currentUser', username);
        window.location.href = 'home.html';
    } else {
        showToast('用户名或密码错误', 'error');
    }
} 