const say = require('say');

say.export("Now playing ", 'Richard', 1, 'test.wav', (err) => {
    if (err) {
        console.error(err);
        return;
    }
})