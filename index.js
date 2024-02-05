import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { Dataset, PlaywrightCrawler } from "crawlee";
const customUrl = "https://www.italentdigital.com/";

const crawler = new PlaywrightCrawler({
    // maxRequestsPerCrawl: 50,
    async requestHandler({ page, request, enqueueLinks }) {
        const dom = new JSDOM(await page.content());
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        await Dataset.pushData({
            data: article.textContent,
            url: request.url,
            succeeded: true,
        });
        await enqueueLinks();
    },
    async failedRequestHandler({ request }) {
        await Dataset.pushData({
            url: request.url,
            succeeded: false,
            errors: request.errorMessages,
        });
    },
});

await crawler.run([customUrl]);
