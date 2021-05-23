const { parseCarsFromSite } = require('./vehicleDataParser');

mp.events.add('packagesLoaded', () => {
	parseCarsFromSite().then((data) => {
		mp.global.vehicleSpawnerData = data;

		console.log('[INFO] Vehicles Spawner Data is loaded');
	});
});

mp.events.addProc('serverProc:vehicleSpawner.spawnVehicle', (player, hash) => {
	mp.vehicles.new(+hash, player.position, { alpha: 255, numberPlate: 'VehSpawner' });

	player.outputChatBox('Автомобиль успешно создан');
});

mp.events.add('playerJoin', (player) => {
	// получаем данные из глобальной переменной
	const vehData = JSON.stringify(mp.global.vehicleSpawnerData);
	const splitedData = [];

	// разбиваем строку с данными на элементы по 500 символов
	for (let i = 0, buffer = ''; i < vehData.length; i++) {
		buffer = buffer.concat(vehData[i]);

		if (i !== 0 && i % 500 === 0) {
			splitedData.push(buffer);

			buffer = '';
		}

		if (i === vehData.length - 1) {
			splitedData.push(buffer);
		}
	}
	// вызываем клиентское событие, куда передаем массив разбитых данных
	player.call('clientEvent:vehicleSpawner.getVehiclesList', splitedData);
});
