const { playerData } = require('../entityData/playerData');

mp.events.addCommand('mcd', (player) => {
	const [posX, posY, posZ, rotZ] = [player.position.x.toFixed(4), player.position.y.toFixed(4), player.position.z.toFixed(4), player.heading.toFixed(4)];

	player.outputChatBox(`X: ${posX}, Y: ${posY}, Z: ${posZ}, Rot: ${rotZ}`);
});

mp.events.addCommand('veh', (player, vehName) => {
	const vehHash = mp.joaat(vehName);

	player.getOwnVariable('TEMP_VEHICLE') && player.getOwnVariable('TEMP_VEHICLE').destroy();

	const veh = mp.vehicles.new(vehHash, player.position, {
		alpha: 255,
		color: [
			[200, 150, 150],
			[0, 0, 0],
		],
		numberPlate: 'ADMIN',
	});

	player.setOwnVariable('TEMP_VEHICLE', veh);
});

mp.events.addCommand('mydata', (player) => {
	let data = [];

	for (const key in playerData) {
		data.push(player.getOwnVariable(playerData[key]));
	}

	data = JSON.stringify({ ...data });

	console.log(data);
});

mp.events.addCommand('vsp', (player) => {
	player.call('clientEvent:vehicleSpawner.init');
});
