var app = {
	init: function() {
		var columns = 10;
		var cells = 10;
		app.meta = {
			'posX' : Math.floor(columns/2),
			'posY' : Math.floor(cells/2),
			'score' : 0,
			'direction' : 0, // 0, 1, 2, 3 => top, right, bottom, left
			'previousDirection' : 2,
			'length' : 1,
			'speed' : 1,
			'lastPos' : [],
			'maxX' : columns,
			'maxY' : cells,
			'status' : true,
			'firstInput' : false,
			'speedCount' : 0
		};
		document.querySelector('#score').textContent = 'Score : '+app.meta['score'];
		document.querySelector('#length').textContent = 'Length : '+app.meta['length'];
		document.querySelector('#speed').textContent = 'Speed : '+app.meta['speed'];

		document.querySelector('#gameover').classList.add('hidden');
		document.querySelector('#canvas').classList.remove('blur');

		app.initGrid(columns, cells);
		app.game();

		document.querySelector('.cell-'+app.meta['posY']+'-col-'+app.meta['posX']).id = 'head';
		var resetButton = document.querySelector('#reset');
		resetButton.addEventListener('click', app.init);
		document.addEventListener('keypress', app.verifKey);
	},
	randomItemPos: function(max) {
		min = 1;
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	},
	randomItemType: function() {
		min = 1;
		max = 20;
		return Math.floor(Math.random() * (max - min +1)) + min;
	},
	createItem: function() {
		var itemType = app.randomItemType();
		if (itemType < 19) {
			itemType = 'points';
		} else if (itemType == 19) {
			itemType = 'cut';
		} else if (itemType == 20) {
			itemType = 'slow';
		}

		if (!document.querySelector('.item')) {
			var itemPosX = app.randomItemPos(app.meta['maxX']);
			var itemPosY = app.randomItemPos(app.meta['maxY']);
			var newItemPos = document.querySelector('.cell-'+itemPosX+'-col-'+itemPosY);
			var newItem = document.createElement('div');
			if (!newItemPos.classList.contains('qqchose')) {
				newItem.setAttribute("class", 'item ' + itemType);
				newItemPos.append(newItem);
			} else {
				app.createItem();
			}
		}
	},
	game: function() {
		app.createItem();

		if (app.meta['firstInput'] && app.meta['status']) {
			if (app.meta['lastInterval'] != null) {
				clearInterval(app.meta['lastInterval']);
			}
			app.meta['previousDirection'] = app.meta['direction'];
			app.meta['lastInterval'] = setTimeout(app.game, 850-(50*app.meta['speed']));
			app.movement();
		}
	},
	initGrid: function(columns, cells) {
		var canvasElement = document.querySelector('#canvas');
		canvasElement.innerHTML = '';

		for (var indexColumn = 1; indexColumn <= columns; indexColumn+=1) {
			var newColumn = document.createElement('div');
			newColumn.setAttribute("class", "column col-"+indexColumn);
			canvasElement.append(newColumn);
			for (var indexCell = 1; indexCell <= cells; indexCell+=1) {
				var actualColumn = document.querySelector(".col-"+indexColumn);
				var newCell = document.createElement('div');
				newCell.setAttribute("class", "cell cell-"+indexCell+"-col-"+indexColumn);
				actualColumn.append(newCell);
			}
		}
		var newSnakeHead = document.createElement('div');
		newSnakeHead.setAttribute("id", "head");
	},
	verifKey: function(event) {
		if (app.meta['status']) {
			var movementKeys = {
				'z' : true,
				'q' : true,
				's' : true,
				'd' : true
			}; 
			var keyPressed = event.key;

			if (movementKeys[keyPressed]) {

				if (keyPressed == 'z' && app.meta['direction'] != 2 && app.meta['previousDirection'] != 2) {
					app.meta['direction'] = 0;
				} else if (keyPressed == 'q' && app.meta['direction'] != 1 && app.meta['previousDirection'] != 1) {
					app.meta['direction'] = 3;
				} else if (keyPressed == 's' && app.meta['direction'] != 0 && app.meta['previousDirection'] != 0) {
					app.meta['direction'] = 2;
				} else if (keyPressed == 'd' && app.meta['direction'] != 3 && app.meta['previousDirection'] != 3) {
					app.meta['direction'] = 1;
				}

				if (!app.meta['firstInput']) {
					app.meta['firstInput'] = true;
					app.game();
				}
			}
		}
	},
	movement: function() {
		var gameOver = false;
		document.querySelector('#head').id = '';
		app.meta['lastPos'][app.meta['lastPos'].length] = '.cell-'+app.meta['posY']+'-col-'+app.meta['posX'];
		if (app.meta['direction'] == 0) {
			app.meta['posY'] -= 1;
		} else if (app.meta['direction'] == 1) {
			app.meta['posX'] += 1;
		} else if (app.meta['direction'] == 2) {
			app.meta['posY'] += 1;
		} else if (app.meta['direction'] == 3) {
			app.meta['posX'] -= 1;
		}


		var existingTail = document.querySelectorAll('.body');
		for (var index=0; index < existingTail.length; index+=1) {
			existingTail[index].classList.remove('body');
		}

		var addTail = 0;
		for (var lengthIndex=0; lengthIndex < app.meta['length']; lengthIndex+=1) {
			addTail = document.querySelector(app.meta['lastPos'][app.meta['lastPos'].length-lengthIndex]);
			if (addTail) {
				addTail.classList.add('body');
			}
		}

		if (0 == app.meta['posX'] || app.meta['posX'] > app.meta['maxX'] || 0 == app.meta['posY'] || app.meta['posY'] > app.meta['maxY']) {
			app.gameOver();
		} else {
			document.querySelector('.cell-'+app.meta['posY']+'-col-'+app.meta['posX']).id = 'head';
			document.querySelector('#head').style.transform = 'rotate('+90*app.meta['direction']+'deg)';
		}

		var currentCell = document.querySelector('#head');
		if (currentCell && currentCell.innerHTML == '<div class="item points"></div>') {
			currentCell.innerHTML = '';
			app.meta['score'] += 1;
			app.meta['length'] += 1;
			app.meta['speedCount'] += 1;
			if (app.meta['speedCount'] == 10) {
				app.meta['speedCount'] = 0;
				app.meta['speed'] += 1;
			}
			document.querySelector('#score').textContent = 'Score : '+app.meta['score'];
			document.querySelector('#length').textContent = 'Length : '+app.meta['length'];
			document.querySelector('#speed').textContent = 'Speed : '+app.meta['speed'];
		}
		if (currentCell && currentCell.innerHTML == '<div class="item cut"></div>') {
			currentCell.innerHTML = '';
			if (app.meta['length'] != 1) {
				app.meta['length'] -= 1;
			}
			document.querySelector('#length').textContent = 'Length : '+app.meta['length'];
		}
		if (currentCell && currentCell.innerHTML == '<div class="item slow"></div>') {
			currentCell.innerHTML = '';
			if (app.meta['speed'] != 1) {
				app.meta['speed'] -= 1;
			}
			app.meta['speedCount'] = 0;
			document.querySelector('#speed').textContent = 'Speed : '+app.meta['speed'];
		} else if (currentCell && currentCell.classList.contains('body')) {
			app.gameOver();
		}
	},
	gameOver: function() {
		app.meta['status'] = false;
		document.querySelector('#gameover').classList.remove('hidden');
		document.querySelector('#canvas').classList.add('blur');
	}
};

document.addEventListener('DOMContentLoaded', app.init);