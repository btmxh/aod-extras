const { writeFileSync } = require("fs");
const { read_aod, id } = require("./common");

const OUTPUT = "search.tsv";
const DELIM = "\t";
const NEWLINE = "\n";

let content = "";
read_aod().forEach(entry => {
    const entry_id = id(entry.sources);
    content += entry_id;
    content += DELIM;

    content += entry.title;
    entry.synonyms.forEach(synonym => {
        content += DELIM;
        content += synonym;
    });

    content += NEWLINE;
});

writeFileSync(OUTPUT, content);