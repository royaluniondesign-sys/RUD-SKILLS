'use strict';

const { exec } = require('child_process');

// Replace '<owner/repo>' with the actual owner and repository name.
const repo = '<owner/repo>';

function addSkill() {
    return new Promise((resolve, reject) => {
        exec(`npx skills add ${repo}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
                return;
            }
            resolve(`Success: ${stdout}`);
        });
    });
}

// Example usage
addSkill()
    .then(successMessage => console.log(successMessage))
    .catch(errorMessage => console.error(errorMessage));
