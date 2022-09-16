const { Type } = require("atils");

const StringType = new Type(String);
const ObjectType = new Type(Object);
const FunctionType = new Type(Function);
const ArrayType = new Type(Array);

/**
 * @name MKW
 * @description Creates a Vessel Class that allows for multiple methods under the same name.
 * @version 0.1.0
 */
module.exports = class {
    /**
     * 
     * @param {Object} options The options for the method group.
     *  @param {string} options.name The name for the method group.
     *  @param {Object[]} options.functions A collection of objects to determine the functions to be set.
     *   @param {Function} options.functions[].fn The function itself.
     *   @param {string[]} options.functions[].parameters An Array of Strings containing parameter types.
     * @returns A class with your methods.
     */
    constructor(options) {
        ObjectType.applyTo(options);

        const name = options?.name;
        StringType.applyTo(name);

        const functions = options?.functions;
        ArrayType.applyTo(functions);

        const vessel = class {};
        functions.forEach(obj => {
            ObjectType.applyTo(obj);

            FunctionType.applyTo(obj.fn);
            ArrayType.applyTo(obj.parameters);

            let fn = eval(obj.fn.toString().replace("this", "vessel.prototype"));

            let methodName = "<";
            obj.parameters.forEach(param => {
                StringType.applyTo(param);

                methodName = `${methodName}${param},`;
            });

            methodName = `${methodName}>${name}`;
            
            vessel.prototype[methodName] = fn;
        });

        /**
         * 
         * @param  {...any} parameters A collection of parameters to determine which method will be used. Ensure you use parameters in the correct oder.
         * @returns {*} Whatever your methods return.
         */
        vessel.prototype[name] = function(...parameters) {
            let methodName = `<`;
            parameters.forEach(param => {
                if(typeof param === "string") methodName = `${methodName}String,`;
                if(typeof param === "boolean") methodName = `${methodName}Boolean,`;
                if(typeof param === "number") methodName = `${methodName}Number,`;
                if(typeof param === "bigint") methodName = `${methodName}BigInt,`;
                if(typeof param === "symbol") methodName = `${methodName}Symbol,`;
                if(typeof param === "function") methodName = `${methodName}Function,`;
                if(Array.isArray(param)) methodName = `${methodName}Array,`;
                if(typeof param === "object" && param !== null && param !== object && !Array.isArray(param)) methodName = `${methodName}Object`;
            });

            methodName = `${methodName}>${name}`;

            return vessel.prototype[methodName](...parameters);
        }

        return vessel;
    }
}