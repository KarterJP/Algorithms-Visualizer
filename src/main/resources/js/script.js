var canvas;
var label;
var fps = 5;
var objects = [];
var iProgress = 0, jProgress = 0, i, j;

const algorithms = {
		BUBBLESORT: "Bubble Sort",
		LINEARSEARCH: "Linear Search",
		DIJKSTRA: "Dijkstra's Algorithm",
}

const types = {
	SORT: 0,
	SEARCH: 1,
	PATHFIND: 2,
}

const speeds = {
	SLOW: 1000,
	NORMAL: 500,
	FAST: 250,
	SUPERSONIC: 100,
}

const colors = {
	PRIMARY: "#333",
	START: "#FFDC00",
	END: "#2ECC40",
	VISITED: "#FF6347",
	PATH: "#0074D9"
}

var speed = speeds.NORMAL;
var type = types.SORT;
var algorithm = algorithms.BUBBLESORT;
var isRunning = false;

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

$(document).ready(function()
{
	$("#start").click(function(e) {
		start();
	});

	$("#stop").click(function(e) {
		stop();
	});

	$("#sorting-dropdown").click(function(e) {
		e.preventDefault();
	});

	$("#search-dropdown").click(function(e) {
		e.preventDefault();
	});

	$("#speed").change(function(e) {
		e.preventDefault();
		var newSpeed;
		switch (this.value)
		{
			case "slow": newSpeed = speeds.SLOW;
			break;
			case "normal": newSpeed = speeds.NORMAL;
			break;
			case "fast": newSpeed = speeds.FAST;
			break;
			case "supersonic": newSpeed = speeds.SUPERSONIC;
			break;
		}
		speed = newSpeed;
	});
});

function init() {
	stop();
	resetProgress();
	if (canvas != null)
	{
		canvas.destroy();
		objects.length = 0;
	}

	canvas = oCanvas.create({
		canvas: "#canvas",
		background: "#EDF5E1",
		drawEachFrame: false,
		fps: fps
	});

	label = canvas.display.text({
		x: 10,
		y: 10,
		origin: { x: "left", y: "top" },
		font: "bold 30px sans-serif",
		text: algorithm,
		fill: colors.PRIMARY
	});
	canvas.addChild(label);

	switch (type)
	{
		case types.SORT: sortInit();
		break;
		case types.SEARCH: searchInit();
		break;
		case types.PATHFIND: pathfindInit();
		break;
	}
}

function start()
{
	switch (algorithm)
	{
		case algorithms.BUBBLESORT: bubbleSort();
		break;
		case algorithms.LINEARSEARCH: linearSearch();
		break;
		case algorithms.DIJKSTRA: dijkstra();
		break;
	}
}

function running()
{
	isRunning = true;
	$("#start").css("display", "none");
	$("#stop").css("display", "block");
}

function stop()
{
	iProgress = i;
	jProgress = j;
	isRunning = false;
	$("#stop").css("display", "none");
	$("#start").css("display", "block");
}

function resetProgress()
{
	iProgress = 0;
	jProgress = 0;
	i = 0;
	j = 0;
}

function searchInit()
{
	for (var k = 10; k <= canvas.width; k+=80)
	{
		var box = canvas.display.rectangle({
			x: k,
			y: (canvas.height/2)-50,
			width: 60,
			height: 100,
			fill: "rgba(0, 0, 0, 0.1)",
			stroke: "inside 5px rgba(51, 51, 51, 1)"
		});
		canvas.addChild(box);

		var number = Math.floor(Math.random()*100);
		var text = canvas.display.text({
			x: k+box.width/2,
			y: box.y+(box.height/2)-15,
			origin: { x: "center", y: "top" },
			font: "bold 30px sans-serif",
			text: number,
			fill: colors.PRIMARY
		});
		canvas.addChild(text);
		objects.push(text);
	}
}

function sortInit()
{
	for (var k = 50; k <= canvas.width-50; k+=50)
	{
		var line = canvas.display.line({
			start: { x: k, y: Math.random()*(canvas.height-150)+100 },
			end: { x: k, y: canvas.height },
			stroke: "25px "+colors.PRIMARY,
			cap: "round"
		});
		canvas.addChild(line);
		objects.push(line);
	}
}

function pathfindInit()
{
	if (unvisited) { unvisited = new BinaryHeap(function(node){return node.distance}); };
	path = [];
	grid = [];
	var i = 0;
	for (var y = 100; y < canvas.height-cellSize; y+=cellSize) {
		var j = 0;
		var cells = [];
		for (var x = cellSize; x < canvas.width-cellSize; x+=cellSize)
		{
			cells.push(new Node(x, y, i, j));
			j++;
		}
		grid.push(cells);
		i++;
	}

	rowLength = grid[0].length;
	columnLength = grid.length;

	beginning = grid[Math.floor(Math.random()*columnLength)][Math.floor(Math.random()*(rowLength/2-1))];
	destination = grid[Math.floor(Math.random()*(columnLength/2))][Math.floor(Math.random()*(rowLength/2)+(rowLength/2))];

	beginning.becomeBeginning();
	destination.becomeDestination();
}
