export class Constant {
    public static API = {
        LOGIN: '/api/login',
        QUERY_SETTINGS: '/api/query-settings',
        SAVE_SETTINGS: '/api/save-settings',
        CONNECT_SETTINGS: '/api/connect-settings'
    };

    public static CLIENT_TYPE = {
        INTERNAL: 'internal',
        WATSON: 'watson'
    }

    public static MESSAGE_TYPE = {
        RECEIVE: 'receive',
        PUBLISH: 'publish'
    }

    public static SOCKET = {
        NAMESPACE_CAR: '/car'
    }
}
