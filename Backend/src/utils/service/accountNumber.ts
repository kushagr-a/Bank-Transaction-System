export const generateAccountNumber = (): string => {
    const randomNum1 = Math.floor(100 + Math.random() * 900); // 3 digits
    const randomNum2 = Math.floor(100 + Math.random() * 900); // 3 digits
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomAlpha = "";
    for (let i = 0; i < 3; i++) {
        randomAlpha += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }

    return `123${randomNum1}4567${randomAlpha}8910${randomNum2}`;
};  