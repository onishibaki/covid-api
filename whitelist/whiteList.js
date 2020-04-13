const whitelist = ['http://localhost:3000/'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Sorry not Allowed'));
    }
  }
};
