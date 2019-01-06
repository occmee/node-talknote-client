const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./lib/__tests__/mock/db.json');
const middlewares = jsonServer.defaults();

require('dotenv').config();
const port = process.env.TALKNOTE_API_MOCK_PORT || 3333;

// リソースをパス指定で取得できるようリライト
server.use(jsonServer.rewriter({
  "/dm": "/dm",
  "/dm/list/1": "/dm_list",
  "/dm/unread/1": "/dm_unread",
  "/dm/post/1": "/dm_post",
  "/group/1": "/group",
  "/group/list/1": "/group_list",
  "/group/unread/1": "/group_unread",
  "/group/post/1": "/group_post"
}));
// POST 時も db.json の内容を返すように、method を POST -> GET に変更する
server.use((req, res, next) => {
  if (req.method === 'POST') req.method = 'GET';
  next();
});
server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
