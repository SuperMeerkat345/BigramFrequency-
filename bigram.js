const fs = require('fs').promises;
const alphabet = "abcdefghijklmnopqrstuvwxyz";




async function popData() {
    try {
        const rawData = await fs.readFile('./JEOPARDY_QUESTIONS1.json', 'utf-8');
        const jsonData = JSON.parse(rawData); // Convert to JSON object

        let compactData = jsonData.map(obj => obj.question).join(' ')
            .replace(/<[^>]*>/g, "") // Removes everything between '<' and '>'
            .replace(/[^a-zA-Z\s]/g, "") // Removes everything except letters and spaces
            .toLowerCase();

        console.log(compactData); // Print extracted questions
        return compactData; // Return data if needed
    } catch (error) {
        console.error("Error reading or parsing JSON:", error);
    }

}

let bigrams = { // additional a and i in order to account for the one letter words as well
    ' a ': 0,
    ' i ': 0
};

async function popBigrams() {
    for(let i = 0; i < alphabet.length; i++) {
        for (let j = 0; j < alphabet.length; j++) {
            bigrams[alphabet[i] + alphabet[j]] = 0;
        }
    }

    const data = await popData(); 
    for (let bigram in bigrams) {
        let regex = new RegExp(bigram, "g"); // Match multiple occurrences
        bigrams[bigram] = (data.match(regex) || []).length;
    }

    console.log(bigrams); // View frequency of each bigram
    await fs.writeFile('./bigramData.json', JSON.stringify(bigrams, null, 2), 'utf-8');
}

popBigrams();







