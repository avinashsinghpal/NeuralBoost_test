const path = require("path");

function getDb() {
  return {
    find: () => [],
    insert: (_doc) => true
  };
}

module.exports = { getDb };
