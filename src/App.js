import React, { useState, useEffect } from 'react';
import ChatGptApi  from './utils/chatGptApi';

import axios from 'axios';

const App = () => {

  const youtube_apikey = "";

  // const LiveComent = await(Live);
  
  // メッセージの状態管理用
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeCommentAcquisitionFunc, setYoutubeCommentAcquisitionFunc] = useState('');
  const [youtubeCommentData, setYoutubeCommentData] = useState('');
  const [readingCommentStartFlg, setReadingCommentStartFlg] = useState(false);
  const [reading_comment_StopFlg, setReading_comment_StopFlg] = useState(false);

  // 回答の状態管理用
  const [answer, setAnswer] = useState('');

  // メッセージの格納
  const handleMessageChange = (event) => {
    setYoutubeUrl(event.target.value);
  }

  // 「質問」ボタンを押したときの処理
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // chat.js にメッセージを渡して API から回答を取得
  //   // const responseText = await chat(LiveComent);

  //   // 回答の格納
  //   // setAnswer(responseText);
  // }

  const reading_comment_start = async (event) => {

    console.log("読み取り開始")

    if (readingCommentStartFlg) {
      return;
    }

    const LiveUrl = new URL(youtubeUrl);
    const queryParams = new URLSearchParams(LiveUrl.search);
    const youtubeVideoUrl  = 'https://www.googleapis.com/youtube/v3/videos';
    const params = {'key': youtube_apikey, 'id': queryParams.get('v'), 'part': 'liveStreamingDetails'};

    const youtubeVideoResponse = await axios.get(youtubeVideoUrl, {params: params});

    if (youtubeVideoResponse.status !== 200) {
      return;
    }

    // console.log(youtubeVideoResponse)

    const channelId = youtubeVideoResponse.data.items[0].liveStreamingDetails.activeLiveChatId;
    // console.log(channelId)

    setYoutubeCommentAcquisitionFunc(setInterval(async () => {

      const LiveChatUrl    = 'https://www.googleapis.com/youtube/v3/liveChat/messages'
      const param = {'key': youtube_apikey, 'liveChatId': channelId, 'part': 'id,snippet,authorDetails'}
    
      const LiveChatResponse = await axios.get(LiveChatUrl, { params: param });

      console.log(LiveChatResponse)

      if(LiveChatResponse.status === 200) {
        setYoutubeCommentData(LiveChatResponse.data.items);
      }
    }, 2000))

    setReading_comment_StopFlg(false);
    setReadingCommentStartFlg(true);

  }

  const reading_comment_Stop = async () => {

    ChatGptApi.completions("コード修正してください");

    if(reading_comment_StopFlg) {
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