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

function initField() {
    const rows = new Array(50).fill('');
    const columns = rows;
    const markUp = `
    <table id="table">
        ${rows.map(() => `<tr>${columns.map(() => `<td></td>`).join('')}</tr>`).join('')}    
    </table>
`;
    body.html(markUp);
    table = $('#table');
    tableWidth = table.width();
    table.height(tableWidth);
    let td = $('#table td:first-of-type');
    tdWidth = td.width();
    tdHeight = td.height();
}

initField();

class MainTank {
    constructor(speed) {
        this.image = `img/tanks_svg/tank-yellow-1.svg`;
        this.size = tableWidth * 0.055;
    }

    setTank() {
        table.append(`<img id="main_tank" src="${this.image}">`);
        const mainTank = $('#main_tank');
        mainTank.width(this.size).height(this.size).css({position: 'absolute', top: '0'});
        offsetTop = table.offset().top;
        offsetLeft = table.offset().left;
        offsetBottom = offsetTop + tableWidth;
        offsetRight = offsetLeft + tableWidth;
        let deg = 0;
        let rotateState = 0;
        let interval = null;
        body.keydown(function (e) {
            deg = 0;
            if (e.which === 37) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(-90);
                deg = -90;
                rotateState = -90;
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
                            console.log(mainTank.offset().top);
                            console.log('left' + mainTank.offset().left);
                            mainTank.css({'right': '+=1'});
                        }
                    }, 20);
                }
            } else if (e.which === 38) {
                mainTank.rotate({angle: -1 * deg, center: ['48%', '52%']});
                deg = 0;
                rotateState = 0;
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
                rotateState = 90;
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
                rotateState = 180;
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
                let bomb = new Bomb();
                bomb.startBomb(rotateState, mainTank.offset(), mainTank.width());
            }
        })
    }
}


class Bomb {
    constructor(mainTank) {
        if (mainTank === true) {
            this.speed = 5;
        } else {
            this.speed = 10;
        }
    }

    startBomb(tankRotateState, tankOffset, tankWidth) {
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
            if (bombOffsetTop > offsetTop && bombOffsetLeft > offsetLeft && bombOffsetRight < offsetRight && bombOffsetBottom < offsetBottom) {
                if (tankRotateState === 90) {
                    let flag = obstaclesBombArr.filter(function (cur) {
                        if (bombOffsetRight > cur[0] && bombOffsetBottom > cur[1] && bombOffsetTop < cur[3]) {
                            if (bombOffsetRight - cur[0] < tdWidth) {
                                return true;
                            }
                        }
                    });
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
    console.log(obstaclesBombArr);
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


const brick1 = new Obstacles([5, 23], 40, 3, 'brick');
brick1.set();

const metal1 = new Obstacles([0, 23], 5, 3, 'metal');
metal1.set();

const brick2 = new Obstacles([43, 21], 7, 2, 'brick');
brick2.set();

const brick3 = new Obstacles([43, 26], 7, 2, 'brick');
brick3.set();

const metalAi = new Obstacles([4, 32], 1, 3, 'metal');
metalAi.set();

const metalAi1 = new Obstacles([4, 41], 1, 3, 'metal');
metalAi1.set();

const metalAi2 = new Obstacles([4, 14], 1, 3, 'metal');
metalAi2.set();

const metalAi3 = new Obstacles([4, 5], 1, 3, 'metal');
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







let t = new MainTank();
t.setTank();

