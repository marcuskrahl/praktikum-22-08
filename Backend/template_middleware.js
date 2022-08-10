
const fs = require('fs');



function templateMiddleware(req, res, next) {
  if (!req.originalUrl.endsWith('.html')) {
    next();
    return;
  }
  const template = fs.readFileSync('Frontend/template.html', { encoding: 'utf-8'});
  const location = `Frontend${req.originalUrl}`;
  fs.readFile(location, {encoding: 'utf-8'}, (error, data) => {
    if (error) {
      res.sendStatus(404);
      return;
    }
    const newContent = template.replace('{{content}}',data);
    res.contentType('html');
    res.send(newContent);
  });
}

module.exports = templateMiddleware;