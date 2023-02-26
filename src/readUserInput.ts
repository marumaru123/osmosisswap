import * as readline1 from 'readline';

export default function readUserInput(question: any) {
    const readline = readline1.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject: any) => {
        readline.question(question, (answer) => {
            resolve(answer);
            readline.close();
        });
    });
}
