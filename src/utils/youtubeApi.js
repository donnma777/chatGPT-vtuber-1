/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

// 共通処理
const instance = axios.create({
    baseURL: process.env.REACT_APP_YOUTUBE_BASE_URL,
    timeout: 30000,
    cors: true,
})

class YoutubeApi {

    // Liveデータ取得
    async videos(liveId) {

        let response = null

        try {

            const params = {'key': process.env.REACT_APP_YOUTUBE_API_KEY, 'id': liveId, 'part': 'liveStreamingDetails'};
    
            // API リクエスト
            const res = await instance.get(`/videos`, {params: params})

            response = res.data

        } catch(e) {
            console.error(e)
        }
        
        return response
    }

    // Liveデータ取得
    async liveComment(channelId) {

        let response = null

        try {

            const params = {'key': process.env.REACT_APP_YOUTUBE_API_KEY, 'liveChatId': channelId, 'part': 'id,snippet,authorDetails'};
        
            // API リクエスト
            const res = await instance.get(`/liveChat/messages`, {params: params})
    
            response = res.data;

        } catch(e) {
            console.error(e)
        }
        
        return response;
    }

}

export default new YoutubeApi();