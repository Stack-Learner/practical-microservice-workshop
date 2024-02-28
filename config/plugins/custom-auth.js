const axios = require("axios");
class CustomAuth {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    try {
      kong.log.notice(`🚆🚆🚆🚆🚆🚆 Hello Custom Auth`);
      const headers = await kong.request.get_headers();
      kong.log.notice(`🚆🚆🚆🚆🚆🚆 header Response: ${headers}`);
      const token_place = this.config.token_place || "Authorization";
      const authHeader =
        headers[token_place.toLowerCase()] &&
        headers[token_place.toLowerCase()][0];
      const token = authHeader ? authHeader.split(" ")[1] : null;

      kong.log.notice(`🚆🚆🚆🚆🚆🚆 token Response: ${token}`);

      if (!token) {
        return await kong.response.exit(
          401,
          JSON.stringify({
            message: "Unauthorized",
          })
        );
      }

      const data = await axios.post(
        this.config.validation_endpoint, // http://auth:4005/api/v1/checkpoint
        {
          accessToken: token,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      if (data.status !== 200) {
        return await kong.response.exit(
          401,
          JSON.stringify({
            message: "Unauthorized",
          })
        );
      }

      kong.log.notice(
        `🚆🚆🚆🚆🚆🚆 Auth API Response: ${JSON.stringify(data.data)}`
      );


      // Set user data in headers
      kong.service.request.set_header("X-User-ID", data.data.user.id);
      kong.service.request.set_header("X-User-Email", data.data.user.email);

      return;
    } catch (error) {
      const message = error.message || "Unauthorized";

      return await kong.response.exit(500, JSON.stringify({ message }));
    }
  }
}

module.exports = {
  Plugin: CustomAuth,
  Schema: [
    {
      validation_endpoint: {
        type: "string",
        required: true,
        description:
          "The URL of the external authentication server's validation endpoint.",
      },
    },
    {
      token_place: {
        type: "string",
        required: false,
        default: "Authorization",
      },
    },
  ],
  Version: "1.0.0",
  Priority: 0,
};
