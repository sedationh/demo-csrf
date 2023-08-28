const Koa = require("koa")
const app = new Koa()
const serve = require("koa-static")
const Router = require("koa-router")
const bodyParser = require("koa-bodyparser")

const router = new Router()

// 展示 当前 index.html
app.use(serve(__dirname))
app.use(bodyParser())

// 有俩用户
const users = ["a", "b"]

const articles = {
  a: [
    {
      title: "a1",
    },
    {
      title: "a2",
    },
  ],
  b: [
    {
      title: "b1",
    },
    {
      title: "b2",
    },
    {
      title: "b3",
    },
  ],
}

router.post("/api/login", (ctx) => {
  const user = ctx.request.body?.user || ""
  if (users.includes(user)) {
    ctx.cookies.set("shop-auth", user)
    ctx.body = "OK"
  } else {
    ctx.status = 401
    ctx.body = "Fail"
  }
})

router.get("/api/logout", (ctx) => {
  ctx.cookies.set("shop-auth", "")
  ctx.body = "OK"
})

// 获取当前用户文章
router.get("/api/articles", (ctx) => {
  const user = ctx.cookies.get("shop-auth")
  ctx.body = articles[user]
})

// 删除当前用户文章
router.delete("/api/articles", (ctx) => {
  const user = ctx.cookies.get("shop-auth")
  articles[user]?.pop()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
