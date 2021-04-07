mp.events.add('playerReady', () => {
	// Получаем экземпляр локлаького игрока
	const player = mp.players.local;
	// Получаем его позицию
	const pos = player.position;

	// Приветствуем игрока выводом сообщения в чат и сообщаем ему его позицию
	mp.gui.chat.push(`Добро пожаловать, ${player.name}. Ваша текущая позиция: X: ${pos.x.toFixed(4)}, Y: ${pos.y.toFixed(4)}, Z: ${pos.z.toFixed(4)}`);
});

// Привязываем обработчик к клавише с кодом 80 - "англ. P"
mp.keys.bind(80, false, () => {
	// Получаем позицию
	const pos = mp.players.local.position;

	// Выводим позицию в чат
	mp.gui.chat.push(`Ваша текущая позиция: X: ${pos.x.toFixed(4)}, Y: ${pos.y.toFixed(4)}, Z: ${pos.z.toFixed(4)}`);
});
