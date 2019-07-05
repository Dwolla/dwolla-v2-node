var Promise = require("bluebird");

var EXPIRES_IN_LEEWAY = 60;

function now() {
  return parseInt(Date.now() / 1000, 10);
}

module.exports = function TokenManager(client, initialState) {
  var state = Object.assign(
    { instance: null, expiresIn: null, updatedAt: null },
    initialState
  );

  var updateToken = function() {
    state.updatedAt = now();
    state.expiresIn = null;
    state.instance = client.auth.client().then(
      function(token) {
        state.expiresIn = token.expires_in;
        return token;
      },
      function(err) {
        state.instance = null;
        return Promise.reject(err);
      }
    );
  };

  var isTokenFresh = function() {
    return (
      state.expiresIn === null || // token is updating
      state.updatedAt + state.expiresIn > now() + EXPIRES_IN_LEEWAY
    );
  };

  return {
    getToken: function() {
      if (state.instance === null || !isTokenFresh()) {
        updateToken();
      }
      return state.instance;
    },
    _state: state
  };
};
