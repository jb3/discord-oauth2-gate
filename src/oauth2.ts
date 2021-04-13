export function constructAuthLink() {
    let base = new URL("https://discord.com/api/oauth2/authorize");

    let components = {
        "client_id": DISCORD_OAUTH2_CLIENT_ID,
        "redirect_uri": WORKER_URI + "discord-auth/callback",
        "response_type": "code",
        "scope": "identify"
    }

    for (var [key, val] of Object.entries(components)) {
        base.searchParams.append(key, val);
    }

    return Response.redirect(base.toString(), 302)
}

export async function validateToken(code: string) {
    let parameters = {
        "client_id": DISCORD_OAUTH2_CLIENT_ID,
        "client_secret": DISCORD_OAUTH2_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": WORKER_URI + "discord-auth/callback",
        "scope": "identify"
    }

    let data = new URLSearchParams()

    Object.entries(parameters).forEach(([key, value]) => data.append(key, value))

    let request = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })

    return await request.json()
}

export async function getUserInformation(token: string) {
    let request = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return await request.json()
}

export async function getUserRoles(userID: string) {
    let request = await fetch(`https://discord.com/api/v8/guilds/${GUILD_ID}/members/${userID}`, {
        headers: {
            "Authorization": `Bot ${DISCORD_BOT_TOKEN}`
        }
    })

    return (await request.json()).roles;
}
