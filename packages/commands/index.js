// Описываем саму команду, где первый аргумент - команда, второй аргумент - колбек вызова команды
mp.events.addCommand('test', (player, fullText, args) => {
	// При помощи интерполяции создаем строку, которая покажет нам параметры callback'a
	const outMessage = `Player: ${player} | FullText: ${fullText} | Args: ${args}`;

	// Выводим строку в игровой чат
	player.outputChatBox(outMessage);

	// Выводим строку в консоль
	console.log(outMessage);
});
