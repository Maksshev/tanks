let body = $('body');
let table;
let tableWidth;

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
        let interval = null;
        body.keydown(function (e) {
            let deg = 0;
            if (e.which === 37) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(-90);
                deg = -90;
                if (interval === null) {
                    interval = setInterval(function () {
                        if (mainTank.offset().left > table.offset().left) {
                            mainTank.css({'right': '+=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 38) {
                mainTank.rotate(-1 * deg);
                deg = 0;
                if (interval === null) {
                    interval = setInterval(function () {
                        if (mainTank.offset().top > table.offset().top) {
                            mainTank.css({'top': '-=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 39) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(90);
                deg = 90;
                if (interval === null) {
                    interval = setInterval(function () {
                        if ((mainTank.offset().left + mainTank.width()) < (table.offset().left + table.width())) {
                            mainTank.css({'right': '-=1'});
                        }
                    }, 10);
                }
            } else if (e.which === 40) {
                mainTank.rotate(-1 * deg);
                mainTank.rotate(180);
                deg = 180;
                if (interval === null) {
                    interval = setInterval(function () {
                        if ((mainTank.offset().top + mainTank.width()) < (table.offset().top + table.width())) {
                            mainTank.css({'top': '+=1'});
                        }
                    }, 10);
                }
            }
        }).keyup(function (e) {
            if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
                clearInterval(interval);
                interval = null;
            }
        })
    }
}

let t = new MainTank();

t.setTank();

