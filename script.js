window.onload = function () {
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
    <span>
    ${link}
        <a href='#' onclick="copyToClip()">click to copy</a>
    </span>
    `);
}

function generateCard(json) {
    if (!json) return;

    if (!json.rows) {
        renderError(json);
        return;
    };

    return json.rows.map(eachRow => {
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


function renderError(err = null) {
    addElementTo(container, `<div id='error-message'>
    ${err ? (typeof err) === 'string' ? err : JSON.stringify(err) : 'Make sure google sheet id is correct'}</div>`);

    setTimeout(() => {
        document.getElementById('error-message').remove();
    }, 8000);
}



function fetchSheet(id, onlyView = false) {
    if (!id || id == '') return;

    const url = `https://gsx2json.com/api?id=${id}`;

    // add loading while fetching data
    addElementTo(container, loadingEle);

    fetch(url)
        .then(res => {
            if (res.status == 200) {
                return res.json();
            }
            else if (res.status == 501) {
                throw new Error("Answer not found");
            }
            else {
                throw new Error("Some other status code");
            }
        })
        .then(json => {
            !onlyView && renderShareLink(id);
            addElementTo(container, generateCard(json));
        })
        .catch(err => {
            renderError();
        });


    // req.onload = function (e) {
    //     req.response && 
    // };

    // req.onerror = (e) => {
    //     console.log('err', e);
    // };
    // req.send();
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

    if (id === '') return;

    fetchSheet(id);
};