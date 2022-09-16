const fns = require("./index.js");

const c = new fns({
    name: "say",
    functions: [
        {
            fn: (string) => {
                console.log(string);
                return this;
            },

            parameters: ["String"],
        },
        {
            fn: (number) => {
                console.log(number + " is a number.");
                return this;
            },

            parameters: ["Number"]
        }
    ]
});

/*
    new c()
        .say(1)
        .say("hello")
*/
