# aod-extras
> README PRs welcomed, I'm bad at English

Additional files for manami-project's [anime-offline-database](https://github.com/manami-project/anime-offline-database) to make things easier to manage.

(This branch only contains script to generate the files.)

Since anime-offline-database's content is a huge JSON file (about 40 mb), parsing it just to do an anime search or even finding info for an anime is a heavy task. This repo aims to support anime-offline-database with these tasks by dividing the json database file into multiple smaller sections, and adding a file only with anime ID, names and their synonyms to quickly query anime ID from a search string.

## Anime ID system
In order to query animes, we need a ID system.  

Since the way anime-offline-database orders anime is by the anime's title in alphabetical order, we can't rely on their indices in the database array. This is why the ID should depends on the actual properties of the anime, like the title or its sources. Anime titles are not required to be unique, but their sources URL are. Source URLs may change, but that will only happen with very few anime, or maybe it won't happen at all. 

The naivest approach is combining all of its source URLs. This is not optimal, since anime sites may add more entries after anime-offline-database first created the entry without the source URL, and then next week, the URL will be added, which changes the ID. In order to minimize this issue, the best approach is to take the most prioritized URL (for example: take MyAnimeList URL, if it doesn't exist, take AniList URL, if it also doesn't exist, take Kitsu URL, etc.)

Therefore, the best ID system (I think) we can use is just taking the source URL, using this priority list:
* myanimelist.net
* anime-planet.com
* kitsu.io
* anisearch.com
* notify.moe
* anilist.co
* anidb.net
* livechart.me

### Examples:
The anime "Bokutachi no Remake" with its corresponding JSON entry:
```jsonc
{
  "sources": [
    "https://anidb.net/anime/15320",
    "https://anilist.co/anime/114065",
    "https://anime-planet.com/anime/remake-our-life",
    "https://kitsu.io/anime/42924",
    "https://myanimelist.net/anime/40904",
    "https://notify.moe/anime/Y2eEDZzMR"
  ],
  "title": "Bokutachi no Remake",
  "type": "TV",
  "episodes": 12,
  //...
}
```
will have ID: "https://myanimelist.net/anime/40904" (MAL > AP > KS > NM > AL > ADB)

The anime "Kano - Daisy Blue" (yes it has an anime entry) with JSON:
```jsonc
{
  "sources": [
    "https://anime-planet.com/anime/kano-daisy-blue"
  ],
  "title": "Kano: Daisy Blue",
  "type": "SPECIAL",
  "episodes": 1,
  "status": "FINISHED",
  "animeSeason": {
    "season": "UNDEFINED",
    "year": 2017
  },
  "picture": "https://anime-planet.com/images/anime/covers/kano-daisy-blue-10720.jpg",
  "thumbnail": "https://anime-planet.com/images/anime/covers/thumbs/kano-daisy-blue-10720.jpg",
  "synonyms": [],
  "relations": [],
  "tags": []
}
```

will have ID: "https://anime-planet.com/anime/kano-daisy-blue" (only AP source available)

## Split anime directory

After the ID system is defined, we can split the anime database into multiple smaller ones by calculating the hash of the ID and grouping them by that hash modulo some number. I'll choose the number 1024. The hash function doesn't need to be secure so SHA-1 will do the trick.
The mini-databases will be put in directory `minidb`, and named `$modulus.json` (example: minidb/1023.json)

## Search files

A file with only anime ID, title and synonyms will be located at path ./search.tsv. It's a .tsv (tab-separated values) file, every line of it will be `animeID<TAB>animeTitle<TAB>animeSynonym1<TAB>animeSynonym2<TAB>...` (`<TAB>` is a tab character).  
This file is used to make searching anime easier.

## Scripts

node.js scripts to generate the above files are in directory `scripts/` (split_gen.js and search_gen.js)
To run them, you need node.js installed and run in your terminal (from the main/root directory):
```bash
node %script_file_path%
# example:
# node scripts/split_gen.js
```
Note: These scripts load the entire database into RAM, so they need a lot of memory.
