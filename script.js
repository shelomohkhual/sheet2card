window.onload = function () {
    if (window.location.host === "127.0.0.1:5500") return;

    const id = window.location.pathname.split('/')[1];
    if (!id || id === '' || id === '/') return;
    fetchSheet(id);
};
const container = document.getElementById('card-list-container');

const loadingEle = `<div id='loading'>
<div class="load">
  <div class="loading-line"></div>
  <div class="loading-line"></div>
  <div class="loading-line"></div>
</div></div>`;

function addElementTo(parentEle, childrenEle) {
    parentEle.innerHTML = childrenEle;
}

function generateCard(json) {
    if (!json) return;


    const parsed = JSON.parse(json);
    console.log('data', json);
    if (!parsed.rows) {
        renderError(parsed);
        return;
    };

    return parsed.rows.map(eachRow => {
        const keys = Object.keys(eachRow);
        const values = Object.values(eachRow);

        const cardList = keys.map((k, kIndex) =>
            `<li class='card-li'>
                <span class='card-label'>${k}:</span>
                ${values[kIndex]}
            </li>`
        );

        return `<div class='card'>
        ${cardList.join('')}
        </div>`;
    });
};


function renderError(err) {
    addElementTo(container, `<div id='error-message'>
    ${(typeof err) === 'string' ? err : JSON.stringify(err)}</div>`);

    setTimeout(() => {
        document.getElementById('error-message').remove();
    }, 8000);
}



function fetchSheet() {
    if (!id || id == '') return;

    const url = `https://gsx2json.com/api?id=${id}`;
    var req = new XMLHttpRequest();
    req.open("GET", url, true);

    // add loading while fetching data
    addElementTo(container, loadingEle);

    req.onload = function (e) {
        addElementTo(container, generateCard(req.response));
    };
    req.send();
};

function onAddGSheetUrl() {
    var value = document.getElementById('input').value;

    // remove previous children elements
    container.innerHTML = '';

    value !== '' &&
        fetchSheet(value);
};