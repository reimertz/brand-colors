/*
* @preserve brand-colors {{ version }}
* http://reimertz.github.io/brand-colors
* (c) 2014 Pierre Reimertz
* may be freely distributed under the MIT license.
*/

var _brandColors = require('./brandColors.json')

var _groupedColors = {}

var brandColors = Object.keys(_brandColors).map(function(key) {
  var formatted = key.replace(/-([0-9]+)/g, '')

  if (typeof _groupedColors[formatted] == 'undefined')
    _groupedColors[formatted] = []
  _groupedColors[formatted].push(_brandColors[key])

  return {
    name: key,
    color: _brandColors[key]
  }
})

function getAll() {
  return brandColors
}

function getByGroup(brandName) {
  if (!brandName) {
    return Object.keys(_groupedColors).map(name => ({ name: name, color: _groupedColors[name] }))
  } else if (typeof brandName == 'object') {
    var collection = []
    for (var i = 0; i < brandName.length; i++) {
      collection.push({ name: brandName[i], color: getByGroup(brandName[i]) })
    }
    return collection
  }
  return _groupedColors[brandName]
}

function find(name) {
  return brandColors.filter(function(brand) {
    return brand.name === name
  })
}

exports._brandColors = _brandColors
exports.jsColors = require('../dist/latest/js/brand-colors.latest')
exports.getAll = getAll
exports.getByGroup = getByGroup
exports.find = find
