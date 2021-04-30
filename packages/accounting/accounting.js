// импортируем модель пользователя
const { User } = require('../database/models/user');
// импортируем константы, которые будут ключами к данным
const { playerData } = require('../entityData/playerData');

// описываем процедуру авторизации игрока, т.к. взаимодействуем с базой - делаем коллбек асинхронным
mp.events.addProc('serverProc:accounting.authorization', async (player, login, password) => {
	// ищем в базе данных пользователя с переданным в параметрах логином
	const user = await User.findOne({ where: { login: login } });

	// если user === null - отдаем на клиент объект с полем ошибки, которая будет выведена в интерфейсе авторизации
	if (!user) {
		return { error: '[Ошибка]: Данный аккаунт не зарегистрирован' };
	}

	// так же поступаем при вводе неверного пароля
	if (password !== user.password) {
		return { error: '[Ошибка]: Неверный логин или пароль' };
	}

	// если все окей, то записываем данные из базы в переменные сущности игрока, используя наши константные ключи и значения из базы данных
	player.setOwnVariable(playerData.PLAYER_DB_ID, user.id);
	player.setOwnVariable(playerData.PLAYER_LOGIN, user.login);
	player.setOwnVariable(playerData.PLAYER_EMAIL, user.email);
	player.setOwnVariable(playerData.PLAYER_REG_DATE, user.regDate);
	player.setOwnVariable(playerData.PLAYER_LAST_JOIN_DATE, user.lastJoinDate);

	// после возвращаем обычное сообщение об успешной авторизации
	return { message: '[Информация]: Вы успешно авторизировались!' };
});

// данная процедура описывает логику, которая будет исполнена по завершению авторизации
mp.events.addProc('serverProc:accounting.endAuthorization', (player) => {
	//
	player.call('clientEvent:accounting.destroyAuthorization');

	player.dimension = 0;
	player.alpha = 255;
});

// процедура регистрации аналогична процедуре авторизации
mp.events.addProc('serverProc:accounting.registration', async (player, login, password, email) => {
	let user = await User.findOne({ where: { login: login } });

	// проверка на существующего юзера в базе с данным логином
	if (user) {
		return { error: '[Ошибка]: Аккаунт с данным логином уже зарегистрирован' };
	}

	// создаем новую запись в базе данных, передав туда данные из переданных параметров
	user = await User.create({
		login: login,
		password: password,
		email: email,
	});

	player.setOwnVariable(playerData.PLAYER_DB_ID, user.id);
	player.setOwnVariable(playerData.PLAYER_LOGIN, user.login);
	player.setOwnVariable(playerData.PLAYER_EMAIL, user.email);
	player.setOwnVariable(playerData.PLAYER_REG_DATE, user.regDate);
	player.setOwnVariable(playerData.PLAYER_LAST_JOIN_DATE, user.lastJoinDate);

	return { message: '[Информация]: Вы успешно зарегистрировались!' };
});

// процедура, которая кикнет игрока при отмене авторизации
mp.events.addProc('serverProc:accounting.cancelAuthorization', (player) => player.kick('Authorization cancel'));
