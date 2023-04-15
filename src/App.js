import React, { useState, useEffect } from 'react';
import { chat } from './Chat';  // chat.js のインポート
import { Live } from './utils/Live';

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

  // 音声再生
  //まだ本コードは未完成。再生出来ない。
  //VOICEVOX公式サイト
  //https://voicevox.hiroshiba.jp/
  //VOICEVOXのソフトを立ち上げるとローカルサーバーが立ち上がりAPIが実行出来る。

  // const [voice, setVoice] = useState(false);
  // const [voiceDate, setVoiceData] = useState(false);

  // setVoice = async () => {
  //   const parAmaudioQuery = "テスト音声です";
  //   // VOICEVOXのローカルサーバーURL
  //   const VOICE_VOX_API_URL = "http://localhost:50021";
  //   // VOICEVOXのSpeakerID
  //   const VOICEVOX_SPEAKER_ID = '10';
  //   const appUrl = axios.post(VOICE_VOX_API_URL + '/audio_query?speaker=' + VOICEVOX_SPEAKER_ID + '&text=' + parAmaudioQuery)
  //
  //   if (appUrl.status === 200) {
  //     setVoiceData(appUrl.data);
  //   }
  //   console.log(voice);
  // }
  // console.log(voiceDate);



  // VtuberStudio連携
  //仕様書
  // https://github.com/DenchiSoft/VTubeStudio#requesting-list-of-hotkeys-available-in-current-or-other-vts-model
  //http://localhost:8001/

  //まだ未完成
  // const [vtuberStudio, setVtuberStudio] = useState(false);
  // setVtuberStudio = async () => {
  //   const VtuberStudio_API_URL = "http://localhost:8001";
  //   //リクエストに付加するヘッダーの定義
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'any-header':
  //     {
  //       apiName: "VTubeStudioPublicAPI",
  //       apiVersion: "1.0",
  //       requestID: "SomeID",
  //       messageType: "HotkeyTriggerRequest",
  //       data: {
  //         hotkeyID: "HotkeyNameOrUniqueIdOfHotkeyToExecute",
  //         itemInstanceID: "Optional_ItemInstanceIdOfLive2DItemToTriggerThisHotkeyFor"
  //       }
  //     }
  //   }
  //   axios.post(VtuberStudio_API_URL, { headers: headers });
  // }






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
    const youtubeVideoUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const params = { 'key': youtube_apikey, 'id': queryParams.get('v'), 'part': 'liveStreamingDetails' };

    const youtubeVideoResponse = await axios.get(youtubeVideoUrl, { params: params });

    if (youtubeVideoResponse.status !== 200) {
      return;
    }

    // console.log(youtubeVideoResponse)

    const channelId = youtubeVideoResponse.data.items[0].liveStreamingDetails.activeLiveChatId;
    // console.log(channelId)

    setYoutubeCommentAcquisitionFunc(setInterval(async () => {

      const LiveChatUrl = 'https://www.googleapis.com/youtube/v3/liveChat/messages'
      const param = { 'key': youtube_apikey, 'liveChatId': channelId, 'part': 'id,snippet,authorDetails' }

      const LiveChatResponse = await axios.get(LiveChatUrl, { params: param });

      console.log(LiveChatResponse)

      if (LiveChatResponse.status === 200) {
        setYoutubeCommentData(LiveChatResponse.data.items);
      }
    }, 2000))

    setReading_comment_StopFlg(false);
    setReadingCommentStartFlg(true);

  }

  const reading_comment_Stop = async () => {

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