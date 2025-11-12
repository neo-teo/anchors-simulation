export function generateName() {
    const letters = "bcdfghjklmnpqrstvwxyz";
    const vowels = "aeiou";
    let name = "";
    let vowelNext = Math.random() < 0.5;
    const numLetters = Math.random() < 0.5 ? 3 : 4; // e.g. "mel", "tarn"
    for (let i = 0; i < numLetters; i++) {
        if (!vowelNext) name += letters[Math.floor(Math.random() * letters.length)];
        else name += vowels[Math.floor(Math.random() * vowels.length)];

        vowelNext = !vowelNext;
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}