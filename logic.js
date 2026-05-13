let canvas = document.querySelector("canvas");
let cells = [];
const ctx = canvas.getContext("2d");
let directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
let tick = 0;
let tickRate = 10;
const CELL_SIZE = 16;
const GRID_WIDTH = 32;
const GRID_HEIGHT = 32;
let grassSpawnChance = 5;
let rabbitSpawnChance = 10;
let foxSpawnChance = 0.5;
let rabbitHungerIncrease = 25;
let rabbitHungerDecrease = 10;
let rabbitReproductionThreshold = 150;
let rabbitReproductionChance = 20;
let rabbitReproductionHungerCost = 50;
let foxHungerIncrease = 20;
let foxHungerDecrease = 25;
let foxReproductionThreshold = 200;
let foxReproductionChance = 5;
let foxReproductionHungerCost = 100;
let maxHistory = 200;
let rabbitPopulationHistory = [];
let foxPopulationHistory = [];
const RABBIT_CHART_X = 620;
const RABBIT_CHART_Y = 10;
const FOX_CHART_X = 620;
const FOX_CHART_Y = 200;
const CHART_WIDTH = 500;
const CHART_HEIGHT = 150;


cells = createGrid(GRID_WIDTH, GRID_HEIGHT);
populateGrid(cells);
gameLoop();

document.getElementById("tickRateRange").addEventListener("input", function () {
    tickRate = 101 - this.value
    document.getElementById("speedDisplay").textContent = this.value;
});

function reset() {
    cells = createGrid(GRID_WIDTH, GRID_HEIGHT);
    populateGrid(cells);
    rabbitPopulationHistory = [];
    foxPopulationHistory = [];
    tick = 0;
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
    renderCombinedChart(620, 400, CHART_WIDTH, CHART_HEIGHT, rabbitPopulationHistory, "#e8d5b0", foxPopulationHistory, "orange");
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Rabbits: " + rabbitCount, 536, 45);
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Foxes: " + foxCount, 536, 245);
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
    ctx.strokeStyle = "black";
    ctx.strokeRect(RABBIT_CHART_X, RABBIT_CHART_Y, CHART_WIDTH, CHART_HEIGHT);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(RABBIT_CHART_X, RABBIT_CHART_Y, CHART_WIDTH, CHART_HEIGHT);
    if (rabbitPopulationHistory.length == 0) return;
    let max = Math.max(...rabbitPopulationHistory);
    let rabbitPopulationHistoryX;
    let lastValue;
    let rabbitPopulationHistoryY;
    ctx.strokeStyle = "#e8d5b0"
    ctx.beginPath();
    for (let i = 0; i < rabbitPopulationHistory.length; i++) {
        rabbitPopulationHistoryX = RABBIT_CHART_X + (i / maxHistory) * CHART_WIDTH;
        lastValue = rabbitPopulationHistory[i];
        rabbitPopulationHistoryY = RABBIT_CHART_Y + CHART_HEIGHT - (lastValue / max) * CHART_HEIGHT;
        if (i === 0) {
            ctx.moveTo(rabbitPopulationHistoryX, rabbitPopulationHistoryY);
        } else {
            ctx.lineTo(rabbitPopulationHistoryX, rabbitPopulationHistoryY);
        }

    }
    ctx.lineTo(rabbitPopulationHistoryX, RABBIT_CHART_Y + CHART_HEIGHT);
    ctx.lineTo(RABBIT_CHART_X, RABBIT_CHART_Y + CHART_HEIGHT);
    ctx.fillStyle = "rgba(232, 213, 176, 0.3)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Max value: " + max, 520, 125);
}

function renderFoxPopulationChart() {
    ctx.strokeStyle = "black";
    ctx.strokeRect(FOX_CHART_X, FOX_CHART_Y, CHART_WIDTH, CHART_HEIGHT);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(FOX_CHART_X, FOX_CHART_Y, CHART_WIDTH, CHART_HEIGHT);
    if (foxPopulationHistory.length == 0) return;
    let max = Math.max(...foxPopulationHistory);
    let foxPopulationHistoryX;
    let lastValue;
    let foxPopulationHistoryY;
    ctx.strokeStyle = "orange"
    ctx.beginPath();
    for (let i = 0; i < foxPopulationHistory.length; i++) {
        foxPopulationHistoryX = FOX_CHART_X + (i / maxHistory) * CHART_WIDTH;
        lastValue = foxPopulationHistory[i];
        foxPopulationHistoryY = FOX_CHART_Y + CHART_HEIGHT - (lastValue / max) * CHART_HEIGHT;
        if (i === 0) {
            ctx.moveTo(foxPopulationHistoryX, foxPopulationHistoryY);
        } else {
            ctx.lineTo(foxPopulationHistoryX, foxPopulationHistoryY);
        }

    }
    ctx.lineTo(foxPopulationHistoryX, FOX_CHART_Y + CHART_HEIGHT);
    ctx.lineTo(FOX_CHART_X, FOX_CHART_Y + CHART_HEIGHT);
    ctx.fillStyle = "rgba(158, 105, 0, 0.3)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Max value: " + max, 520, 325);
}

function renderCombinedChart(chart1X, chart1Y, chart1Width, chart1Height, chart1PopHistory, chart1LineColor, chart2PopHistory, chart2LineColor) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(chart1X, chart1Y, chart1Width, chart1Height);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(chart1X, chart1Y, chart1Width, chart1Height);
    if (chart1PopHistory.length == 0) return;
    let max = Math.max(...chart1PopHistory);
    let chart1PopulationHistoryX;
    let lastValue;
    let chart1PopulationHistoryY;
    ctx.strokeStyle = chart1LineColor
    ctx.beginPath();
    for (let i = 0; i < chart1PopHistory.length; i++) {
        chart1PopulationHistoryX = chart1X + (i / maxHistory) * chart1Width;
        lastValue = chart1PopHistory[i];
        chart1PopulationHistoryY = chart1Y + chart1Height - (lastValue / max) * chart1Height;
        if (i === 0) {
            ctx.moveTo(chart1PopulationHistoryX, chart1PopulationHistoryY);
        } else {
            ctx.lineTo(chart1PopulationHistoryX, chart1PopulationHistoryY);
        }

    }
    ctx.lineTo(chart1PopulationHistoryX, chart1Y + chart1Height);
    ctx.lineTo(chart1X, chart1Y + chart1Height);
    ctx.fillStyle = "rgba(232, 213, 176, 0.3)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Max Rabbit value: " + max, chart1X, chart1Y + 180);

    if (chart2PopHistory.length == 0) return;
    max = Math.max(...chart2PopHistory);
    let chart2PopulationHistoryX;
    let chart2PopulationHistoryY;
    ctx.strokeStyle = chart2LineColor
    ctx.beginPath();
    for (let i = 0; i < chart2PopHistory.length; i++) {
        chart2PopulationHistoryX = chart1X + (i / maxHistory) * chart1Width;
        lastValue = chart2PopHistory[i];
        chart2PopulationHistoryY = chart1Y + chart1Height - (lastValue / max) * chart1Height;
        if (i === 0) {
            ctx.moveTo(chart2PopulationHistoryX, chart2PopulationHistoryY);
        } else {
            ctx.lineTo(chart2PopulationHistoryX, chart2PopulationHistoryY);
        }

    }
    ctx.lineTo(chart2PopulationHistoryX, chart1Y + chart1Height);
    ctx.lineTo(chart1X, chart1Y + chart1Height);
    ctx.fillStyle = "rgba(158, 105, 0, 0.3)";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Max Fox value: " + max, chart1X + 250, chart1Y+ 180);

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

function interact(occupant1, occupant2, x, y, x2, y2) {
    if (occupant1.type == "rabbit" && occupant2.type == "rabbit") {
        while (true) {
            let dir = directions[Math.floor(Math.random() * directions.length)];
            if (dir[0] != x && dir[0] != x2 && dir[1] != y && dir[1] != y2) {
                break;
            }
        }
        return createRabbit();
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