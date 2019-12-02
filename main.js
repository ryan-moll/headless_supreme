const puppeteer = require('puppeteer');
var key = "Um4zf2yx7f4", destination;

(async () => {
    const browser = await puppeteer.launch();
    try{
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        await page.goto('https://www.supremenewyork.com/shop/all');
        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
        


        // await page.evaluate(() => {
        //       $('img[alt="Um4zf2yx7f4"]').click();
        // });
        await page.click('img[alt="Um4zf2yx7f4"]', {waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
        await page.waitFor(500);
        await page.screenshot({path: 'a.png', fullPage: true});

        await page.evaluate(() => {
            // https://stackoverflow.com/a/38032099/10339275
            $('option').filter(function() {
                return $.trim($(this).text()) == "Large";
            }).prop('selected', true);
        });
        await page.screenshot({path: 'b.png', fullPage: true});

        // Enables logging within evaluate for debugging
        /* page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`${i}: ${msg.args()[i]}`);
        }); */

        await page.evaluate(() => {
            //window.location.href = document.getElementById("cart-addf").action;
            //console.log(document.getElementById("cart-addf").action);
            document.getElementById("cart-addf").submit();
        });
        await page.waitFor(300);

        await page.goto('https://www.supremenewyork.com/shop/cart', {timeout: 20000, waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
        await page.screenshot({path: 'c.png', fullPage: true});

        await page.goto('https://www.supremenewyork.com/checkout', {timeout: 20000, waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']});
        await page.screenshot({path: 'd.png', fullPage: true});

        await page.$eval('#order_billing_name', e => e.value = 'Eric Wills');
        await page.$eval('#order_email', e => e.value = 'ericwills@email.com');
        await page.$eval('#order_tel', e => e.value = '5415555555');
        await page.$eval('#bo', e => e.value = '1234 University St');
        await page.$eval('#order_billing_zip', e => e.value = '97401');
        await page.$eval('#order_billing_city', e => e.value = 'Eugene');
        await page.select('#order_billing_state', 'OR')
        await page.$eval('#rnsnckrn', e => e.value = '1234567890123456');
        await page.select('#credit_card_month', '01')
        await page.select('#credit_card_year', '2022')
        await page.$eval('#orcer', e => e.value = '111');
        await page.$eval('#order_terms', e => e.value = true);

        await page.waitFor(300);
        await page.screenshot({path: 'e.png', fullPage: true});
        //await page.evaluate(() => {document.getElementById("checkout_form").submit();});

        // Captcha: https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0
        
    } catch(err){
        console.error(err.message);
    } finally{
        await browser.close();
    }
})();