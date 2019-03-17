const templates =  require('../messages');

const replacerTemplateRegex = /%%\w+%%/;

module.exports = (({ id, values }) => values.reduce(
  (currentTemplateState, currentValue) =>
    currentTemplateState.replace(replacerTemplateRegex, currentValue),
  templates[id],
));
