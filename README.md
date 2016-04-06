Dwolla V2 Node
==============

```javascript
var dwolla = require('dwolla-v2');
var client = new dwolla.Client({
  id: process.env.DWOLLA_ID,
  secret: process.env.DWOLLA_SECRET,
  environment: 'sandbox',
});
```
