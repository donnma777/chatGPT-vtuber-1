import React, { useState } from 'react';
import ChatGptApi from './utils/chatGptApi';
import YoutubeApi from './utils/youtubeApi';

const App = () => {

  // メッセージの状態管理用
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeCommentAcquisitionFunc, setYoutubeCommentAcquisitionFunc] = useState('');
  const [youtubeCommentData, setYoutubeCommentData] = useState('');
  const [readingCommentStartFlg, setReadingCommentStartFlg] = useState(false);
  const [reading_comment_StopFlg, setReading_comment_StopFlg] = useState(false);

  // 回答の状態管理用
  // const [answer, setAnswer] = useState('');

  // メッセージの格納
  const handleMessageChange = (event) => {
    setYoutubeUrl(event.target.value);
  }

  const reading_comment_start = async (event) => {

    console.log("読み取り開始")

    if (readingCommentStartFlg) {
      return;
    }

    const LiveUrl = new URL(youtubeUrl);
    const queryParams = new URLSearchParams(LiveUrl.search);
    const liveId = queryParams.get('v')

    // youtubeビデオデータ取得
    const liveData = await YoutubeApi.videos(liveId);

    if (liveData == null) {
      console.error("ビデオデータ取得できませんでした");
      return;
    }

    const channelId = liveData.items[0].liveStreamingDetails.activeLiveChatId;
    // console.log(channelId)

    setYoutubeCommentAcquisitionFunc(setInterval(async () => {

      const liveCommentData = await YoutubeApi.liveComment(channelId);

      if (liveCommentData.status !== null) {
        setYoutubeCommentData(liveCommentData.items);
      }
    }, 2000))

    setReading_comment_StopFlg(false);
    setReadingCommentStartFlg(true);

  }

  const reading_comment_Stop = async () => {

    // テスト的にChatGPT API組み込んでいる
    await ChatGptApi.completions("コード修正してください");

    if (reading_comment_StopFlg) {
      return;
    }

    clearInterval(youtubeCommentAcquisitionFunc)

    setReadingCommentStartFlg(false);
    setReading_comment_StopFlg(true);

  }

  // チャットフォームの表示
  return (
    <div>
      <h4>youtube Live URL</h4>
      <form>
        <label>
          <textarea
            rows='1'
            cols='50'
            value={youtubeUrl}
            onChange={handleMessageChange}
          />
        </label>
      </form>
      <div>
        <button onClick={reading_comment_start} disabled={readingCommentStartFlg}>コメント読み取り開始</button>
      </div>
      <div>
        <button onClick={reading_comment_Stop} disabled={reading_comment_StopFlg}>コメント読み取り停止</button>
      </div>
      {youtubeCommentData && (
        youtubeCommentData?.map((data) => (
          <div key={data.id}>{data.snippet.textMessageDetails.messageText}</div>
        ))
      )}
      {/* {answer && (
        <div>
          <h2>回答:</h2>
          <p>{answer}</p>
        </div>
      )} */}
    </div>
  );
}

export default App;