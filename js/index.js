let body = $('body');
let table;
let tableWidth;
let tdHeight;
let tdWidth;
let bombCount = 0;
let offsetTop;
let offsetBottom;
let offsetRight;
let offsetLeft;
let obstaclesOffsetLeft = [];
let obstaclesOffsetRight = [];
let obstaclesOffsetTop;
let obstaclesOffsetBottom;
let obstacles;
let obstaclesArr = [];
let obstaclesBomb;
let obstaclesBombArr = [];
let enemies;
let enemiesArr = [];
let mainTankImg = `img/tanks_svg/tank-yellow-1.svg`;
let enemyTankImg = `img/tanks_svg/tank-red-4.svg`;
let enemyCount = 1;
let mainTankArr = [];

function newGame() {
    location.reload();
}


function initField() {
    $('button').remove();
    body.append(`<button onclick="newGame()">Стоп</button>`);
    const rows = new Array(50).fill('');
    const columns = rows;
    const markUp = `
    <table id="table">
        ${rows.map(() => `<tr>${columns.map(() => `<td></td>`).join('')}</tr>`).join('')}    
    </table>
`;
    body.append(markUp);
    table = $('#table');
    tableWidth = table.width();
    table.height(tableWidth);
    let td = $('#table td:first-of-type');
    tdWidth = td.width();
    tdHeight = td.height();
    const brick1 = new Obstacles([5, 23], 40, 3, 'brick');
    brick1.set();

    const metal1 = new Obstacles([0, 23], 5, 3, 'metal');
    metal1.set();

    const brick2 = new Obstacles([43, 21], 7, 2, 'brick');
    brick2.set();

    const brick3 = new Obstacles([43, 26], 7, 2, 'brick');
    brick3.set();

    const metalAi = new Obstacles([41, 26], 2, 24, 'brick');
    metalAi.set();

    const metalAi1 = new Obstacles([41, 0], 2, 23, 'brick');
    metalAi1.set();

    const metalAi2 = new Obstacles([7, 26], 2, 24, 'brick');
    metalAi2.set();

    const metalAi3 = new Obstacles([7, 0], 2, 23, 'brick');
    metalAi3.set();

    const water = new Obstacles([15, 5], 2, 12, 'water');
    water.set();

    const water1 = new Obstacles([17, 5], 12, 2, 'water');
    water1.set();

    const water2 = new Obstacles([29, 5], 2, 12, 'water');
    water2.set();

    const water3 = new Obstacles([17, 15], 12, 2, 'water');
    water3.set();

    const water4 = new Obstacles([15, 32], 2, 12, 'water');
    water4.set();

    const water5 = new Obstacles([17, 32], 12, 2, 'water');
    water5.set();

    const water6 = new Obstacles([29, 32], 2, 12, 'water');
    water6.set();

    const water7 = new Obstacles([17, 42], 12, 2, 'water');
    water7.set();

    const grass = new Obstacles([17, 7], 12, 8);
    grass.setGrass();

    const grass1 = new Obstacles([17, 34], 12, 8);
    grass1.setGrass();

    let t = new MainTank(mainTankImg, 45, 37, 0);
    t.setTank();

    let enemy1 = new MainTank(enemyTankImg, 0, 41, 180);
    enemy1.setEnemy();

    let enemy = new MainTank(enemyTankImg, 0, 32, 180);
    enemy.setEnemy();

    let enemy2 = new MainTank(enemyTankImg, 0, 14, 180);
    enemy2.setEnemy();

    let enemy3 = new MainTank(enemyTankImg, 0, 5, 180);
    enemy3.setEnemy();
}


class MainTank {
    constructor(image, row, column, rotateState) {
        this._row = row;
        this._column = column;
        this._image = image;
        this.size = tableWidth * 0.055;
        this._rotateState = rotateState;
    }

    setTank() {
        $(`table tr:eq(${this._row}) td:eq(${this._column})`).append(`<img class="0" id="main_tank" src="${this._image}">`);
        const mainTank = $('#main_tank');
        mainTank.width(this.size).height(this.size).css({position: 'absolute'}).rotate(this._rotateState);
        offsetTop = table.offset().top;
        offsetLeft = table.offset().left;
        offsetBottom = offsetTop + tableWidth;
        offsetRight = offsetLeft + tableWidth;
        let deg = 0;
        let interval = null;
        body.keydown(function (e) {
            deg = 0;
            if (e.which === 37) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(-90);
                deg = -90;
                this._rotateState = -90;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[2] + 2 < mainTank.offset().left || (mainTank.offset().top + mainTank.width() < curr[1] || mainTank.offset().top > curr[3])) {
                                curr = 1;
                            } else {
                                if (curr[2] - mainTank.offset().left < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }

                            }
                            return acc*curr;
                        }, 1);
                        if (mainTank.offset().left > offsetLeft && flag) {
                            mainTank.css({'right': '+=1'});
                        }
                    }, 20);
                }
            } else if (e.which === 38) {
                mainTank.rotate({angle: -1 * deg, center: ['48%', '52%']});
                deg = 0;
                this._rotateState = 0;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[3] + 1 < mainTank.offset().top || (mainTank.offset().left + mainTank.width() < curr[0] + 1 || mainTank.offset().left > curr[2] + 1)) {
                                curr = 1;
                            } else {
                                if (curr[3] + 1 - mainTank.offset().top < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc*curr;
                        }, 1);
                        if (mainTank.offset().top > offsetTop && flag) {
                            mainTank.css({'top': '-=1'});
                        }
                    }, 20);
                }
            } else if (e.which === 39) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(90);
                deg = 90;
                this._rotateState = 90;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[0] > mainTank.offset().left + mainTank.width() || (mainTank.offset().top + mainTank.width() < curr[1] || mainTank.offset().top > curr[3])) {
                                curr = 1;
                            } else {
                                if (mainTank.offset().left - curr[0] < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc*curr;
                        }, 1);
                        if ((mainTank.offset().left + mainTank.width()) < offsetRight && flag) {
                            mainTank.css({'right': '-=1'});
                        }
                    }, 20);
                }
            } else if (e.which === 40) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(180);
                deg = 180;
                this._rotateState = 180;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[1] - 1 > (mainTank.offset().top + mainTank.width()) || (mainTank.offset().left + mainTank.width() < curr[0] + 1 || mainTank.offset().left > curr[2] + 1)) {
                                curr = 1;
                            } else {
                                if ((mainTank.offset().top + mainTank.width() - curr[1] + 1) < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc*curr;
                        }, 1);
                        if ((mainTank.offset().top + mainTank.width()) < offsetBottom && flag) {
                            mainTank.css({'top': '+=1'});
                        }
                    }, 20);
                }
            }
        }).keyup(function (e) {
            if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
                clearInterval(interval);
                interval = null;
            } else if (e.which === 32) {
                let bomb = new Bomb(true);
                bomb.startBomb(this._rotateState, mainTank.offset(), mainTank.width(), false);
            }
        })
    }

    setEnemy() {
        $(`table tr:eq(${this._row}) td:eq(${this._column})`).append(`<img class="${enemyCount} enemy" id="main_tank" src="${this._image}">`);
        const mainTank = $(`.${enemyCount}`);
        enemyCount++;
        mainTank.width(this.size).height(this.size).css({position: 'absolute'}).rotate(this._rotateState);
        offsetTop = table.offset().top;
        offsetLeft = table.offset().left;
        offsetBottom = offsetTop + tableWidth;
        offsetRight = offsetLeft + tableWidth;
        let deg = 0;
        let interval = null;
        function random(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        let gameInter = setInterval(function () {


            let ran = random(1, 5);
            if (ran === 1) {
                let ran2 = random(1, 3);
                mainTank.rotate(-1 * deg);
                mainTank.rotate(-90);
                this._rotateState = -90;
                deg = this._rotateState;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[2] + 2 < mainTank.offset().left || (mainTank.offset().top + mainTank.width() < curr[1] || mainTank.offset().top > curr[3])) {
                                curr = 1;
                            } else {
                                if (curr[2] - mainTank.offset().left < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }

                            }
                            return acc * curr;
                        }, 1);
                        if (mainTank.offset().left > offsetLeft && flag && deg === -90) {
                            mainTank.css({'right': '+=3'});
                        }
                    }, 100);
                    setTimeout(function () {
                        let random3 = random(1, 3);
                        clearInterval(interval);
                        interval = null;
                    }, ran2 * 1000);
                }
            } else if (ran === 2) {
                let ran2 = random(1, 3);
                mainTank.rotate({angle: -1 * deg, center: ['48%', '52%']});
                this._rotateState = 0;
                deg = this._rotateState;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[3] + 1 < mainTank.offset().top || (mainTank.offset().left + mainTank.width() < curr[0] + 1 || mainTank.offset().left > curr[2] + 1)) {
                                curr = 1;
                            } else {
                                if (curr[3] + 1 - mainTank.offset().top < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc * curr;
                        }, 1);
                        if (mainTank.offset().top > offsetTop && flag && deg === 0) {
                            mainTank.css({'top': '-=3'});
                        }
                    }, 100);
                    setTimeout(function () {
                        clearInterval(interval);
                        interval = null;
                    }, ran2 * 1000);
                }
            } else if (ran === 3) {
                let ran2 = random(1, 3);
                mainTank.rotate(-1 * deg);
                mainTank.rotate(90);
                this._rotateState = 90;
                deg = this._rotateState;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[0] > mainTank.offset().left + mainTank.width() || (mainTank.offset().top + mainTank.width() < curr[1] || mainTank.offset().top > curr[3])) {
                                curr = 1;
                            } else {
                                if (mainTank.offset().left - curr[0] < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc * curr;
                        }, 1);
                        if ((mainTank.offset().left + mainTank.width()) < offsetRight && flag && deg === 90) {
                            mainTank.css({'right': '-=3'});
                        }
                    }, 100);
                    setTimeout(function () {
                        clearInterval(interval);
                        interval = null;
                    }, ran2 * 1000);
                }
            } else if (ran === 4 || ran === 5) {
                let ran2 = random(1, 3);
                mainTank.rotate(-1 * deg);
                mainTank.rotate(180);
                this._rotateState = 180;
                deg = this._rotateState;
                if (interval === null) {
                    interval = setInterval(function () {
                        let flag = obstaclesArr.reduce(function (acc, curr) {
                            if (curr[1] - 1 > (mainTank.offset().top + mainTank.width()) || (mainTank.offset().left + mainTank.width() < curr[0] + 1 || mainTank.offset().left > curr[2] + 1)) {
                                curr = 1;
                            } else {
                                if ((mainTank.offset().top + mainTank.width() - curr[1] + 1) < tdWidth) {
                                    curr = 0;
                                } else {
                                    curr = 1;
                                }
                            }
                            return acc * curr;
                        }, 1);
                        if ((mainTank.offset().top + mainTank.width()) < offsetBottom && flag && deg === 180) {
                            mainTank.css({'top': '+=3'});
                        }
                    }, 100);
                    setTimeout(function () {
                        clearInterval(interval);
                        interval = null;
                    }, ran2 * 1000);
                }
            }
            let ranBomb = random(0, 1);
            if (ranBomb) {
                let bomb = new Bomb();
                bomb.startBomb(this._rotateState, mainTank.offset(), mainTank.width());
            }
        }, 1000)
    }

}


class Bomb {
    constructor(enemy) {
        this._enemy = enemy;
    }

    startBomb(tankRotateState, tankOffset, tankWidth, enemy) {
        table.append(`<div id="bomb${bombCount}"></div>`);
        const bomb = $(`#bomb${bombCount}`);
        bombCount++;
        let bombOffsetLeft;
        let bombOffsetTop;
        if (tankRotateState === 0) {
            bombOffsetTop = tankOffset.top;
            bombOffsetLeft = tankOffset.left + tankWidth/2.5;
        } else if (tankRotateState === 90) {
            bombOffsetTop = tankOffset.top + tankWidth/2.5;
            bombOffsetLeft = tankOffset.left + tankWidth/1.3;
        } else if (tankRotateState === 180) {
            bombOffsetTop = tankOffset.top + tankWidth*0.9;
            bombOffsetLeft = tankOffset.left + tankWidth/2.2;
        } else  if (tankRotateState === -90) {
            bombOffsetTop = tankOffset.top + tankWidth/2.2;
            bombOffsetLeft = tankOffset.left;
        }
        bomb.width(tableWidth*0.01).height(tableWidth*0.01).css({position: 'absolute', background: 'grey', borderRadius: '50%'}).offset({top: bombOffsetTop, left: bombOffsetLeft});
        let interval = setInterval(function () {
            let bombOffsetTop = bomb.offset().top;
            let bombOffsetLeft = bomb.offset().left;
            let bombOffsetRight = bombOffsetLeft + bomb.width();
            let bombOffsetBottom = bombOffsetTop + bomb.width();
            enemiesTransform();
            mainTransform();
            if (bombOffsetTop > offsetTop && bombOffsetLeft > offsetLeft && bombOffsetRight < offsetRight && bombOffsetBottom < offsetBottom) {
                if (tankRotateState === 90) {
                    let flag = obstaclesBombArr.filter(function (cur) {
                        if (bombOffsetRight > cur[0] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                            if (bombOffsetRight - cur[0] < tdWidth) {
                                return true;
                            }
                        }
                    });
                    let tankFlag;
                    if (enemy === false) {
                        tankFlag = enemiesArr.filter(function (cur) {
                            if (bombOffsetRight > cur[0] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                                if (bombOffsetRight - cur[0] < tdWidth) {
                                    return true;
                                }
                            }
                        });
                    } else {
                        tankFlag = mainTankArr.filter(function (cur) {
                            if (bombOffsetRight > cur[0] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                                if (bombOffsetRight - cur[0] < tdWidth) {
                                    return true;
                                }
                            }
                        });
                    }
                    if (flag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4] - 1}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4] + 1}) td:eq(${flag[0][5]})`).removeClass('brick');
                        obstacles = $('.brick, .metal, .water');
                        obstaclesBomb = $('.brick, .metal');
                        obstaclesBombTransform(obstaclesBomb);
                        obstaclesTransform(obstacles);
                        clearInterval(interval);
                    } else if (tankFlag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        tankFlag[0][4].remove();
                        clearInterval(interval);
                    } else {
                        bomb.css('left', '+=3');
                    }
                } else if (tankRotateState === 180) {
                    let flag = obstaclesBombArr.filter(function (cur) {
                        if (bombOffsetBottom > cur[1] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                            if (bombOffsetBottom - cur[1] < tdHeight) {
                                return true;
                            }
                        }
                    });
                    let tankFlag;
                    if (enemy === false) {
                        tankFlag = enemiesArr.filter(function (cur) {
                            if (bombOffsetBottom > cur[1] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                                if (bombOffsetBottom - cur[1] < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    } else {
                        tankFlag = mainTankArr.filter(function (cur) {
                            if (bombOffsetBottom > cur[1] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                                if (bombOffsetBottom - cur[1] < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    }
                    if (flag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop, left: bombOffsetLeft - tdHeight}).fadeOut(700, function () {
                            this.remove();
                        });
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5] + 1})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5] - 1})`).removeClass('brick');
                        obstacles = $('.brick, .metal, .water');
                        obstaclesBomb = $('.brick, .metal');
                        obstaclesBombTransform(obstaclesBomb);
                        obstaclesTransform(obstacles);
                        clearInterval(interval);
                    } else if (tankFlag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        tankFlag[0][4].remove();
                        clearInterval(interval);
                    } else {
                        bomb.css('top', '+=3');
                    }
                } else if (tankRotateState === -90) {
                    let flag = obstaclesBombArr.filter(function (cur) {
                        if (bombOffsetLeft < cur[2] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                            if (cur[2] - bombOffsetLeft < tdWidth) {
                                return true;
                            }
                        }
                    });
                    let tankFlag;
                    if (enemy === false) {
                        tankFlag = enemiesArr.filter(function (cur) {
                            if (bombOffsetLeft < cur[2] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                                if (cur[2] - bombOffsetLeft < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    } else {
                        tankFlag = mainTankArr.filter(function (cur) {
                            if (bombOffsetLeft < cur[2] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                                if (cur[2] - bombOffsetLeft < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    }
                    if (flag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4] - 1}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4] + 1}) td:eq(${flag[0][5]})`).removeClass('brick');
                        obstacles = $('.brick, .metal, .water');
                        obstaclesBomb = $('.brick, .metal');
                        obstaclesBombTransform(obstaclesBomb);
                        obstaclesTransform(obstacles);
                        clearInterval(interval);
                    } else if (tankFlag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        tankFlag[0][4].remove();
                        clearInterval(interval);
                    } else {
                        bomb.css('left', '-=3');
                    }
                } else if (tankRotateState === 0) {
                    let flag = obstaclesBombArr.filter(function (cur) {
                        if (bombOffsetTop > cur[3] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                            if (bombOffsetTop - cur[3] < tdHeight) {
                                return true;
                            }
                        }
                    });
                    let tankFlag;
                    if (enemy === false) {
                        tankFlag = enemiesArr.filter(function (cur) {
                            if (bombOffsetTop > cur[3] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                                if (bombOffsetTop - cur[3] < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    } else {
                        tankFlag = mainTankArr.filter(function (cur) {
                            if (bombOffsetTop > cur[3] && bombOffsetRight > cur[0] && bombOffsetLeft < cur[2]) {
                                if (bombOffsetTop - cur[3] < tankWidth) {
                                    return true;
                                }
                            }
                        });
                    }
                    if (flag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop, left: bombOffsetLeft - tdHeight}).fadeOut(700, function () {
                            this.remove();
                        });
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5]})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5] + 1})`).removeClass('brick');
                        $(`table tr:eq(${flag[0][4]}) td:eq(${flag[0][5] - 1})`).removeClass('brick');
                        obstacles = $('.brick, .metal, .water');
                        obstaclesBomb = $('.brick, .metal');
                        obstaclesBombTransform(obstaclesBomb);
                        obstaclesTransform(obstacles);
                        clearInterval(interval);
                    } else if (tankFlag[0] !== undefined) {
                        bomb.addClass('bang').width(tdWidth*3).height(tdHeight*3).offset({top: bombOffsetTop - tdHeight, left: bombOffsetLeft}).fadeOut(700, function () {
                            this.remove();
                        });
                        tankFlag[0][4].remove();
                        clearInterval(interval);
                    } else {
                        bomb.css('top', '-=3');
                    }
                }
            } else {
                bomb.remove();
                clearInterval(interval);
            }
        }, 15)

    }
}

class Obstacles {
    constructor(position, width, length, type) {
        this._position = position;
        this._width = width;
        this._length = length;
        this._type = type;
    }

    set() {
        for (let i = this._position[0]; i < this._position[0] + this._width; i++) {
            for (let j = this._position[1]; j < this._position[1] + this._length; j++) {
                if (this._type === 'brick') {
                    $(`table tr:eq(${i}) td:eq(${j})`).addClass('brick');
                } else if (this._type === 'metal') {
                    $(`table tr:eq(${i}) td:eq(${j})`).addClass('metal');
                } else if (this._type === 'water') {
                    $(`table tr:eq(${i}) td:eq(${j})`).addClass('water');
                } else if (this._type === 'grass') {
                    $(`table tr:eq(${i}) td:eq(${j})`).addClass('grass');
                }
            }
        }


        obstacles = $('.brick, .metal, .water');
        obstaclesBomb = $('.brick, .metal');
        obstaclesBombTransform(obstaclesBomb);
        obstaclesTransform(obstacles);
    }

    setGrass() {
        for (let i = this._position[0]; i < this._position[0] + this._width; i++) {
            for (let j = this._position[1]; j < this._position[1] + this._length; j++) {
                let td = $(`table tr:eq(${i}) td:eq(${j})`);
                if (!td.hasClass('brick') && !td.hasClass('metal') && !td.hasClass('water')) {
                    td.addClass('grass');
                }
            }
        }
    }

}

function obstaclesBombTransform(e) {
    obstaclesBombArr = [];
    for (let i = 0; i < e.length; i++) {
        let current;
        const obstacle = $(e[i]);
        const offset = obstacle.offset();
        const width = obstacle.width();
        const height = obstacle.height();
        const row = obstacle.parent().index();
        const  column = obstacle.index();
        current = [offset.left, offset.top, offset.left + width, offset.top + height, row, column];
        obstaclesBombArr.push(current);
    }
}


function obstaclesTransform(e) {
    obstaclesArr = [];
    for (let i = 0; i < e.length; i++) {
        let current;
        const obstacle = $(e[i]);
        const offset = obstacle.offset();
        const width = obstacle.width();
        const height = obstacle.height();
        current = [offset.left, offset.top, offset.left + width, offset.top + height];
        obstaclesArr.push(current);
    }

}

function enemiesTransform() {
    enemiesArr = [];
    for (let i = 1; i < enemyCount; i++) {
        const enemy = $(`.${i}`);
        if (enemy.offset() !== undefined) {
            const enemyOffset = enemy.offset();
            const enemyWidth = enemy.width();
            const enemyArr = [enemyOffset.left, enemyOffset.top, enemyOffset.left + enemyWidth, enemyOffset.top + enemyWidth, enemy]
            enemiesArr.push(enemyArr);
        }
    }
}

function mainTransform() {
    mainTankArr = [];
    const main = $('.0');
    const mainOffset = main.offset();
    const width = main.width();
    if (mainOffset !== undefined) {
        const push = [mainOffset.left, mainOffset.top, mainOffset.left + width, mainOffset.top + width, main];
        mainTankArr.push(push);
    }
}









