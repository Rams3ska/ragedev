// экземлпяр браузера спавнера
let vehSpawnerBrowser = null;

// событие создающее экземлпяр браузера
mp.events.add('clientEvent:vehicleSpawner.init', () => {
	if (vehSpawnerBrowser) return;

	vehSpawnerBrowser = mp.browsers.new('package://cef/vehicleSpawner/index.html');

	mp.gui.chat.activate(false);

	vehSpawnerBrowser.active = true;

	mp.gui.cursor.show(true, true);

	// передаем список машин браузеру для инициализации
	vehSpawnerBrowser.execute(`initVehicleSpawner('${mp.storage.data.vehicleSpawnerList}')`);
});

// событие, которое уничтожает экземпляр браузера
mp.events.add('clientEvent:vehicleSpawner.destroy', () => {
	if (!vehSpawnerBrowser) return;

	vehSpawnerBrowser.destroy();

	mp.gui.chat.activate(true);

	mp.gui.cursor.show(false, false);

	vehSpawnerBrowser = null;
});

// событие, которое запишет список автомобилей на клиенской части при авторизации игрока
mp.events.add('clientEvent:vehicleSpawner.getVehiclesList', (...list) => {
	// собираем массивы данных в одну строку
	const text = list.join('');

	// записываем данные в клиенское хранилище
	mp.storage.data.vehicleSpawnerList = text;
});

// вызываемый из браузера процесс, передающий вызов на серверную часть
mp.events.addProc('clientProc:vehicleSpawner.createVehicle', (hash) => {
	mp.events.callRemoteProc('serverProc:vehicleSpawner.spawnVehicle', hash);
});

// при нажатии esc уничтожаем браузер при наличии его экземлпяра
mp.keys.bind(27, false, () => vehSpawnerBrowser && mp.events.call('clientEvent:vehicleSpawner.destroy'));
