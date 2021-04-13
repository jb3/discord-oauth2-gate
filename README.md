# Discord OAuth2 Gate

A Cloudflare Worker to protect access to your web properties by checking if users have a ceretain role in your Discord server.

## Configuration

### Clone repository and setup Wrangler

Clone this repository locally and setup the Cloudflare [`wrangler`](https://github.com/cloudflare/wrangler) tool which is used to manage workers.

### Deploy to Workers

First off, you'll need to deploy the worker to a route.

You should update the `wrangler.toml` file to look something like this:

```toml
name = "discord-oauth2-gate"
type = "webpack"
account_id = "<taken from cloudflare dashboard>"
workers_dev = false
route = "your.domain.example/*"
zone_id = "<taken from cloudflare dashboard>"
webpack_config = "webpack.config.js"
```

Once you've done this run `wrangler publish`.

### Setup Discord

You'll need to head to the Discord [Developer Portal](https://discord.com/developers/) and create a new application. You should also create a bot user for the application which will be used to fetch roles from a user.

Use the invite link generators there to invite the bot user to the server you want to search for role members in.

### Configure

Next up add the following environment variables. You can use either wrangler with `wrangler secret put SECRET_NAME` (it will ask you then to input the variable) or alternatively through the web UI on the Workers dashboard.

| Variable name                  | Description                                                             | Example value                                                 |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `DISCORD_OAUTH2_CLIENT_ID`     | Discord OAuth2 Client ID taken from the Developer Portal                | `112233445566778899`                                          |
| `DISCORD_OAUTH2_CLIENT_SECRET` | Discord OAuth2 Client Secret taken from the Developer Portal            | `cj6ufYg6mG1K0r4TfRUuVUpt-S8vPDOX`                            |
| `DISCORD_BOT_TOKEN`            | Discord Bot Token taken from the Developer Portal under the bot section | `MTEyMjMzNDQ1NTY2Nzc4ODk5.WAkN_A.WQqsOdZJmMzITMROyVLZh5hQWEs` |
| `GUILD_ID`                     | The Guild ID which the members should be on.                            | `267624335836053506`                                          |
| `TARGET_ROLE_ID`               | The role which users must have in order to use the web service.         | `267630620367257601`                                          |
| `WORKER_URI`                   | The URI the worker is deployed on, **including the trailing slash**.    | `https://myservice.seph.club/`                                |
| `SECRET_KEY`                   | A random set of characters used as a signing secret for the JWT tokens. | `CL8o0COz6u4iiicKZ06DEaP6PAZqhCNKlaG`                         |

You may need to redeploy with `wrangler publish` to start the application again.

### Good to go!

After this you should be good! Visit any page on your protected service and you should have to pass through a Discord OAuth2 shield first.

If anything doesn't seem right feel free to open an issue!

## Caveats

- At the moment, only one role can be used for access control *per* deployment of this worker.
