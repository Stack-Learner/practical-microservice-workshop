const axios = require("axios");
const qs = require("qs");
class Oidc {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    try {
      const headers = await kong.request.get_headers();
      const authHeader = headers["authorization"];
      const token = authHeader ? authHeader[0].split(" ")[1].trim() : "";

      const keycloak_introspection_url = this.config.keycloak_introspection_url;
      const client_id = this.config.client_id;
      const client_secret = this.config.client_secret;

      kong.log.notice(`
      🍳🍳🍳🍳🍳🍳🍳
      token = ${token.length}
      keycloak_introspection_url = ${keycloak_introspection_url}
      client_id = ${client_id}
      client_secret = ${client_secret}  
      `);

      if (!token) {
        return await kong.response.exit(
          401,
          JSON.stringify({
            message: "Unauthorized. No Token Found!",
          })
        );
      }

      const data = qs.stringify({
        client_id,
        client_secret,
        token,
      });

      const response = await axios.post(keycloak_introspection_url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      kong.log.notice(
        `🚆🚆🚆🚆🚆🚆 Kong Introspection API Response: ${JSON.stringify(
          response.data
        )}`
      );

      if (!response.data.active) {
        return await kong.response.exit(
          401,
          JSON.stringify({
            message: "Unauthorized. Invalid Token!",
          })
        );
      }

      kong.log.notice(`🥰🥰 Request sent to the Upstream server`);

      // Set user data in headers
      kong.service.request.set_header("X-User-ID", response.data.sid);
      kong.service.request.set_header("X-User-Email", response.data.email);

      return;
    } catch (error) {
      const message = error.message || "Something Went Wrong!";
      return await kong.response.exit(500, JSON.stringify({ message }));
    }
  }
}

module.exports = {
  Plugin: Oidc,
  Schema: [
    {
      keycloak_introspection_url: {
        type: "string",
        required: true,
        description:
          "The URL of the external authentication server's validation endpoint.",
      },
    },
    {
      client_id: {
        type: "string",
        required: true,
      },
    },
    {
      client_secret: {
        type: "string",
        required: true,
      },
    },
  ],
  Version: "1.0.0",
  Priority: 0,
};
