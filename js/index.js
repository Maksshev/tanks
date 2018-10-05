let body = $('body');
let table;
let tableWidth;
let bombCount = 0;
let offsetTop;
let offsetBottom;
let offsetRight;
let offsetLeft;

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
                        if (mainTank.offset().left > offsetLeft) {
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
            } else if (e.which === 32) {
                let bomb = new Bomb();
                bomb.startBomb(rotateState, mainTank.offset(), mainTank.width());
            }
        }).keyup(function (e) {
            if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
                clearInterval(interval);
                interval = null;
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


let t = new MainTank();
t.setTank();

