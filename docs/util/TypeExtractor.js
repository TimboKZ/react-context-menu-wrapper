const fs = require('fs');

const lineBreakRegex = /\r?\n/;
const exportRegex = /^export\s+/;

const typeExtractor = data => {
    const { typeName, filePath } = data;
    let offset = data.offset ? data.offset : 0;

    const lines = fs.readFileSync(filePath, 'utf-8').split(lineBreakRegex);
    const typeStartRegex = new RegExp(`(export)?\\s+(interface|type|enum)\\s+${typeName}\\s*(<|=|=\\s+{|{)`);

    let typeLines = [];
    let recording = false;
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if (recording) {
            typeLines.push(line);
            if (line.startsWith('}') || line.startsWith('};')) break;
        } else {
            const match = line.match(typeStartRegex);
            if (match) {
                typeLines.push(line);

                let j = i - 1;
                while (j >= 0) {
                    if (lines[j].startsWith('//') || offset-- > 0) {
                        typeLines.unshift(lines[j]);
                    } else {
                        break;
                    }
                    j--;
                }

                const singleLine = match[3] === '=';
                if (singleLine) break;
                else recording = true;
            } else {
                if (line.startsWith('//')) docLines.push(line);
                else docLines = [];
            }
        }
    }
    return typeLines.map(line => line.replace(exportRegex, '')).join('\n');
};

module.exports = typeExtractor;
