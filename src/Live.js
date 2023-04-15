const { LiveChat } = require("youtube-chat")



const Live = () => {
    
// チャンネルIDから配信中のチャット欄を取得
// 配信IDは毎度変わるのでこちらが推奨
const liveChat = new LiveChat({ channelId: "CHANNEL_ID_HERE" })

// // 配信IDから特定の配信のチャット欄を取得
// // まだアーカイブ対応とかしてないし多分使いにくい
// const liveChat = new LiveChat({ liveId: "LIVE_ID_HERE" })

// チャットの取得開始時に発火するイベント
liveChat.on("start", (liveId) => {
    /* Your code here! */
})

// チャット取得終了時に発火するイベント
// エラーで終了する場合も発火する
liveChat.on("end", (reason) => {
    /* Your code here! */
})

// メインです
// チャット1件ごとに発火される
liveChat.on("chat", (chatItem) => {
    /* Your code here! */
})

// エラー発生時に発火
// EventEmitterの仕様でこれがcatchの役割なので書いていないとエラー時に停止する
liveChat.on("error", (err) => {
    /* Your code here! */
})

// チャット取得開始 動いている間はプログラムが終了しない
// 一応asyncで開始したかどうかbooleanを返す
liveChat.start()



// 取得を停止
liveChat.stop()

}

export default Live;
