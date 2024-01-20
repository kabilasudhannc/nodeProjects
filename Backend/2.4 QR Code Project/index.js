/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import fs from 'fs';
import qr_image from 'qr-image';

const prompt = inquirer.createPromptModule();

prompt([{
    type: 'input',
    name: 'question',
    message: 'Enter the url:'
}]).then((answers) => {
    var qr_png = qr_image.image(`https://${answers.question}`, {type: 'png'});
    qr_png.pipe(fs.createWriteStream(`${answers.question}.png`));

    fs.appendFile('urls.txt', `${answers.question}\n`, (err) => {
        if (err) throw err;
        console.log('Saved!');
    });
});