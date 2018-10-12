const puppeteer = require('puppeteer');

const url = process.argv[2];
const imageResultName = process.argv[3];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // count size of data
    // https://stackoverflow.com/questions/48263345/how-can-i-get-the-raw-download-size-of-a-request-using-puppeteer
    const resources = {};
    page._client.on('Network.dataReceived', (event) => {
        const request = page._networkManager._requestIdToRequest.get(
            event.requestId
        );
        if (request && request.url().startsWith('data:')) {
            return;
        }
        const url = request.url();
        // encodedDataLength is supposed to be the amount of data received
        // over the wire, but it's often 0, so just use dataLength for consistency.
        // https://chromedevtools.github.io/devtools-protocol/tot/Network/#event-dataReceived
        // const length = event.encodedDataLength > 0 ?
        //     event.encodedDataLength : event.dataLength;
        const length = event.dataLength;
        if (url in resources) {
            resources[url] += length;
        } else {
            resources[url] = length;
        }
    });

    // https://gist.github.com/malyw/b4e8284e42fdaeceab9a67a9b0263743

    // Adjustments particular to this page to ensure we hit desktop breakpoint.
    page.setViewport({width: 2880, height: 1800, deviceScaleFactor: 1});

    await page.goto(url, {waitUntil: 'networkidle2'});

    /**
     * Takes a screenshot of a DOM element on the page, with optional padding.
     *
     * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
     * @return {!Promise<!Buffer>}
     */
    async function screenshotDOMElement(opts = {}) {
        const padding = 'padding' in opts ? opts.padding : 0;
        const path = 'path' in opts ? opts.path : null;
        const selector = opts.selector;

        if (!selector)
            throw Error('Please provide a selector.');

        const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            if (!element)
                return null;
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
        }, selector);

        if (!rect)
            throw Error(`Could not find element that matches selector: ${selector}.`);

        return await page.screenshot({
            path,
            clip: {
                x: rect.left - padding,
                y: rect.top - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2
            }
        });
    }

    await screenshotDOMElement({
        path: imageResultName,
        selector: 'body',
        padding: 16
    });

    const totalUncompressedBytes = Object.values(resources).reduce((a, n) => a + n, 0);
    console.log(totalUncompressedBytes);

    browser.close();
})();
