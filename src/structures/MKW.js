const { Type } = require("atils");

const StringType = new Type(String);
const ObjectType = new Type(Object);
const FunctionType = new Type(Function);
const ArrayType = new Type(Array);

/**
 * @name MKW
 * @description Creates a Vessel Class that allows for multiple methods under the same name.
 * @version 0.1.1
 */
module.exports = class {
    /**
     * 
     * @param {Object} options The options for the method group.
     *  @param {Function} options.constructor - The constructor for the vessel class.
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

        const constructor = options?.constructor ?? function() {};
        FunctionType.applyTo(constructor);

        const iParams = {
            all: []
        };

        const vessel = class {};
        vessel.prototype.constructor = constructor;

        functions.forEach(obj => {
            ObjectType.applyTo(obj);

            FunctionType.applyTo(obj.fn);
            ArrayType.applyTo(obj.parameters);

            let fn = eval(obj.fn.toString().replace("this", "vessel.prototype"));

            let methodName = "<";
            obj.parameters.forEach(param => {
                if(isClass(param)) {
                    iParams[param.prototype.constructor.name] = param;
                    iParams.all.push(param.prototype.constructor.name);
                    param = param.prototype.constructor.name;
                }
                StringType.applyTo(param);

                methodName = `${methodName}${param},`;
            });

            methodName = `${methodName}>${name}`;
            
            vessel.prototype[methodName] = fn;
        });

        /**
         * 
         * @param  {...any} parameters A collection of parameters to determine which method will be used. Ensure you use parameters in the correct order. As of @0.1.1, you can now use Classes.
         * @returns {*} Whatever your methods return.
         */
        vessel.prototype[name] = function(...parameters) {
            let methodName = `<`;
            parameters.forEach(param => {
                let gate = false;

                iParams.all.forEach(p => {
                    if(param instanceof iParams[p]) {
                        methodName = `${methodName}${p},`;
                        gate = true;
                    }
                });

                if(gate === true) return;

                if(typeof param === "string") methodName = `${methodName}String,`;
                else if(typeof param === "boolean") methodName = `${methodName}Boolean,`;
                else if(typeof param === "number") methodName = `${methodName}Number,`;
                else if(typeof param === "bigint") methodName = `${methodName}BigInt,`;
                else if(typeof param === "symbol") methodName = `${methodName}Symbol,`;
                else if(typeof param === "function") methodName = `${methodName}Function,`;
                else if(Array.isArray(param)) methodName = `${methodName}Array,`;
                else if(typeof param === "object" && param !== null && param !== undefined && !Array.isArray(param) && typeof param !== "function" && !isClass(param)) {
                    methodName = `${methodName}Object`;
                }
            });

            methodName = `${methodName}>${name}`;
            return vessel.prototype[methodName](...parameters);
        }

        return vessel;
    }
}

function isClass(v) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}
