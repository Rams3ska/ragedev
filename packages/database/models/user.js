// импортируем типы данных для полей таблицы
const { DataTypes } = require('sequelize');

// импортируем экземпляр, который мы экспортировали из dbConnect.js
const sequelize = require('../dbConnect').sequelize;

// описываем экспорт модели User, который будет результатом метода define экземпляра sequelize
// 'user' - название модели
// id, login, etc. - поля, которые будут инициализированы в таблице
// свойства полей - параметры, о которых можно узнать из оф. документации Sequelize
module.exports.User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		regDate: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: Date.now(),
		},
		lastJoinDate: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: Date.now(),
		},
	},
	{
		// название таблицы в базе данных
		tableName: 'Users',
		timestamps: false,
	},
);
