export default function (url) {
    return new Promise((res, rej) => {
        const Http = new XMLHttpRequest();

        Http.open("GET", url);
        Http.timeout = 10000;
        Http.send();
        Http.onload = function () {
            try {
                res(JSON.parse(Http.responseText));
            }
            catch (e) {
                console.error("An error occured when parsing the response after loading '" + url + "':", e);
                rej(e);
            }
        };
        Http.onerror = function (e) {
            console.error("An error occured when trying to fetch services from '" + url + "':", e);
            rej(e);
        };
    });
}