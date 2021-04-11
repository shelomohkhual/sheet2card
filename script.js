window.onload = function () {
    generateBGColor();
    const params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id || id === '') return;
    removeForm();
    fetchSheet(id, true);
};
function removeForm() {
    document.getElementById('form').remove();
}

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


function renderShareLink(id) {
    var host = window.location.origin;
    var link = `${host}?id=${id}`;

    createTextAreaLink(link);

    addElementTo(document.getElementById('share-link'), `
    <div>
    ${link}
    <br/>
        <a href='#' onclick="copyToClip()">click to copy</a>
    </div>
    `);
}

function generateCard(list) {
    if (!list || list.length === 0) {
        renderError(list);
        return;
    };
    var keys = [];

    return list.map((eachRow, rIndex) => {
        if (rIndex === 0) {
            keys = eachRow;
            return;
        }

        if (!keys.length) return;

        const cardList = eachRow.map((value, kIndex) => {

            const label = keys[kIndex];
            const isMyanmarUnicode = label.match(/[\u1000-\u109F]+/g);
            const labelClass = isMyanmarUnicode ? "card-label-small" : 'card-label';

            return value !== '' ? `<li class='card-li'>
            <div class='row-container'>
                <div class=${labelClass}>${label}:</div>
                ${value}
                </div>
            </li > `: '';
        });
        return `<div class='card' >
            ${cardList.join('')}
        </div > `;
    });
};


function renderError(err = null) {
    addElementTo(container, `<div id = 'error-message'>
    ${err ? (typeof err) === 'string' && err !== {} ? err : JSON.stringify(err) : 'Make sure google sheet id is correct or published'
        }</div >`);

    setTimeout(() => {
        document.getElementById('error-message').remove();
    }, 8000);
}



function fetchSheet(id, onlyView = false) {
    if (!id || id == '') return;

    const url = `https://sheet.thesimpleapi.com/${id}`;
    // add loading while fetching data
    addElementTo(container, loadingEle);

    fetch(url)
        .then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                renderError();
            }
        })
        .then(list => {
            if (!list) return;
            !onlyView && renderShareLink(id);]addElementTo(container, generateCard(list).join(''));
        })
        .catch(err => {
            console.log('err', err);
            renderError();
        });
};

function copyToClip() {
    const el = document.getElementById('text-copy');
    el.select();
    document.execCommand('copy');
}

const createTextAreaLink = (str) => {
    const el = document.createElement('textarea');
    el.setAttribute("id", "text-copy");
    el.value = str;
    document.body.appendChild(el);
};

function onAddGSheetUrl() {
    var id = document.getElementById('input').value;

    // remove previous children elements
    container.innerHTML = '';
    document.getElementById('share-link').innerHTML = '';

    if (id === '') return;

    fetchSheet(id);
};

function generateBGColor() {
    const randomHSLColor = `hsl(${Math.floor(Math.random() * 360)}deg,100%,88%)`;
    var cssRoot = document.querySelector(':root');

    cssRoot.style.setProperty('--bg-color', randomHSLColor);
}