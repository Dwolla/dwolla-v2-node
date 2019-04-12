var FormData = require("form-data");

module.exports = function(obj) {
  var formData = new FormData();
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      formData.append(k, obj[k]);
    }
  }
  return formData;
};
