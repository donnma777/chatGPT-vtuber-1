//参考にしたコード
//https://github.com/k-masashi/sample-chat-ai-vtuber

//まだ本コードは未完成。再生出来ない。

//VOICEVOX公式サイト
//https://voicevox.hiroshiba.jp/
//VOICEVOXのソフトを立ち上げるとローカルサーバーが立ち上がりAPIが実行出来る。

const Voice = async (inputText) => {
    // VOICEVOXのURL
    const VOICE_VOX_API_URL = "http://localhost:50021";
    // VOICEVOXのSpeakerID
    const VOICEVOX_SPEAKER_ID = '10';

    const audio = new Audio();

    audio.pause();
    audio.currentTime = 0;
    const ttsQuery = await fetch(VOICE_VOX_API_URL + '/audio_query?speaker=' + VOICEVOX_SPEAKER_ID + '&text=' + encodeURI(inputText), {
        method: 'post',
        headers: {
            "text": "string",
            'Content-Type': 'application/json'
        }
    })
    if (!ttsQuery) return;
    const queryJson = await ttsQuery.json();
    const response = await fetch(VOICE_VOX_API_URL + '/synthesis?speaker=' + VOICEVOX_SPEAKER_ID + '&speedScale=2', {
        method: 'post',
        headers: {
            "text": "string",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryJson)
    })
    if (!response) return;
    const blob = await response.blob();
    const audioSourceURL = window.URL || window.webkitURL
    audio = new Audio(audioSourceURL.createObjectURL(blob));
    audio.onended = function () {
        // setTimeout(handleNewLiveCommentIfNeeded, 1000);
    }
    audio.play();
}
console.log(Voice);
export default Voice;


