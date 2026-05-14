const CELL_SIZE = 16;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const DEFAULT_TICK_RATE = 10;
const DEFAULT_GRASS_SPAWN_CHANCE = 5;
const DEFAULT_RABBIT_SPAWN_CHANCE = 10;
const DEFAULT_FOX_SPAWN_CHANCE = 0.5;
const DEFAULT_RABBIT_HUNGER_INCREASE = 25;
const DEFAULT_RABBIT_HUNGER_DECREASE = 10;
const DEFAULT_RABBIT_REPRODUCTION_THRESHOLD = 150;
const DEFAULT_RABBIT_REPRODUCTION_CHANCE = 20;
const DEFAULT_RABBIT_REPRODUCTION_HUNGER_COST = 50;
const DEFAULT_FOX_HUNGER_INCREASE = 20;
const DEFAULT_FOX_HUNGER_DECREASE = 25;
const DEFAULT_FOX_REPRODUCTION_THRESHOLD = 200;
const DEFAULT_FOX_REPRODUCTION_CHANCE = 5;
const DEFAULT_FOX_REPRODUCTION_HUNGER_COST = 100;


let canvas = document.querySelector("canvas");
let cells = [];
const ctx = canvas.getContext("2d");
canvas.width = CELL_SIZE * GRID_WIDTH;
canvas.height = CELL_SIZE * GRID_HEIGHT;

const rabbitChartCanvas = document.getElementById("rabbitChart");
const rabbitCtx = rabbitChartCanvas.getContext("2d");

const foxChartCanvas = document.getElementById("foxChart");
const foxCtx = foxChartCanvas.getContext("2d");

const combinedChartCanvas = document.getElementById("combinedChart");
const combinedCtx = combinedChartCanvas.getContext("2d");



let directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
let tick = 0;
let tickRate = DEFAULT_TICK_RATE;
let grassSpawnChance = DEFAULT_GRASS_SPAWN_CHANCE;
let rabbitSpawnChance = DEFAULT_RABBIT_SPAWN_CHANCE;
let foxSpawnChance = DEFAULT_FOX_SPAWN_CHANCE;
let rabbitHungerIncrease = DEFAULT_RABBIT_HUNGER_INCREASE;
let rabbitHungerDecrease = DEFAULT_RABBIT_HUNGER_DECREASE;
let rabbitReproductionThreshold = DEFAULT_RABBIT_REPRODUCTION_THRESHOLD;
let rabbitReproductionChance = DEFAULT_RABBIT_REPRODUCTION_CHANCE;
let rabbitReproductionHungerCost = DEFAULT_RABBIT_REPRODUCTION_HUNGER_COST;
let foxHungerIncrease = DEFAULT_FOX_HUNGER_INCREASE;
let foxHungerDecrease = DEFAULT_FOX_HUNGER_DECREASE;
let foxReproductionThreshold = DEFAULT_FOX_REPRODUCTION_THRESHOLD;
let foxReproductionChance = DEFAULT_FOX_REPRODUCTION_CHANCE;
let foxReproductionHungerCost = DEFAULT_FOX_REPRODUCTION_HUNGER_COST;
let maxHistory = 200;
let rabbitPopulationHistory = [];
let foxPopulationHistory = [];
const CHART_WIDTH = 500;
const CHART_HEIGHT = 150;


cells = createGrid(GRID_WIDTH, GRID_HEIGHT);
populateGrid(cells);
gameLoop();


document.getElementById("tickRateRange").addEventListener("input", function () {
    tickRate = 101 - this.value;
    document.getElementById("speedDisplay").textContent = Math.round((DEFAULT_TICK_RATE / tickRate) * 100) + "%";
});

// Rabbit parameters
document.getElementById("rabbitHungerDecreaseSlider").addEventListener("input", function () {
    rabbitHungerDecrease = Number(this.value);
    document.getElementById("rabbitHungerDecreaseInput").value = this.value;
});
document.getElementById("rabbitHungerDecreaseInput").addEventListener("input", function () {
    rabbitHungerDecrease = Number(this.value);
    document.getElementById("rabbitHungerDecreaseSlider").value = this.value;
});

document.getElementById("rabbitHungerIncreaseSlider").addEventListener("input", function () {
    rabbitHungerIncrease = Number(this.value);
    document.getElementById("rabbitHungerIncreaseInput").value = this.value;
});
document.getElementById("rabbitHungerIncreaseInput").addEventListener("input", function () {
    rabbitHungerIncrease = Number(this.value);
    document.getElementById("rabbitHungerIncreaseSlider").value = this.value;
});

document.getElementById("rabbitReproductionThresholdSlider").addEventListener("input", function () {
    rabbitReproductionThreshold = Number(this.value);
    document.getElementById("rabbitReproductionThresholdInput").value = this.value;
});
document.getElementById("rabbitReproductionThresholdInput").addEventListener("input", function () {
    rabbitReproductionThreshold = Number(this.value);
    document.getElementById("rabbitReproductionThresholdSlider").value = this.value;
});

document.getElementById("rabbitReproductionChanceSlider").addEventListener("input", function () {
    rabbitReproductionChance = Number(this.value);
    document.getElementById("rabbitReproductionChanceInput").value = this.value;
});
document.getElementById("rabbitReproductionChanceInput").addEventListener("input", function () {
    rabbitReproductionChance = Number(this.value);
    document.getElementById("rabbitReproductionChanceSlider").value = this.value;
});

document.getElementById("rabbitReproductionHungerCostSlider").addEventListener("input", function () {
    rabbitReproductionHungerCost = Number(this.value);
    document.getElementById("rabbitReproductionHungerCostInput").value = this.value;
});
document.getElementById("rabbitReproductionHungerCostInput").addEventListener("input", function () {
    rabbitReproductionHungerCost = Number(this.value);
    document.getElementById("rabbitReproductionHungerCostSlider").value = this.value;
});

// Fox parameters
document.getElementById("foxHungerDecreaseSlider").addEventListener("input", function () {
    foxHungerDecrease = Number(this.value);
    document.getElementById("foxHungerDecreaseInput").value = this.value;
});
document.getElementById("foxHungerDecreaseInput").addEventListener("input", function () {
    foxHungerDecrease = Number(this.value);
    document.getElementById("foxHungerDecreaseSlider").value = this.value;
});

document.getElementById("foxHungerIncreaseSlider").addEventListener("input", function () {
    foxHungerIncrease = Number(this.value);
    document.getElementById("foxHungerIncreaseInput").value = this.value;
});
document.getElementById("foxHungerIncreaseInput").addEventListener("input", function () {
    foxHungerIncrease = Number(this.value);
    document.getElementById("foxHungerIncreaseSlider").value = this.value;
});

document.getElementById("foxReproductionThresholdSlider").addEventListener("input", function () {
    foxReproductionThreshold = Number(this.value);
    document.getElementById("foxReproductionThresholdInput").value = this.value;
});
document.getElementById("foxReproductionThresholdInput").addEventListener("input", function () {
    foxReproductionThreshold = Number(this.value);
    document.getElementById("foxReproductionThresholdSlider").value = this.value;
});

document.getElementById("foxReproductionChanceSlider").addEventListener("input", function () {
    foxReproductionChance = Number(this.value);
    document.getElementById("foxReproductionChanceInput").value = this.value;
});
document.getElementById("foxReproductionChanceInput").addEventListener("input", function () {
    foxReproductionChance = Number(this.value);
    document.getElementById("foxReproductionChanceSlider").value = this.value;
});

document.getElementById("foxReproductionHungerCostSlider").addEventListener("input", function () {
    foxReproductionHungerCost = Number(this.value);
    document.getElementById("foxReproductionHungerCostInput").value = this.value;
});
document.getElementById("foxReproductionHungerCostInput").addEventListener("input", function () {
    foxReproductionHungerCost = Number(this.value);
    document.getElementById("foxReproductionHungerCostSlider").value = this.value;
});

// Grass parameters
document.getElementById("grassSpawnChanceSlider").addEventListener("input", function () {
    grassSpawnChance = Number(this.value);
    document.getElementById("grassSpawnChanceInput").value = this.value;
});
document.getElementById("grassSpawnChanceInput").addEventListener("input", function () {
    grassSpawnChance = Number(this.value);
    document.getElementById("grassSpawnChanceSlider").value = this.value;
});

function reset() {
    cells = createGrid(GRID_WIDTH, GRID_HEIGHT);
    populateGrid(cells);
    rabbitPopulationHistory = [];
    foxPopulationHistory = [];
    tick = 0;

    tickRate = DEFAULT_TICK_RATE;
    grassSpawnChance = DEFAULT_GRASS_SPAWN_CHANCE;
    rabbitHungerIncrease = DEFAULT_RABBIT_HUNGER_INCREASE;
    rabbitHungerDecrease = DEFAULT_RABBIT_HUNGER_DECREASE;
    rabbitReproductionThreshold = DEFAULT_RABBIT_REPRODUCTION_THRESHOLD;
    rabbitReproductionChance = DEFAULT_RABBIT_REPRODUCTION_CHANCE;
    rabbitReproductionHungerCost = DEFAULT_RABBIT_REPRODUCTION_HUNGER_COST;
    foxHungerIncrease = DEFAULT_FOX_HUNGER_INCREASE;
    foxHungerDecrease = DEFAULT_FOX_HUNGER_DECREASE;
    foxReproductionThreshold = DEFAULT_FOX_REPRODUCTION_THRESHOLD;
    foxReproductionChance = DEFAULT_FOX_REPRODUCTION_CHANCE;
    foxReproductionHungerCost = DEFAULT_FOX_REPRODUCTION_HUNGER_COST;

    document.getElementById("tickRateRange").value = Math.round((DEFAULT_TICK_RATE / tickRate) * 100) + "%";
    document.getElementById("speedDisplay").textContent = "100%";
    document.getElementById("rabbitHungerDecreaseSlider").value = DEFAULT_RABBIT_HUNGER_DECREASE;
    document.getElementById("rabbitHungerDecreaseInput").value = DEFAULT_RABBIT_HUNGER_DECREASE;
    document.getElementById("rabbitHungerIncreaseSlider").value = DEFAULT_RABBIT_HUNGER_INCREASE;
    document.getElementById("rabbitHungerIncreaseInput").value = DEFAULT_RABBIT_HUNGER_INCREASE;
    document.getElementById("rabbitReproductionThresholdSlider").value = DEFAULT_RABBIT_REPRODUCTION_THRESHOLD;
    document.getElementById("rabbitReproductionThresholdInput").value = DEFAULT_RABBIT_REPRODUCTION_THRESHOLD;
    document.getElementById("rabbitReproductionChanceSlider").value = DEFAULT_RABBIT_REPRODUCTION_CHANCE;
    document.getElementById("rabbitReproductionChanceInput").value = DEFAULT_RABBIT_REPRODUCTION_CHANCE;
    document.getElementById("rabbitReproductionHungerCostSlider").value = DEFAULT_RABBIT_REPRODUCTION_HUNGER_COST;
    document.getElementById("rabbitReproductionHungerCostInput").value = DEFAULT_RABBIT_REPRODUCTION_HUNGER_COST;
    document.getElementById("foxHungerDecreaseSlider").value = DEFAULT_FOX_HUNGER_DECREASE;
    document.getElementById("foxHungerDecreaseInput").value = DEFAULT_FOX_HUNGER_DECREASE;
    document.getElementById("foxHungerIncreaseSlider").value = DEFAULT_FOX_HUNGER_INCREASE;
    document.getElementById("foxHungerIncreaseInput").value = DEFAULT_FOX_HUNGER_INCREASE;
    document.getElementById("foxReproductionThresholdSlider").value = DEFAULT_FOX_REPRODUCTION_THRESHOLD;
    document.getElementById("foxReproductionThresholdInput").value = DEFAULT_FOX_REPRODUCTION_THRESHOLD;
    document.getElementById("foxReproductionChanceSlider").value = DEFAULT_FOX_REPRODUCTION_CHANCE;
    document.getElementById("foxReproductionChanceInput").value = DEFAULT_FOX_REPRODUCTION_CHANCE;
    document.getElementById("foxReproductionHungerCostSlider").value = DEFAULT_FOX_REPRODUCTION_HUNGER_COST;
    document.getElementById("foxReproductionHungerCostInput").value = DEFAULT_FOX_REPRODUCTION_HUNGER_COST;
    document.getElementById("grassSpawnChanceSlider").value = DEFAULT_GRASS_SPAWN_CHANCE;
    document.getElementById("grassSpawnChanceInput").value = DEFAULT_GRASS_SPAWN_CHANCE;
}

function countEntitites(type) {
    let count = 0;
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (cells[i][j].occupant != null && cells[i][j].occupant.type == type) {
                count++;
            }
        }
    }
    return count;
}

function gameLoop() {
    let rabbitCount = countEntitites("rabbit");
    let foxCount = countEntitites("fox");
    console.log("Number of rabbits: " + rabbitCount + " Number of foxes: " + foxCount);
    clearGrid(cells);
    renderGrid(cells);
    renderRabbitPopulationChart();
    renderFoxPopulationChart();
    renderCombinedChart(CHART_WIDTH, CHART_HEIGHT, rabbitPopulationHistory, "#e8d5b0", foxPopulationHistory, "orange");
    document.getElementById("rabbitCount").textContent = "Rabbits: " + rabbitCount
    document.getElementById("foxCount").textContent = "Foxes: " + foxCount
    document.getElementById("combinedCount").textContent = "Rabbits + Foxes: " + (foxCount + rabbitCount)
    tick++;
    if (tick % tickRate == 0) {
        cells = updateGrid(cells);
        updatePopulationHistory(rabbitPopulationHistory, rabbitPopulationHistory.length, rabbitCount);
        updatePopulationHistory(foxPopulationHistory, foxPopulationHistory.length, foxCount);
    }

    requestAnimationFrame(gameLoop);
}

function updatePopulationHistory(populationHistory, length, count) {
    if (length > maxHistory) {
        populationHistory.shift();
    }
    populationHistory.push(count);
}

function createGrid(rows, cols) {
    let grid = []
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = createCell();
        }
    }
    return grid;
}

function populateGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (Math.random() * 100 < grassSpawnChance) {
                grid[i][j].occupant = createGrass();
            }
            else if (Math.random() * 100 < foxSpawnChance) {
                grid[i][j].occupant = createFox();
            }
            else if (Math.random() * 100 < rabbitSpawnChance) {
                grid[i][j].occupant = createRabbit();
            }
        }
    }
}

function renderRabbitPopulationChart() {
    rabbitCtx.strokeStyle = "black";
    rabbitCtx.strokeRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
    rabbitCtx.fillStyle = "#1a1a2e";
    rabbitCtx.fillRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
    if (rabbitPopulationHistory.length == 0) return;
    let max = Math.max(...rabbitPopulationHistory);
    let rabbitPopulationHistoryX;
    let lastValue;
    let rabbitPopulationHistoryY;
    rabbitCtx.strokeStyle = "#e8d5b0"
    rabbitCtx.beginPath();
    for (let i = 0; i < rabbitPopulationHistory.length; i++) {
        rabbitPopulationHistoryX = (i / maxHistory) * CHART_WIDTH;
        lastValue = rabbitPopulationHistory[i];
        rabbitPopulationHistoryY = CHART_HEIGHT - (lastValue / max) * CHART_HEIGHT;
        if (i === 0) {
            rabbitCtx.moveTo(rabbitPopulationHistoryX, rabbitPopulationHistoryY);
        } else {
            rabbitCtx.lineTo(rabbitPopulationHistoryX, rabbitPopulationHistoryY);
        }

    }
    rabbitCtx.lineTo(rabbitPopulationHistoryX, CHART_HEIGHT);
    rabbitCtx.lineTo(0, CHART_HEIGHT);
    rabbitCtx.fillStyle = "rgba(232, 213, 176, 0.3)";
    rabbitCtx.fill();
    rabbitCtx.stroke();
}

function renderFoxPopulationChart() {
    foxCtx.strokeStyle = "black";
    foxCtx.strokeRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
    foxCtx.fillStyle = "#1a1a2e";
    foxCtx.fillRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
    if (foxPopulationHistory.length == 0) return;
    let max = Math.max(...foxPopulationHistory);
    let foxPopulationHistoryX;
    let lastValue;
    let foxPopulationHistoryY;
    foxCtx.strokeStyle = "orange"
    foxCtx.beginPath();
    for (let i = 0; i < foxPopulationHistory.length; i++) {
        foxPopulationHistoryX = (i / maxHistory) * CHART_WIDTH;
        lastValue = foxPopulationHistory[i];
        foxPopulationHistoryY = CHART_HEIGHT - (lastValue / max) * CHART_HEIGHT;
        if (i === 0) {
            foxCtx.moveTo(foxPopulationHistoryX, foxPopulationHistoryY);
        } else {
            foxCtx.lineTo(foxPopulationHistoryX, foxPopulationHistoryY);
        }

    }
    foxCtx.lineTo(foxPopulationHistoryX, CHART_HEIGHT);
    foxCtx.lineTo(0, CHART_HEIGHT);
    foxCtx.fillStyle = "rgba(158, 105, 0, 0.3)";
    foxCtx.fill();
    foxCtx.stroke();
}

function renderCombinedChart(chart1Width, chart1Height, chart1PopHistory, chart1LineColor, chart2PopHistory, chart2LineColor) {
    combinedCtx.strokeStyle = "black";
    combinedCtx.strokeRect(0, 0, chart1Width, chart1Height);
    combinedCtx.fillStyle = "#1a1a2e";
    combinedCtx.fillRect(0, 0, chart1Width, chart1Height);
    if (chart1PopHistory.length == 0) return;
    let max = Math.max(...chart1PopHistory);
    let chart1PopulationHistoryX;
    let lastValue;
    let chart1PopulationHistoryY;
    combinedCtx.strokeStyle = chart1LineColor
    combinedCtx.beginPath();
    for (let i = 0; i < chart1PopHistory.length; i++) {
        chart1PopulationHistoryX = (i / maxHistory) * chart1Width;
        lastValue = chart1PopHistory[i];
        chart1PopulationHistoryY = chart1Height - (lastValue / max) * chart1Height;
        if (i === 0) {
            combinedCtx.moveTo(chart1PopulationHistoryX, chart1PopulationHistoryY);
        } else {
            combinedCtx.lineTo(chart1PopulationHistoryX, chart1PopulationHistoryY);
        }

    }
    combinedCtx.lineTo(chart1PopulationHistoryX, chart1Height);
    combinedCtx.lineTo(0, chart1Height);
    combinedCtx.fillStyle = "rgba(232, 213, 176, 0.3)";
    combinedCtx.fill();
    combinedCtx.stroke();
    document.getElementById("maxRabbitValue").textContent = "Max Rabbit value: " + max;


    if (chart2PopHistory.length == 0) return;
    max = Math.max(...chart2PopHistory);
    let chart2PopulationHistoryX;
    let chart2PopulationHistoryY;
    combinedCtx.strokeStyle = chart2LineColor
    combinedCtx.beginPath();
    for (let i = 0; i < chart2PopHistory.length; i++) {
        chart2PopulationHistoryX = (i / maxHistory) * chart1Width;
        lastValue = chart2PopHistory[i];
        chart2PopulationHistoryY = chart1Height - (lastValue / max) * chart1Height;
        if (i === 0) {
            combinedCtx.moveTo(chart2PopulationHistoryX, chart2PopulationHistoryY);
        } else {
            combinedCtx.lineTo(chart2PopulationHistoryX, chart2PopulationHistoryY);
        }

    }
    combinedCtx.lineTo(chart2PopulationHistoryX, chart1Height);
    combinedCtx.lineTo(0, chart1Height);
    combinedCtx.fillStyle = "rgba(158, 105, 0, 0.3)";
    combinedCtx.fill();
    combinedCtx.stroke();
    document.getElementById("maxFoxValue").textContent = "Max Fox value: " + max;

}

function renderGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].occupant != null) {
                ctx.fillStyle = grid[i][j].occupant.color;
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                ctx.fillStyle = "#c8a96e";
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function clearGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGrid(grid) {

    let newGrid = createGrid(grid.length, grid[0].length);
    let rabbitPositions = findEntities(grid, "rabbit");
    let foxPositions = findEntities(grid, "fox");

    shuffle(rabbitPositions);
    shuffle(foxPositions);

    // First, we copy all the grass to the new grid, so that rabbits can eat it if they move onto it.
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].occupant != null && grid[i][j].occupant.type == "grass") {
                if (newGrid[i][j].occupant == null) {
                    newGrid[i][j].occupant = grid[i][j].occupant;
                }
            }
        }
    }

    // Then we randomly grow new grass on the grid, which may be eaten by rabbits in the next step.
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].occupant == null) {
                if (Math.random() * 100 < 2) {
                    newGrid[i][j].occupant = createGrass();
                }
            }
        }
    }

    // Then we move the rabbits, which may eat the grass if they move onto it.
    for (let i = 0; i < rabbitPositions.length; i++) {
        let pos = rabbitPositions[i];
        if (grid[pos.y][pos.x].occupant != null) {
            if (grid[pos.y][pos.x].occupant.type == "rabbit") {
                moveRabbit(newGrid, grid, pos.y, pos.x);
            } else if (grid[pos.y][pos.x].occupant.type == "grass") {
                if (newGrid[pos.y][pos.x].occupant == null) {
                    newGrid[pos.y][pos.x].occupant = grid[pos.y][pos.x].occupant;
                }
            }
        }
    }

    // Finally we move the foxes, which may eat the rabbits if they move onto them.
    for (let i = 0; i < foxPositions.length; i++) {
        let pos = foxPositions[i];
        if (grid[pos.y][pos.x].occupant != null) {
            if (grid[pos.y][pos.x].occupant.type == "fox") {
                moveFox(newGrid, grid, pos.y, pos.x);
            } else if (grid[pos.y][pos.x].occupant.type == "grass") {
                if (newGrid[pos.y][pos.x].occupant == null) {
                    newGrid[pos.y][pos.x].occupant = grid[pos.y][pos.x].occupant;
                }
            }
        }
    }

    return newGrid;
}

function findEntities(grid, type) {
    let entities = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].occupant != null && grid[i][j].occupant.type == type) {
                entities.push({ x: j, y: i });
            }
        }
    }
    return entities;
}

function moveRabbit(newGrid, oldGrid, x, y) {
    let dir = [...directions];
    shuffle(dir);

    for (let i = 0; i < dir.length; i++) {
        let newX = x + dir[i][0];
        let newY = y + dir[i][1];
        if (newX >= 0 && newX < oldGrid.length && newY >= 0 && newY < oldGrid[0].length) {
            if (newGrid[newX][newY].occupant == null) {
                newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                newGrid[newX][newY].occupant.hunger -= rabbitHungerDecrease;
                if (newGrid[newX][newY].occupant.hunger <= 0) {
                    newGrid[newX][newY].occupant = null;
                }
                if (newGrid[newX][newY].occupant != null && newGrid[newX][newY].occupant.hunger > rabbitReproductionThreshold && Math.random() * 100 < rabbitReproductionChance) {
                    reproduceRabbit(newGrid, newX, newY);
                }
                return;
            } else if (newGrid[newX][newY].occupant.type == "grass") {
                if (oldGrid[x][y].occupant.hunger + rabbitHungerIncrease <= 200) {
                    newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                    newGrid[newX][newY].occupant.hunger += rabbitHungerIncrease;
                    if (oldGrid[x][y].occupant.hunger > rabbitReproductionThreshold && Math.random() * 100 < rabbitReproductionChance) {
                        reproduceRabbit(newGrid, newX, newY);
                    }
                    return;
                } else {
                    newGrid[x][y].occupant = oldGrid[x][y].occupant;
                    newGrid[x][y].occupant.hunger -= rabbitHungerDecrease / 2;
                    if (newGrid[x][y].occupant.hunger <= 0) {
                        newGrid[x][y].occupant = null;
                    }
                    if (oldGrid[x][y].occupant.hunger > rabbitReproductionThreshold && Math.random() * 100 < rabbitReproductionChance) {
                        reproduceRabbit(newGrid, x, y);
                    }
                    return;
                }

            }
        }
    }
    if (newGrid[x][y].occupant == null) {
        newGrid[x][y].occupant = oldGrid[x][y].occupant;
        newGrid[x][y].occupant.hunger -= rabbitHungerDecrease / 2;
        if (newGrid[x][y].occupant.hunger <= 0) {
            newGrid[x][y].occupant = null;
        }
    }
}

function moveFox(newGrid, oldGrid, x, y) {
    let dir = [...directions];
    shuffle(dir);

    for (let i = 0; i < dir.length; i++) {
        let newX = x + dir[i][0];
        let newY = y + dir[i][1];
        if (newX >= 0 && newX < oldGrid.length && newY >= 0 && newY < oldGrid[0].length) {
            if (oldGrid[newX][newY].occupant != null && oldGrid[newX][newY].occupant.type == "rabbit") {
                if (oldGrid[x][y].occupant.hunger + foxHungerIncrease <= 400) {
                    newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                    newGrid[newX][newY].occupant.hunger += foxHungerIncrease;
                    if (oldGrid[x][y].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                        reproduceFox(newGrid, newX, newY);
                    }
                    return;
                } else {
                    newGrid[x][y].occupant = oldGrid[x][y].occupant;
                    newGrid[x][y].occupant.hunger -= foxHungerDecrease / 2;
                    if (newGrid[x][y].occupant.hunger <= 0) {
                        newGrid[x][y].occupant = null;
                    }
                    if (oldGrid[x][y].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                        reproduceFox(newGrid, x, y);
                    }
                    return;
                }
            }
        }

    }

    for (let i = 0; i < dir.length; i++) {
        let newX = x + dir[i][0];
        let newY = y + dir[i][1];
        if (newX >= 0 && newX < oldGrid.length && newY >= 0 && newY < oldGrid[0].length) {
            if (newGrid[newX][newY].occupant == null) {
                newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                newGrid[newX][newY].occupant.hunger -= foxHungerDecrease;
                if (newGrid[newX][newY].occupant.hunger <= 0) {
                    newGrid[newX][newY].occupant = null;
                }
                if (newGrid[newX][newY].occupant != null && newGrid[newX][newY].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                    reproduceFox(newGrid, newX, newY);
                }
                return;
            } else if (newGrid[newX][newY].occupant.type == "rabbit") {
                if (oldGrid[x][y].occupant.hunger + foxHungerIncrease <= 400) {
                    newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                    newGrid[newX][newY].occupant.hunger += foxHungerIncrease;
                    if (oldGrid[x][y].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                        reproduceFox(newGrid, newX, newY);
                    }
                    return;
                } else {
                    newGrid[x][y].occupant = oldGrid[x][y].occupant;
                    newGrid[x][y].occupant.hunger -= foxHungerDecrease / 2;
                    if (newGrid[x][y].occupant.hunger <= 0) {
                        newGrid[x][y].occupant = null;
                    }
                    if (oldGrid[x][y].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                        reproduceFox(newGrid, newX, newY);
                    }
                    return;
                }

            } else if (newGrid[newX][newY].occupant.type == "grass") {
                newGrid[newX][newY].occupant = oldGrid[x][y].occupant;
                newGrid[newX][newY].occupant.hunger -= foxHungerDecrease;
                if (newGrid[newX][newY].occupant.hunger <= 0) {
                    newGrid[newX][newY].occupant = null;
                }
                if (newGrid[newX][newY].occupant != null && newGrid[newX][newY].occupant.hunger > foxReproductionThreshold && Math.random() * 100 < foxReproductionChance) {
                    reproduceFox(newGrid, newX, newY);
                }
                return;
            }
        }
    }
    if (newGrid[x][y].occupant == null) {
        newGrid[x][y].occupant = oldGrid[x][y].occupant;
        newGrid[x][y].occupant.hunger -= foxHungerDecrease / 2;
        if (newGrid[x][y].occupant.hunger <= 0) {
            newGrid[x][y].occupant = null;
        }
    }
}

function reproduceRabbit(grid, x, y) {
    let dir = [...directions];
    shuffle(dir);
    for (let i = 0; i < dir.length; i++) {
        let newX = x + dir[i][0];
        let newY = y + dir[i][1];
        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
            if (grid[newX][newY].occupant == null) {
                grid[newX][newY].occupant = createRabbit();
                grid[x][y].occupant.hunger -= rabbitReproductionHungerCost;
                return;
            }
        }
    }
}

function reproduceFox(grid, x, y) {
    let dir = [...directions];
    shuffle(dir);
    for (let i = 0; i < dir.length; i++) {
        let newX = x + dir[i][0];
        let newY = y + dir[i][1];
        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
            if (grid[newX][newY].occupant == null) {
                grid[newX][newY].occupant = createFox();
                grid[x][y].occupant.hunger -= foxReproductionHungerCost;
                return;
            }
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



function createCell() {
    let cell = { occupant: null };
    return cell;
}

function createGrass() {
    let grass = { color: "#2d6a1f", type: "grass" }
    return grass;
}

function createRabbit() {
    let rabbit = { color: "#e8d5b0", type: "rabbit", hunger: 200 }
    return rabbit;
}

function createFox() {
    let fox = { color: "orange", type: "fox", hunger: 400 }
    return fox;
}