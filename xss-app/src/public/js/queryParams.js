const getAllQueryParams = () => {
    const params = new URLSearchParams(document.location.search);
    const paramObj = {};
    for(let value of params.keys()) {
        paramObj[value] = params.get(value);
    }

    return paramObj;
}

const displayQueryParams = () => {
    const queryParamsTable = document.querySelector('#queryParamsTable');
    const queryParamsObj = getAllQueryParams();

    if (queryParamsTable == null) return;

    for (let key in queryParamsObj) {
        if (key === 'q') continue;

        const name = key;
        const value = queryParamsObj[key];

        const tr = document.createElement('tr');
        const nameTd = document.createElement('td');
        const valueTd = document.createElement('td');

        nameTd.innerHTML = name; // do not use innerHTML
        valueTd.innerHTML = value; // do not use innerHTML

        tr.appendChild(nameTd);
        tr.appendChild(valueTd);

        queryParamsTable.appendChild(tr);
    }
};

displayQueryParams();
