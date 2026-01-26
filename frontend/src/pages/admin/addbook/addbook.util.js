export function generateCallNumber(classificationCode, authorName, year, setList) {
    if (!classificationCode || !authorName || !year) return;

    const lastName = authorName.trim().split(" ").pop().toLowerCase();
    const firstLetter = lastName[0].toUpperCase();

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const getVal = (ch) => {
        if(!ch || alphabet.indexOf(ch) === -1) return "";
        const index = alphabet.indexOf(ch) + 1;
        return index < 10 ? index : Math.ceil(index/10);
    }

    const second = getVal(lastName[1]);
    const third = getVal(lastName[2]);
    const fourth = getVal(lastName[3]);

    const numericCode = `${second}${third}${fourth}`;

    console.log("called call number generator");

    // Return Dewey-style call number
    setList(prev => {
        const callNum = {...prev, callNumber: `${classificationCode}.${firstLetter}${numericCode} ${year}`};
        return callNum
    });
}