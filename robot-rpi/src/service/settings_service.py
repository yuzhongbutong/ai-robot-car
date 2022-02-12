import json
from src.config import settings as config
from src.service.broker_service import BrokerService


class DatabaseService:
    def is_exist_table(self, cursor):
        sql = 'SELECT NAME FROM SQLITE_MASTER WhERE TYPE = \'table\' AND NAME = \'TBL_SETTINGS\''
        cursor.execute(sql)
        exist = bool(cursor.fetchone())
        return exist

    def query_settings(self, db):
        server_type = '\',\''.join(config.SETTINGS_ITEMS)
        sql = 'SELECT TYPE, CONTENT FROM TBL_SETTINGS WhERE TYPE IN (\'{0}\')'.format(
            server_type)
        cursor = db.cursor()
        cursor.execute(sql)
        settings = cursor.fetchall()
        cursor.close()
        broker_service = BrokerService()
        client_type = broker_service.get_client_type()
        result = {'client_type': client_type, 'data': {}}
        for _, item in enumerate(settings):
            result['data'][item[0]] = json.loads(item[1])
        return result

    def write_settings(self, db, source):
        if source is None:
            return False
        row_count = 0
        cursor = db.cursor()
        for _, item in enumerate(config.SETTINGS_ITEMS):
            if item in source:
                sql = 'REPLACE INTO TBL_SETTINGS VALUES (\'' + item + '\', \'' + json.dumps(
                    source[item]) + '\')'
                cursor.execute(sql)
                row_count += cursor.rowcount
        db.commit()
        cursor.close()
        return row_count > 0

    def connect_settings(self, source):
        if source is None:
            return None
        keys = source.keys()
        host = None
        port = 0
        userName = None
        password = None
        client_id = None
        user_data = None
        if config.SETTINGS_ITEMS_INTERNAL in keys:
            host = source[config.SETTINGS_ITEMS_INTERNAL].get('host')
            port = int(source[config.SETTINGS_ITEMS_INTERNAL].get('port', '1883'))
            userName = source[config.SETTINGS_ITEMS_INTERNAL].get('userName')
            password = source[config.SETTINGS_ITEMS_INTERNAL].get('password')
            client_id = config.MQTT_CLIENT_ID
            user_data = { 'client_type': config.SETTINGS_ITEMS_INTERNAL }
        elif config.SETTINGS_ITEMS_WATSON in keys:
            orgId = source[config.SETTINGS_ITEMS_WATSON].get('orgId')
            userName = 'a-' + orgId + '-' + source[config.SETTINGS_ITEMS_WATSON].get('userName')
            password = source[config.SETTINGS_ITEMS_WATSON].get('password')
            client_id = 'a:' + orgId + ':' + config.MQTT_CLIENT_ID
            host = orgId + '.messaging.internetofthings.ibmcloud.com'
            port = 1883
            user_data = { 'client_type': config.SETTINGS_ITEMS_WATSON }
        broker_service = BrokerService()
        is_connected = broker_service.connect_settings(host, port, userName, password, client_id, user_data)
        if is_connected:
            return user_data['client_type']
        return None