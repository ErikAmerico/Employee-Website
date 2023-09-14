const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = "mysecretssshhhhhhh";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // We split the token string into an array and return actual token
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log("Invalid token");
      console.error(err);
      //if there is an error, the req gets returned regardless, not ideal?
      // throw new AuthenticationError("Invalid token");
    }

    // return the request object so it can be passed to the resolver as `context`
    return req;
  },
  //checkIfadminAUth goes here maybe

  //Role should be sent in payload of token, for admin purposes
  signToken: function ({ email, firstName, lastName, _id, role, company }) {
    const payload = { email, firstName, lastName, _id, role, company };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
