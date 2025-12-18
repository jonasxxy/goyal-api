const xml = require("xml-js");

exports.formatResponse = (req, res, data) => {
  if (req.headers.accept === "application/xml") {
    const xmlData = xml.js2xml({ tenants: data }, { compact: true, spaces: 2 });
    res.set("Content-Type", "application/xml");
    res.send(xmlData);
  } else {
    res.json(data);
  }
};
