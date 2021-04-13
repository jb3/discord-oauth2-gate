import { Router, getErrorPageHTML } from '8track'
import { sign, verifyAndDecode } from './jwt';

import { constructAuthLink, getUserInformation, validateToken, getUserRoles } from "./oauth2";
import { getCookie } from './utils';

const router = new Router()

router.get`/discord-auth/callback`.handle(async (ctx) => {
  let url = new URL(ctx.event.request.url);
  let data = await validateToken(url.searchParams.get("code")!);
  let userInfo = await getUserInformation(data.access_token);
  let userRoles = await getUserRoles(userInfo.id);

  if (userRoles.indexOf(TARGET_ROLE_ID) === -1) {
    return ctx.end("You are missing the target role.");
  }

  let token = sign(userInfo);

  ctx.end(new Response(
    "Authorized.", {
      headers: {
        "Set-Cookie": `DiscordAuth=${token}; path=/`,
        "Location": WORKER_URI
      },
      status: 302
    }
  ))
})

router.get`/discord-auth/authorise`.handle(async (ctx) => {
  ctx.end(constructAuthLink());
})

router.all`(.*)`.handle(async (ctx) => {
  let cookie = getCookie(ctx.event.request, "DiscordAuth");

  if (cookie) {
    try {
      verifyAndDecode(cookie);
      ctx.end(await fetch(ctx.event.request.url, ctx.event.request))
    } catch(err) {
      ctx.end(Response.redirect(WORKER_URI + "discord-auth/authorise", 302))
    }
  } else {
    ctx.end(Response.redirect(WORKER_URI + "discord-auth/authorise", 302))
  }
})

addEventListener('fetch', e => {
  const res = router.getResponseForEvent(e).catch(
    error =>
      new Response(getErrorPageHTML(e.request, error), {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }),
  )

  e.respondWith(res as any)
})
