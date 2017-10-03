const fetch = require('node-fetch')
const fs = require('fs')
const oldColors = require('../data/brandColors.js')._brandColors
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
})

const naturalObjectSort = object =>
  Object.keys(object)
    .sort(collator.compare)
    .reduce((all, c) => {
      all[c] = object[c]
      return all
    }, {})

async function run() {
  const response = await fetch('https://brandcolors.net')
  const body = await response.text()
  const colors = JSON.parse(
    body
      .match(/<script\b[^>]*>var bcBrands = ([\s\S]*?)<\/script>/gim)[0]
      .replace('<script>var bcBrands = ', '')
      .replace(';</script>', '')
  )

  const newColors = Object.keys(colors).reduce((all, k) => {
    colors[k].colors.map((color, index) => {
      all[
        `${colors[k].slug}${index !== 0 ? `-${index + 1}` : ''}`
      ] = `#${color}`
    })
    return all
  }, {})

  const sortedOldColors = naturalObjectSort(oldColors)
  const sortedNewColors = naturalObjectSort(newColors)
  const sortedMergedColors = naturalObjectSort(
    Object.assign({}, sortedOldColors, sortedNewColors)
  )

  await fs.writeFileSync(
    './data/brandColors.net.json',
    JSON.stringify(sortedNewColors, null, 2)
  )
  await fs.writeFileSync(
    './data/brandColors.merged.json',
    JSON.stringify(sortedMergedColors, null, 2)
  )
}

run()
