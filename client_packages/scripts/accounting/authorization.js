// переменная, которая хранит в себе экземпляр браузера окна авторизации, либо же null
let authBrowser = null;

// функция, которая выводит в окне авторизации лог, посредством метода execute
const sendLogToBrowser = (message) => authBrowser && authBrowser.execute(`sendLog("${message}")`);

// данное событие инициализирует создание браузерного окна и выводит его игроку
mp.events.add('clientEvent:accounting.initAuthorization', () => {
	// проверяем на существование браузера
	if (authBrowser) return;

	// в переменную браузера записываем экземпляр нового браузера
	authBrowser = mp.browsers.new('package://cef/authorization/index.html');

	// отключаем чат, что бы исключить его срабатывание при нажатии на кнопку 'T'
	mp.gui.chat.activate(false);

	// выводим браузер игроку
	authBrowser.active = true;

	setTimeout(() => {
		mp.gui.cursor.visible = true;
	}, 500);
});

// в этом событии делаем обратное тому, что делали в событии инициализации браузерного окна
mp.events.add('clientEvent:accounting.destroyAuthorization', () => {
	if (!authBrowser) return;

	mp.gui.chat.activate(true);

	authBrowser.active = mp.gui.cursor.visible = false;

	// уничтожаем экземпляр браузерного окна
	authBrowser.destroy();
});

// данное событие вызывает функцию вывода лога в окне браузера, поскольку может быть потребность в выводе информации со стороны сервера напрямую
mp.events.add('clientEvent:accounting.sendErrorAuthorization', (errorMessage) => sendLogToBrowser(errorMessage));

// данное событие вызывает удаленную (на стороне сервера) процедуру, которая вернет результат в виде промиса, поэтому функция является асинхронной
mp.events.addProc('clientProc:accounting.authorization', async (login, password) => {
	// получаем результат процедуры со стороны сервера в виде объекта, передав туда авторизационные данные
	const result = await mp.events.callRemoteProc('serverProc:accounting.authorization', login, password);

	// если объект содержит поле error - выводим ошибку в интерфейсе и прерываем процесс авторизации
	if (result.error) {
		sendLogToBrowser(result.error);
		return;
	}

	// иначе выводим сообщение о успешной авторизации со стороны клиента
	sendLogToBrowser(result.message);

	// вызываем удаленную процедуру на стороне клиента, в которой описана логика после авторизации
	mp.events.callRemoteProc('serverProc:accounting.endAuthorization');
});

// все то же самое, как и с авторизации, единственным отличием является вызываемая процедура на стороне сервера и доп. поле с электронной почтой
mp.events.addProc('clientProc:accounting.registration', async (login, password, email) => {
	const result = await mp.events.callRemoteProc('serverProc:accounting.registration', login, password, email);

	if (result.error) {
		sendLogToBrowser(result.error);
		return;
	}

	sendLogToBrowser(result.message);

	mp.events.callRemoteProc('serverProc:accounting.endAuthorization');
});

// процедура отмены авторизации, если игрок нажмет на кнопку "отмена"
mp.events.addProc('clientProc:accounting.cancelAuthorization', () => {
	// вызываем серверную процедуру, которая кикнет игрока
	mp.events.callRemoteProc();
});
