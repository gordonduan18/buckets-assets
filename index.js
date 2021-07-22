const Alpaca = require('@alpacahq/alpaca-trade-api')
const yahooFinance = require('yahoo-finance')
const fs = require('fs')

const alpaca = new Alpaca({
    keyId: process.env.API_KEY,
    secretKey: process.env.SECRET_API_KEY,
    paper: true
})

async function retrieveAssets() {
    const assets = await alpaca.getAssets({
        status: 'active'
    });
    let newAssets = {
        table: []
    }
    for (const asset of assets) {
        let url
        try {
            url = await yahooFinance.quote(asset.symbol, ['summaryProfile'])
        } catch (e) {
            url = null
        }
        let newAsset
        const firstName = asset.name.replace(/ .*/, '').toLowerCase()
        if (url !== null && url.summaryProfile.website && firstName !== "blackrock") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "http://logo.clearbit.com/" + url.summaryProfile.website.substring(7)
            }
        } else if (firstName == "invesco") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "http://logo.clearbit.com/invesco.com"
            }
        } else if (firstName == "vanguard") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "http://logo.clearbit.com/vanguard.com"
            }
        } else if (firstName == "fidelity") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "http://logo.clearbit.com/fidelity.com"
            }
        } else if (firstName == "spdr") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "http://logo.clearbit.com/ssga.com"
            }
        } else if (firstName == "blackrock") {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: "https://www.blackrock.com/amer-retail-k-assets/cache-1542297526000/images/media-bin/web/global/wordmark/blackrock-logo-nav.svg"
            }
        } else {
            newAsset = {
                symbol: asset.symbol,
                name: asset.name,
                fractionable: asset.fractionable,
                logo_url: ""
            }
        }
        newAssets.table.push(newAsset)
    }
    var json = JSON.stringify(newAssets)
    fs.writeFile('assets.json', json, function(err) {
        if (err) throw err
        console.log('Saved')
    })
}

retrieveAssets()