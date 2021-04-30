let isAuthMode = true;

$(() => {
	$('.mode-switch').on('click', switchMode);

	$('#btn-submit').on('click', () => {
		const [login, password, email] = [$('#login').val(), $('#password').val(), $('#email').val()];
		const [isLogin, isPassword, isEmail] = [isNotValidLogin(login), isNotValidPassword(password), isNotValidEmail(email)];

		if (isLogin !== false) {
			sendLog(isLogin);
			return;
		}

		if (isPassword !== false) {
			sendLog(isPassword);
			return;
		}

		if (isAuthMode === false && isEmail !== false) {
			sendLog(isEmail);
			return;
		}

		sendLog('Wait...');

		isAuthMode
			? mp.events.callProc('clientProc:accounting.authorization', login, password)
			: mp.events.callProc('clientProc:accounting.registration', login, password, email);
	});

	$('#btn-cancel').on('click', () => mp.trigger('clientProc:accounting.cancelAuthorization'));

	$('.input-field').on('input', (el) => {
		switch (el.target.id) {
			case 'login': {
				isNotValidLogin($(el.target).val()) ? el.target.classList.add('input-field_error') : el.target.classList.remove('input-field_error');
				break;
			}
			case 'password': {
				isNotValidPassword($(el.target).val()) ? el.target.classList.add('input-field_error') : el.target.classList.remove('input-field_error');
				break;
			}
			case 'email': {
				isNotValidEmail($(el.target).val()) ? el.target.classList.add('input-field_error') : el.target.classList.remove('input-field_error');
				break;
			}
			default:
				return;
		}
	});
});

function switchMode() {
	isAuthMode = !isAuthMode;

	hideLog();

	$('.mode-switch').html(isAuthMode ? 'Регистрация' : 'Авторизация');
	$('.auth__title').html(!isAuthMode ? 'Регистрация' : 'Авторизация');
	$('.btn_green').html(isAuthMode ? 'ВОЙТИ' : 'ДАЛЕЕ');

	if (isAuthMode) {
		$('.auth').animate({ height: '440px' }, 150);
		$('#email').fadeOut(100);
	} else {
		$('.auth').animate({ height: '470px' }, 150);
		$('#email').fadeIn(150);
	}
	setTimeout(() => $('.auth').removeAttr('style'), 200);
}

function sendLog(message) {
	hideLog();
	$('.outlog__text').html(message);
}

function hideLog() {
	$('.outlog__text').html('');
}

function isNotValidLogin(login = '') {
	if (login.length < 2 || login.length > 32) return '[Ошибка]: Длина логина не может быть меньше 2 или больше 32 символов';
	else if (login.match(/[^A-Za-z0-9_]/)) return '[Ошибка]: Логин может содержать только следующие символы: A-Z a-z 0-9 _';

	return false;
}

function isNotValidPassword(password = '') {
	if (password.length < 6 || password.length > 32) return '[Ошибка]: Длина пароля не может быть меньше 6 или больше 32 символов';
	return false;
}

function isNotValidEmail(email = '') {
	if (!email.match(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm))
		return '[Ошибка]: Введен некорректный e-mail';
	return false;
}
