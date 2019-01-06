const jsonServer = require('json-server');
import { TalknoteClient } from '../';

require('dotenv').config();
const port = process.env.TALKNOTE_API_MOCK_SERVER_PORT || 3333;

function runMockServer() {
  const app = jsonServer.create();
  const router = jsonServer.router('./lib/__tests__/db.json');
  const middlewares = jsonServer.defaults();

  // リソースをパス指定で取得できるようリライト
  app.use(jsonServer.rewriter({
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
  app.use((req, res, next) => {
    if (req.method === 'POST') req.method = 'GET';
    next();
  });
  app.use(middlewares);
  app.use(router);
  return app.listen(port, () => {
    console.log(`JSON Server is running on port ${port} ...`);
  });
}

function stopMockServer(server) {
  server.close(() => {
    console.log("JSON Server closed.");
  });
}

describe('TalknoteClient', () => {

  let client;
  let server;
  const options = {};

  beforeAll(() => {
    server = runMockServer();
  });

  afterAll(() => {
    stopMockServer(server);
  });

  describe('::constructor', () => {
    it('TalknoteClient のインスタンスを生成できる', () => {
      const accessToken = process.env.TALKNOTE_API_ACCESS_TOKEN || 'hoge';
      const refreshToken = process.env.TALKNOTE_API_REFRESH_TOKEN || 'fuga';
      const apiUrl = process.env.TALKNOTE_API_MOCK_URL || `http://localhost:${port}/`;
      const options = { refreshToken, apiUrl };
      client = new TalknoteClient(accessToken, options);

      expect(client).not.toBeNull();
    });
  });

  describe('::/dm', () => {
    it('メッセージ投稿の一覧を取得できる ', async () => {
      const data = await client.dm();

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
      expect(data.data.threads.length).toBeGreaterThanOrEqual(1);

      options.dmId = data.data.threads[0].id;
    });
  });

  describe('::/dm/list', () => {
    it('ダイレクトメッセージ投稿の一覧を取得できる', async () => {
      const data = await client.dm_list(options.dmId);

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

  describe('::/dm/unread', () => {
    it('メッセージ未読件数を取得できる', async () => {
      const data = await client.dm_unread(options.dmId);

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

  describe('::/dm/post', () => {
    it('メッセージを投稿できる', async () => {
      const data = await client.dm_post(options.dmId, 'メッセージです');

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

  describe('::/group', () => {
    it('グループ情報一覧を取得できる', async () => {
      const data = await client.group(1); // グループ情報一覧取得の際にも groupId の指定が必要な模様

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
      expect(data.data.groups.length).toBeGreaterThanOrEqual(1);

      options.groupId = data.data.groups[0].id;
    });
  });

  describe('::/group/list', () => {
    it('グループ投稿の一覧を取得できる', async () => {
      const data = await client.group_list(options.groupId);

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

  describe('::/group/unread', () => {
    it('グループ未読件数を取得できる', async () => {
      const data = await client.group_unread(options.groupId);

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

  describe('::/group/post', () => {
    it('グループへメッセージを投稿できる', async () => {
      const data = await client.group_post(options.groupId, 'メッセージです');

      expect(data).not.toBeNull();
      expect(data.status).toEqual(1);
    });
  });

});
