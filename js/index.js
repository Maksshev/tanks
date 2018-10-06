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
        this.size = tableWidth * 0.06;
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
                            if (curr[2] < mainTank.offset().left || (mainTank.offset().top < curr[1] || mainTank.offset().top > curr[3])) {
                                curr = 1;
                            } else {
                                curr = 0;
                            }
                            return acc*curr;
                        }, 1);
                        if (mainTank.offset().left > offsetLeft && flag === 1) {
                            console.log(mainTank.offset().top);
                            console.log('left' + mainTank.offset().left);
                            mainTank.css({'right': '+=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 38) {
                mainTank.rotate(-1 * deg);
                deg = 0;
                rotateState = 0;
                if (interval === null) {
                    interval = setInterval(function () {
                        if (mainTank.offset().top > offsetTop) {
                            mainTank.css({'top': '-=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 39) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(90);
                deg = 90;
                rotateState = 90;
                if (interval === null) {
                    interval = setInterval(function () {
                        if ((mainTank.offset().left + mainTank.width()) < offsetRight) {
                            mainTank.css({'right': '-=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 40) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(180);
                deg = 180;
                rotateState = 180;
                if (interval === null) {
                    interval = setInterval(function () {
                        if ((mainTank.offset().top + mainTank.width()) < offsetBottom) {
                            mainTank.css({'top': '+=1'});
                        }
                    }, 10);
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
        bomb.width(tableWidth*0.01).height(tableWidth*0.01).css({position: 'absolute', background: 'black'}).offset({top: bombOffsetTop, left: bombOffsetLeft});
        let interval = setInterval(function () {
            let bombOffsetTop = bomb.offset().top;
            let bombOffsetLeft = bomb.offset().left;
            let bombOffsetRight = bombOffsetLeft + bomb.width();
            let bombOffsetBottom = bombOffsetTop + bomb.width();
            if (bombOffsetTop > offsetTop && bombOffsetLeft > offsetLeft && bombOffsetRight < offsetRight && bombOffsetBottom < offsetBottom) {
                if (tankRotateState === 90) {
                    bomb.css('left', '+=1');
                } else if (tankRotateState === 180) {
                    bomb.css('top', '+=1');
                } else if (tankRotateState === -90) {
                    bomb.css('left', '-=1');
                } else if (tankRotateState === 0) {
                    bomb.css('top', '-=1');
                }
            } else {
                bomb.remove();
                clearInterval(interval);
            }
        }, 1)

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

        $(`table tr:eq(${this._position[0]}) td:eq(${this._position[1]})`).addClass('brick');
        $(`table tr:eq(${this._position[0]}) td:eq(${this._position[1] + 1})`).addClass('brick');
        $(`table tr:eq(${this._position[0] + 1}) td:eq(${this._position[1] + 1})`).addClass('brick');
        $(`table tr:eq(${this._position[0] + 2}) td:eq(${this._position[1] + 1})`).addClass('brick');
        obstacles = $('.brick');
        obstaclesTransform(obstacles);
    }
}


function obstaclesTransform(e) {

    for (let i = 0; i < e.length; i++) {
        let current;
        const obstacle = $(e[i]);
        const offset = obstacle.offset();
        const width = obstacle.width();
        const height = obstacle.height();
        current = [offset.left, offset.top, offset.left + width, offset.top + height];
        obstaclesArr.push(current);
    }
    console.log(obstaclesArr);

}


let a = new Obstacles([0, 0]);
a.set();


let t = new MainTank();
t.setTank();

