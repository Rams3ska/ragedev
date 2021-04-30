mp.events.add('playerJoin', (player) => {
	// устанавливаем измерение, в котором никого не будет
	player.dimension = player.id + 10000;
	// меняем позицию
	player.position = new mp.Vector3(686.3969, 577.8329, 130.4613);
	// разворот
	player.heading = 160.0;
	// делаем 3д модель персонажа невидимым
	player.alpha = 0;

	// вызываем клиентскую процедуру, которая проинициализирует окно атворизации
	player.call('clientEvent:accounting.initAuthorization');
});
