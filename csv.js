"user strict";
// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
// を基に、改行に対応するよう改変
function CSVtoArray(text) {
    var re_value_col = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*?))\s*(?:,|$)/g;
    let re_value_row = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*?))(,(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*?))\s*)*?\s*(?:\n|\r|$)/g;

    var a = [];
    let b = [];
    text.replace(re_value_row, replacer1);
    // Handle special case of empty last value.
    // if (/,\s*$/.test(text)) a.push('');
    // console.log(a);
    return a;

    function replacer1(match) {
        // console.log(match)
        b = [];
        match.replace(re_value_col, replacer2);
         a.push(b);
        return ''; // Return empty string.
    }
    function replacer2(m0, m1, m2, m3, m4) {
        // console.log(m0, m1, m2, m3, m4);
        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) b.push(m1.replace(/\\'/g, "'"));
        // Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) b.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) b.push(m3);
    }

};

async function CSVsImport(urls) {
    let data={};
    await Promise.all(Object.entries(urls).map(get));
    // await Promise.all(urls.map(get));

    // console.log(data);
    return data;

    async function get([key,val]) {
        const res = await fetch(val);
        const text = await res.text();
        data[key] = CSVtoArray(text);
    }
}