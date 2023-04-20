import React, { useState } from 'react';
import superagent from 'superagent';
import './App.css';


//参考記事
//https://qiita.com/A_T_B/items/1531d78944d8b796b9fa


// Style
const contentStyle = { width: '80%', textAlign: 'center' };
const textareaStyle = { width: '100%', height: 100 };
const buttonStyle = { ...textareaStyle, fontSize: 30 };
const audioStyle = { ...textareaStyle };

// Query型定義
const Voice = () => {
  const [inputText, setInputText] = useState('');
  const [queryJson, setQueryJson] = useState();
  const [audioData, setAudioData] = useState();

  // 文字列からQueryを作り出す
  const createQuery = async () => {
    const res = await superagent
      .post('http://localhost:50021/audio_query')
      .query({ speaker: 1, text: inputText });

    if (!res) return;

    setQueryJson(res.body);
  };

  // Queryから合成音声を作り出す
  const createVoice = async () => {
    const res = await superagent
      .post('http://localhost:50021/synthesis')
      .query({ speaker: 1 })
      .send(queryJson)
      .responseType('blob');

    if (!res) return;

    setAudioData(res.body);
  };

  return (
    <div className='App-header'>
      <div style={contentStyle}>
        <h2>読み上げたい文章を入力</h2>
        <textarea
          style={textareaStyle}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      {inputText ? (
        <div style={contentStyle}>
          <p>↓</p>
          <h2>文章からクエリデータを作成</h2>
          <button style={buttonStyle} onClick={createQuery}>
            クエリ作成
          </button>
        </div>
      ) : null}

      {queryJson ? (
        <div style={contentStyle}>
          <p>↓</p>
          <h2>クエリデータから音声を合成</h2>
          <button style={buttonStyle} onClick={createVoice}>
            音声合成
          </button>
        </div>
      ) : null}

      {audioData ? (
        <div style={contentStyle}>
          <p>↓</p>
          <h2>返却された音声ファイルを再生</h2>
          <audio
            style={audioStyle}
            controls
            src={audioData ? window.URL.createObjectURL(audioData) : undefined}
          ></audio>
        </div>
      ) : null}
    </div>
  );
};

export default Voice;
