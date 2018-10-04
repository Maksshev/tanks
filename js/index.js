const rows = new Array(30).fill('');
const columns = rows;


const markUp = `
    <table id="table">
        ${rows.map(() => `<tr>${columns.map(() => `<td></td>`).join('')}</tr>`).join('')}    
    </table>
`;
