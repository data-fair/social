const createError = require('http-errors')

// Util functions shared accross the main find (GET on collection) endpoints

function queryVal (val) {
  if (val === 'true') return true
  if (val === 'false') return false
  return val
}

// cf https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegex (string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

// Allow a super admin to access to any organization resource
exports.getOwner = (req) => {
  if (req.query?.owner?.length && req.user?.adminMode) {
    return {
      id: req.query.owner,
      type: 'organization'
      // name: owner.name
    }
  } else {
    return {
      id: req.user.activeAccount.id,
      type: req.user.activeAccount.type,
      name: req.user.activeAccount.name
    }
  }
}

exports.query = (req, fieldsMap = {}, extraFilters = []) => {
  const query = {}
  if (!req.query) return query
  if (req.query.q) query.$text = { $search: req.query.q }
  query.$and = [...extraFilters]

  // a few first rules to manage visibility
  if (req.query.user && req.query.user !== req.user.id) {
    throw createError(400, 'User can only filter on his own id')
  }
  if (!req.query.topic && !req.query.user) {
    throw createError(400, 'You must either filter on a topic or a user')
  }

  query.$and.push({
    'owner.type': exports.getOwner(req).type,
    'owner.id': exports.getOwner(req).id
  })

  // pagination based on sliding date instead of skip
  if (req.query.before) {
    query.$and.push({ createdAt: { $lt: req.query.before } })
  }

  // apply common field mapping
  Object.assign(fieldsMap, { user: 'user.id', topic: 'topic.key' })

  Object.keys(fieldsMap).filter(name => req.query[name] !== undefined).forEach(name => {
    const values = req.query[name].split(',').map(queryVal)
    const notNullValues = values.filter(v => v !== 'null')
    const or = []
    if (notNullValues.length) or.push({ [fieldsMap[name]]: { $in: notNullValues } })
    if (values.find(v => v === 'null')) {
      or.push({ [fieldsMap[name]]: { $exists: false } })
      or.push({ [fieldsMap[name]]: { $size: 0 } })
    }
    query.$and.push({ $or: or })
  })

  // specific "prefix" filter on topic.key
  if (req.query.prefix) query.$and.push({ 'topic.key': { $regex: `^${escapeRegex(req.query.prefix)}.*` } })

  if (!query.$and.length) delete query.$and
  return query
}

exports.ownerFilters = (reqQuery) => {
  const ownerTypes = {}
  reqQuery.owner.split(',').forEach(owner => {
    const [t, id] = owner.split(':')
    ownerTypes[t] = ownerTypes[t] || []
    ownerTypes[t].push(id)
  })
  let ownerFilters = ['user', 'organization'].filter(t => ownerTypes[t]).map(t => ({ 'owner.type': t, 'owner.id': { $in: ownerTypes[t] } }))
  if (ownerTypes['-user'] || ownerTypes['-organization']) {
    ownerFilters = ownerFilters.concat(['-user', '-organization'].map(t => {
      const f = { 'owner.type': t.substring(1) }
      if (ownerTypes[t]) f['owner.id'] = { $nin: ownerTypes[t] }
      return f
    }))
  }
  return ownerFilters
}

exports.sort = (sortStr, fields) => {
  const sort = {}
  if (!sortStr) return sort
  sortStr.split(',').forEach(s => {
    const toks = s.split(':')
    if (!fields.includes(toks[0])) throw createError(400, `sort on ${toks[0]} is not supported`)
    sort[toks[0]] = Number(toks[1])
  })
  return sort
}

exports.pagination = (query, defaultSize = 10) => {
  let size = defaultSize
  if (query && query.size && !isNaN(parseInt(query.size))) {
    size = parseInt(query.size)
  }

  let skip = 0
  if (query && query.skip && !isNaN(parseInt(query.skip))) {
    skip = parseInt(query.skip)
  } else if (query && query.page && !isNaN(parseInt(query.page))) {
    skip = (parseInt(query.page) - 1) * size
  }

  return [skip, size]
}

exports.project = (selectStr, exclude = []) => {
  const select = {}
  if (!selectStr) {
    exclude.forEach(e => {
      select[e] = 0
    })
  } else {
    selectStr.split(',').forEach(s => {
      select[s] = 1
    })
    exclude.forEach(e => {
      delete select[e]
    })
  }
  return select
}

exports.facetQuery = (facetStr, fields) => {
  const facet = {}
  facetStr.split(',').forEach(f => {
    if (!fields.includes(f)) throw createError(400, `facet on ${f} is not supported`)
    facet[f] = [{ $sortByCount: '$' + f }]
  })
  return facet
}

exports.facetResponse = (aggResult) => {
  const facets = {}
  for (const key of Object.keys(aggResult[0])) {
    facets[key] = {}
    for (const item of aggResult[0][key]) {
      facets[key][item._id] = item.count
    }
  }
  return facets
}

exports.parametersDoc = (filterFields) => [
  {
    in: 'query',
    name: 'size',
    description: 'Le nombre de résultats à retourner (taille de la pagination)',
    required: false,
    schema: {
      default: 10,
      type: 'integer'
    }
  },
  {
    in: 'query',
    name: 'skip',
    description: 'Nombre de résultats à ignorer. Permet par exemple de lire la prochaine page de données',
    required: false,
    schema: {
      default: 0,
      type: 'integer'
    }
  },
  {
    in: 'query',
    name: 'sort',
    description: 'Permet de trier les résultat. Utiliser la syntaxte suivante : id_champ:1 ou idchamp:-1 suivant pour avoir un tri par ordre croissant ou décroissant respectivement',
    required: false,
    schema: {
      default: 1,
      type: 'string'
    }
  }
].concat(filterFields)
