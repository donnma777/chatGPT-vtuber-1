import { VtuberStudioAPIURL } from './ApiKye';

const VtuberStudio = () => {
    // VtuberStudio連携
    //　仕様書
    // https://github.com/DenchiSoft/VTubeStudio#requesting-list-of-hotkeys-available-in-current-or-other-vts-model
    //　デフォルトのローカルサーバー VtuberStudioAPIURL : http://localhost:8001/

    //まだ未完成
    const triggerVtuberStudioHotkey = async () => {
        const VTUBER_STUDIO_API_URL = VtuberStudioAPIURL;
        //リクエストに付加するヘッダーの定義
        const headers = {
            'Content-Type': 'application/json',
            'any-header': {
                apiName: "VTubeStudioPublicAPI",
                apiVersion: "1.0",
                requestID: "SomeID",
                messageType: "HotkeyTriggerRequest",
                data: {
                    hotkeyID: "HotkeyNameOrUniqueIdOfHotkeyToExecute",
                    itemInstanceID: "Optional_ItemInstanceIdOfLive2DItemToTriggerThisHotkeyFor"
                }
            }
        };

        try {
            const response = await axios.post(VTUBER_STUDIO_API_URL, { headers: headers });
            setIsVtuberStudioOn(response.status === 200);
        } catch (error) {
            console.error(error);
        }
    }
    return triggerVtuberStudioHotkey
}

export default VtuberStudio;