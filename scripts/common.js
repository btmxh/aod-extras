const fs = require('fs');
const crypto = require('crypto');

const AOD_PATH = "anime-offline-database/anime-offline-database.json";
const PRIORITY_LIST = [
    "myanimelist.net",
    "anime-planet.com",
    "kitsu.io",
    "anisearch.com",
    "notify.moe",
    "anilist.co",
    "anidb.net",
    "livechart.me"
];

exports.read_aod = function () {
    const content = fs.readFileSync(AOD_PATH);
    const data = JSON.parse(content).data;
    return data;
};

exports.id = function(sources) {
    const urlScore = source => {
        for(const i in PRIORITY_LIST) {
            if(source.includes(PRIORITY_LIST[i])) {
                return i;
            }
        }
        return PRIORITY_LIST.length;
    };

    return sources.reduce((prev, curr) => urlScore(prev) < urlScore(curr)? prev : curr);
}

exports.hash_string = function(input) {
    return crypto.createHash("sha1").update(input).digest('hex');
}