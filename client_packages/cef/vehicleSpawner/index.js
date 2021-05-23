const vehicleList = [];
const groups = [];

function initVehicleSpawner(vehicles) {
	vehicles = JSON.parse(vehicles);

	// инициализируем списки
	vehicles.forEach((v) => {
		vehicleList.push(v);
		groups.includes(v.group) || groups.push(v.group);
	});

	// получаем родительский блок и создаем группы, итерируясь по списку групп
	groups.map((v) => {
		const groupsContainer = $('.cars-groups');
		const group = $('<div />').addClass('group');
		const groupName = $(`<span>${v}</span>`).addClass('group__name');
		const groupIndicator = $('<span>+</span>').addClass('group__indicator');
		const button = $('<button />').addClass('group-expand__btn');

		button.append(groupName);
		button.append(groupIndicator);

		group.append(button);

		groupsContainer.append(group);

		const groupContent = $('<div />').addClass('group-content');

		// для каждой группы создаем айтемы машин и прикрепляем к группе
		vehicles.map(async (veh) => {
			if (veh.group !== v) return;

			const item = $('<div />').addClass('car-item');
			const itemImage = $(`<img />`).attr('src', veh.picture).attr('alt', veh.name).addClass('car-item__image');
			const itemDescription = $('<div />').addClass('car-item__description');
			const itemName = $(`<span>Name: ${veh.name}</span>`).addClass('group__name');
			const itemHash = $(`<span>Hash: ${veh.hash}</span>`).addClass('group__hash');

			item.append(itemImage);

			itemDescription.append(itemName);
			itemDescription.append(itemHash);

			item.append(itemDescription);

			groupContent.append(item);

			item.on('click', () => sendSpawnVehicle(veh.hash));
		});
		group.append(groupContent);

		button.on('click', () => toggleGroup(groupContent, groupIndicator));
	});
}

// функция, которая будет обрабатывать раскрытие\закрытие группы
function toggleGroup(elem, indicator) {
	if ($(elem).hasClass('group-content_active')) {
		$(elem).removeClass('group-content_active');
		$(indicator).html('+');
	} else {
		$(elem).addClass('group-content_active');
		$(indicator).html('-');
	}
}

// функция, которая будет отправлять запрос на спавн автомобиля на клиент
function sendSpawnVehicle(hash) {
	mp.events.callProc('clientProc:vehicleSpawner.createVehicle', hash);
}
