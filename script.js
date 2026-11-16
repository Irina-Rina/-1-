document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('modal');
    var btnLogin = document.getElementById('btn-login');
    var btnRegister = document.getElementById('btn-register');
    var modalClose = document.getElementById('modal-close');
    var tabRegister = document.getElementById('tab-register');
    var tabLogin = document.getElementById('tab-login');
    var formRegister = document.getElementById('form-register');
    var formLogin = document.getElementById('form-login');

    function switchTab(type) {
        if (!tabRegister || !tabLogin || !formRegister || !formLogin) return;
        var reg = type === 'register';
        tabRegister.classList.toggle('active', reg);
        tabLogin.classList.toggle('active', !reg);
        formRegister.classList.toggle('active', reg);
        formLogin.classList.toggle('active', !reg);
    }
    
    function openModal(tab) {
        if (modal) modal.classList.add('active');
        switchTab(tab);
    }
    
    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (btnRegister) btnRegister.onclick = function (e) { e.preventDefault(); openModal('register'); };
    if (btnLogin) btnLogin.onclick = function (e) { e.preventDefault(); openModal('login'); };
    if (modalClose) modalClose.onclick = closeModal;
    if (modal) modal.onclick = function (e) { if (e.target === modal) closeModal(); };
    if (tabRegister) tabRegister.onclick = function () { switchTab('register'); };
    if (tabLogin) tabLogin.onclick = function () { switchTab('login'); };

    function isLoggedIn() {
        return !!localStorage.getItem('currentUserName');
    }

    var modalAddReview = document.getElementById('modal-add-review');
    var modalAddClose = document.getElementById('modal-add-close');
    var formAddReview = document.getElementById('form-add-review');

    function closeAddModal() {
        if (modalAddReview) modalAddReview.classList.remove('active');
    }

    var btnAddReview = document.getElementById('btn-add-review');
    if (btnAddReview) btnAddReview.onclick = function (e) {
        e.preventDefault();
        if (!isLoggedIn()) { openModal('login'); return; }
        if (modalAddReview) modalAddReview.classList.add('active');
    };

    if (modalAddClose) modalAddClose.onclick = closeAddModal;
    if (modalAddReview) modalAddReview.onclick = function (e) {
        if (e.target === modalAddReview) closeAddModal();
    };

    function bindDeleteButtons() {
        var delBtns = document.querySelectorAll('.btn-delete-card');
        for (var i = 0; i < delBtns.length; i++) {
            delBtns[i].onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoggedIn()) { openModal('login'); return; }
                var card = this.closest('.movie-card');
                if (card && confirm('Удалить этот обзор?')) {
                    card.remove();
                }
            };
        }
    }
    bindDeleteButtons();

    if (formAddReview) formAddReview.onsubmit = function (e) {
        e.preventDefault();
        var titleEl = document.getElementById('review-title');
        var dateEl = document.getElementById('review-date');
        var posterEl = document.getElementById('review-poster');
        var ok = true;

        if (!titleEl.value.trim()) { titleEl.classList.add('invalid'); document.getElementById('error-review-title').textContent = 'Введите название'; ok = false; }
        else { titleEl.classList.remove('invalid'); document.getElementById('error-review-title').textContent = ''; }

        if (!dateEl.value.trim()) { dateEl.classList.add('invalid'); document.getElementById('error-review-date').textContent = 'Введите дату'; ok = false; }
        else { dateEl.classList.remove('invalid'); document.getElementById('error-review-date').textContent = ''; }

        var p = parseInt(posterEl.value, 10);
        if (!p || p < 1 || p > 10) { posterEl.classList.add('invalid'); document.getElementById('error-review-poster').textContent = 'Число от 1 до 10'; ok = false; }
        else { posterEl.classList.remove('invalid'); document.getElementById('error-review-poster').textContent = ''; }

        if (!ok) return;

        var grid = document.querySelector('.movies-grid');
        var card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML =
            '<button class="btn-delete-card" type="button" title="Удалить">&times;</button>' +
            '<div class="poster poster-' + p + '"></div>' +
            '<div class="card-info">' +
                '<h3 class="movie-title">' + titleEl.value.trim() + '</h3>' +
                '<p class="movie-date">Добавлено ' + dateEl.value.trim() + '</p>' +
                '<button class="btn-details" type="button">Подробнее</button>' +
            '</div>';
        card.querySelector('.btn-details').onclick = function () {
            if (!isLoggedIn()) { openModal('login'); return; }
            alert('Подробнее: ' + titleEl.value.trim());
        };
        if (grid) grid.appendChild(card);

        bindDeleteButtons();
        formAddReview.reset();
        closeAddModal();
    };

    var btnShowMore = document.getElementById('btn-show-more');
    if (btnShowMore) btnShowMore.onclick = function () { alert('Здесь будет загрузка следующих фильмов'); };

    var detailsBtns = document.querySelectorAll('.btn-details');
    for (var i = 0; i < detailsBtns.length; i++) {
        detailsBtns[i].onclick = function () {
            var card = this.closest('.movie-card');
            var title = card ? card.querySelector('.movie-title').textContent : 'фильм';
            if (!isLoggedIn()) { openModal('login'); return; }
            alert('Подробнее: ' + title);
        };
    }

    var regName = document.getElementById('reg-name');
    var regEmail = document.getElementById('reg-email');
    var regPhone = document.getElementById('reg-phone');
    var regPassword = document.getElementById('reg-password');
    var regPasswordConfirm = document.getElementById('reg-password-confirm');
    var regAgree = document.getElementById('reg-agree');
    var btnSubmitRegister = document.getElementById('btn-submit-register');

    var regexName = /^[А-Яа-яЁё\s-]+$/;
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var regexPhone = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    var regexPassword = /^(?!\d+$).{6,}$/;

    function setErr(input, msg, errId) {
        if (input) input.classList.add('invalid');
        var el = document.getElementById(errId); if (el) el.textContent = msg;
    }
    function clearErr(input, errId) {
        if (input) input.classList.remove('invalid');
        var el = document.getElementById(errId); if (el) el.textContent = '';
    }

    function validateRegister() {
        if (!regName || !regEmail || !regPhone || !regPassword || !regPasswordConfirm || !regAgree) return false;
        var ok = true;
        if (!regexName.test(regName.value.trim())) { setErr(regName, 'Только русские буквы', 'error-reg-name'); ok = false; } else clearErr(regName, 'error-reg-name');
        if (!regexEmail.test(regEmail.value.trim())) { setErr(regEmail, 'Введите корректный email', 'error-reg-email'); ok = false; } else clearErr(regEmail, 'error-reg-email');
        if (!regexPhone.test(regPhone.value.trim())) { setErr(regPhone, 'Введите телефон', 'error-reg-phone'); ok = false; } else clearErr(regPhone, 'error-reg-phone');
        if (!regexPassword.test(regPassword.value)) { setErr(regPassword, 'Мин. 6 символов', 'error-reg-password'); ok = false; } else clearErr(regPassword, 'error-reg-password');
        if (regPasswordConfirm.value !== regPassword.value || regPasswordConfirm.value === '') { setErr(regPasswordConfirm, 'Пароли не совпадают', 'error-reg-password-confirm'); ok = false; } else clearErr(regPasswordConfirm, 'error-reg-password-confirm');


if (!regAgree.checked) { var e1 = document.getElementById('error-reg-agree'); if (e1) e1.textContent = 'Необходимо согласие'; ok = false; } else { var e2 = document.getElementById('error-reg-agree'); if (e2) e2.textContent = ''; }
        if (btnSubmitRegister) btnSubmitRegister.disabled = !ok;
        return ok;
    }

    [regName, regEmail, regPhone, regPassword, regPasswordConfirm, regAgree].forEach(function (input) {
        if (!input) return;
        input.addEventListener('input', validateRegister);
        input.addEventListener('change', validateRegister);
    });

    if (formRegister) formRegister.onsubmit = function (e) {
        e.preventDefault();
        if (!validateRegister()) return;
        alert('Регистрация успешна!');
        localStorage.setItem('userName_' + regEmail.value, regName.value);
        localStorage.setItem('currentUserName', regName.value);
        updateAuthUI();
        closeModal();
        formRegister.reset();
        if (btnSubmitRegister) btnSubmitRegister.disabled = true;
    };

    var loginEmail = document.getElementById('login-email');
    var loginPassword = document.getElementById('login-password');
    var btnSubmitLogin = document.getElementById('btn-submit-login');

    function validateLogin() {
        if (!loginEmail || !loginPassword) return false;
        var ok = true;
        if (!regexEmail.test(loginEmail.value.trim())) { setErr(loginEmail, 'Введите корректный email', 'error-login-email'); ok = false; } else clearErr(loginEmail, 'error-login-email');
        if (loginPassword.value.length < 1) { setErr(loginPassword, 'Введите пароль', 'error-login-password'); ok = false; } else clearErr(loginPassword, 'error-login-password');
        if (btnSubmitLogin) btnSubmitLogin.disabled = !ok;
        return ok;
    }
    [loginEmail, loginPassword].forEach(function (input) {
        if (!input) return;
        input.addEventListener('input', validateLogin);
    });

    if (formLogin) formLogin.onsubmit = function (e) {
        e.preventDefault();
        if (!validateLogin()) return;
        alert('Вход выполнен!');
        var name = localStorage.getItem('userName_' + loginEmail.value) || 'Пользователь';
        localStorage.setItem('currentUserName', name);
        updateAuthUI();
        closeModal();
        formLogin.reset();
        if (btnSubmitLogin) btnSubmitLogin.disabled = true;
    };

    function updateAuthUI() {
        var authButtons = document.getElementById('auth-buttons');
        var userProfile = document.getElementById('user-profile');
        var userNameSpan = document.getElementById('user-name');
        if (!authButtons || !userProfile) return;
        var name = localStorage.getItem('currentUserName');
        if (name) {
            authButtons.style.display = 'none';
            userProfile.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = name;
        } else {
            authButtons.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }
    updateAuthUI();

    var btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUserName');
            updateAuthUI();
        };
    }
});





