import json
from src.config import settings as config


class DatabaseService:
    def is_exist_table(self, cursor):
        sql = 'SELECT NAME FROM SQLITE_MASTER WhERE TYPE = \'table\' AND NAME = \'TBL_SETTINGS\''
        cursor.execute(sql)
        exist = bool(cursor.fetchone())
        return exist


    def query_settings(self, db):
        server_type = '\',\''.join(config.SETTINGS_ITEMS)
        sql = 'SELECT TYPE, CONTENT FROM TBL_SETTINGS WhERE TYPE IN (\'{0}\')'.format(server_type)
        cursor = db.cursor()
        cursor.execute(sql)
        settings = cursor.fetchall()
        cursor.close()
        result = { 'data': {} }
        for _, item in enumerate(settings):
            result['data'][item[0]] = json.loads(item[1])
        return result


    def write_config(self, db, source):
        if source is None:
            return False
        row_count = 0
        cursor = db.cursor()
        for _, item in enumerate(config.SETTINGS_ITEMS):
            if item in source:
                sql = 'REPLACE INTO TBL_SETTINGS VALUES (\'' + item + '\', \'' + json.dumps(source[item]) + '\')'
                cursor.execute(sql)
                row_count += cursor.rowcount
        db.commit()
        cursor.close()
        return row_count > 0