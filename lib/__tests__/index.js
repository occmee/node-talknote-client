
import { TalknoteClient } from '../';

require('dotenv').config();

describe('TalknoteClient', () => {

  let client;

  describe('::constructor', () => {
    it('TalknoteClient のインスタンスを生成できる', () => {
      const accessToken = process.env.TALKNOTE_API_ACCESS_TOKEN || 'hoge';
      const refreshToken = process.env.TALKNOTE_API_REFRESH_TOKEN || 'fuga';
      const apiUrl = process.env.TALKNOTE_API_MOCK_URL; // モックサーバを使う場合
      const options = { refreshToken };
      if (apiUrl) Object.assign(options, { apiUrl });
      client = new TalknoteClient(accessToken, options);

      expect(client).not.toBeNull();
      console.log(client)
    });
  });

  describe('::/dm', () => {
    it('メッセージ投稿の一覧を取得できる ', async () => {
      const data = await client.dm();
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/dm/list', () => {
    it('ダイレクトメッセージ投稿の一覧を取得できる', async () => {
      const data = await client.dm_list(1);
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/dm/unread', () => {
    it('メッセージ未読件数を取得できる', async () => {
      const data = await client.dm_unread(1);
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/dm/post', () => {
    it('メッセージを投稿できる', async () => {
      const data = await client.dm_post(1, 'メッセージです');
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/group', () => {
    it('グループ情報一覧を取得できる', async () => {
      const data = await client.group(1);
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/group/list', () => {
    it('グループ投稿の一覧を取得できる', async () => {
      const data = await client.group_list(1);
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/group/unread', () => {
    it('グループ未読件数を取得できる', async () => {
      const data = await client.group_unread(1);
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

  describe('::/group/post', () => {
    it('グループへメッセージを投稿できる', async () => {
      const data = await client.group_post(1, 'メッセージです');
      console.log(data)

      expect(data).not.toBeNull();
    });
  });

});
