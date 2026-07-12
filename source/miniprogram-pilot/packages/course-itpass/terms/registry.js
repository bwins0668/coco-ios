var terms = require('./terms-data');
var registry = {};

terms.forEach(function(term) {
  if (term && term.id) registry[term.id] = term;
});

function register(term) {
  if (term && term.id) registry[term.id] = term;
}

function getTerm(id) {
  return registry[id] || null;
}

function getTerms(ids) {
  return (ids || []).map(function(id) { return registry[id]; }).filter(Boolean);
}

function getAllTerms() {
  return Object.values(registry);
}

module.exports = { register: register, getTerm: getTerm, getTerms: getTerms, getAllTerms: getAllTerms, registry: registry };
