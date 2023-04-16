const Voicevox = () => {
    // 音声再生
    //まだ本コードは未完成。再生出来ない。
    //VOICEVOX公式サイト
    //https://voicevox.hiroshiba.jp/
    //https://github.com/VOICEVOX/voicevox_engine
    //VOICEVOXのソフトを立ち上げるとローカルサーバーが立ち上がりAPIが実行出来る。

    const [voiceData, setVoiceData] = useState(null);
    const [voice, setVoice] = useState(null);

    const fetchVoiceData = async () => {
        const parAmaudioQuery = "テスト音声です";
        const VOICE_VOX_API_URL = "http://localhost:50021";
        const VOICEVOX_SPEAKER_ID = '10';
        try {
            const response = await axios.post(`${VOICE_VOX_API_URL}/audio_query?speaker=${VOICEVOX_SPEAKER_ID}&text=${parAmaudioQuery}`);
            if (response.status === 200) {
                setVoiceData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVoiceData();
    }, []);

    useEffect(() => {
        if (voiceData) {
            setVoice(voiceData.voice);
        }
    }, [voiceData]);

    console.log(voiceData);
    console.log(voice);

    return Voicevox
}

export default Voicevox;
