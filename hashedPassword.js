const bcrypt = require('bcryptjs');

const password = 'Uxpypte6eb@135';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log(`Hashed password: ${hash}`);
});
