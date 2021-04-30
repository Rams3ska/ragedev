// импортирует Sequelize
const { Sequelize } = require('sequelize');

// импортируем наш конфиг
const dbConfig = require('./dbConfig.json');

// создаем экземпляр подключения, указав первыми параметрами информацию из конфигурации
const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
	host: dbConfig.host,
	// тип базы данных
	dialect: 'mysql',
	// параметр синхронизации базы данных
	sync: { alter: true },
});

// данная функция даст нам знать об успешности\ошибки подключения
async function initConnection() {
	try {
		await sequelize.authenticate();

		// если подключение успешно - синхронизируем базу данных
		await syncTables();

		console.log('[DB Log]: DB Connection successful');
	} catch (error) {
		console.log('[DB Error]: ', error);
	}
}

// функция, которая синхронизирует (создает необходимые миграции) и возвращает результат
async function syncTables() {
	return sequelize.sync();
}

// вызов инициализации соединения
initConnection();

// экспортируем экземпляр подключения для дальнейшего взаимодействия с ним
module.exports = {
	sequelize,
};
