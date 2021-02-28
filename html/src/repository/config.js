import sqliteService from '../service/sqlite.js';
import sharedRepository, { SharedRepository } from './shared.js';

var dirtyKeySet = new Set();

function transformKey(key) {
    return `config:${String(key).toLowerCase()}`;
}

async function syncLoop() {
    if (dirtyKeySet.size > 0) {
        try {
            await sqliteService.executeNonQuery('BEGIN');
            try {
                const keyArr = [];
                dirtyKeySet.keys().forEach(key => keyArr.push(key));
                const keyValReqs = keyArr.map((key) => sharedRepository.getString(key));
                const keyValResp = await Promise.all(keyValReqs);
                let i = 0
                for (var key of dirtyKeySet) {
                    var value = keyValResp[i];
                    if (value === null) {
                        await sqliteService.executeNonQuery(
                            'DELETE FROM configs WHERE `key` = @key',
                            {
                                '@key': key
                            }
                        );
                    } else {
                        await sqliteService.executeNonQuery(
                            'INSERT OR REPLACE INTO configs (`key`, `value`) VALUES (@key, @value)',
                            {
                                '@key': key,
                                '@value': value
                            }
                        );
                    }
                    i++;
                }
                dirtyKeySet.clear();
            } finally {
                await sqliteService.executeNonQuery('COMMIT');
            }
        } catch (err) {
            console.error(err);
        }
    }
    setTimeout(syncLoop, 100);
}

class ConfigRepository extends SharedRepository {
    async init() {
        await sqliteService.executeNonQuery(
            'CREATE TABLE IF NOT EXISTS configs (`key` TEXT PRIMARY KEY, `value` TEXT)'
        );
        await sqliteService.execute(
            async ([key, value]) => await sharedRepository.setString(key, value),
            'SELECT `key`, `value` FROM configs'
        );
        syncLoop();
    }

    async remove(key) {
        key = transformKey(key);
        await sharedRepository.remove(key);
        dirtyKeySet.add(key);
    }

    async getString(key, defaultValue = null) {
        key = transformKey(key);
        return (await sharedRepository.getString(key, defaultValue));
    }

    async setString(key, value) {
        key = transformKey(key);
        value = String(value);
        await sharedRepository.setString(key, value);
        dirtyKeySet.add(key);
    }
}

var self = new ConfigRepository();
window.configRepository = self;

export {
    self as default,
    ConfigRepository
};
