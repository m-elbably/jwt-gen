const jwt = require('jsonwebtoken');
const inquirer = require('inquirer');
const chalkPipe = require('chalk-pipe');
const ui = new inquirer.ui.BottomBar();

function createJwtToken(payload, secret, expiration = 0) {
    return new Promise((resolve, reject) => {
        if(expiration > 0) {
            const currentTime = parseInt(new Date(Date.now()).getTime() / 1000);
            const expireAfter = parseInt(expiration / 1000);
            payload.exp = currentTime + expireAfter;
        }

        jwt.sign(payload, secret, (err, token) => {
            if (err) {
                return reject(err);
            }

            resolve(token);
        });
    });
}


ui.log.write(chalkPipe('bgGreen.black.bold')('# JWT Token Generator #'));

inquirer
    .prompt([
        {
            type: 'input',
            name: 'payload',
            message: "Payload data (JSON Object):",
            validate: function(value) {
                try {
                    JSON.parse(value);
                    return true;
                }catch(e){
                    return 'Please enter a valid JSON object';
                }
            }
        },
        {
            type: 'password',
            name: 'secret',
            message: "JWT secret:",
            validate: function(value) {
              if (value && value.length > 0) {
                return true;
              }

              return 'Please enter a valid secret.';
            }
        },
        {
            type: 'number',
            name: 'expiration',
            default: 0,
            message: "Token expiration (Ms):",
            validate: function(value) {
                try {
                    parseInt(value);
                    return true;
                }catch(e){
                    return 'Please enter a valid number in milliseconds.';
                }
            }
        }
    ])
    .then(answers => {
        const { payload, secret, expiration } = answers;
        createJwtToken(payload, secret, expiration)
            .then((key) => {
                ui.log.write(chalkPipe('white')('\nJWT Token'));
                ui.log.write(chalkPipe('bgCyan.black.bold')(key));
            });
    });


