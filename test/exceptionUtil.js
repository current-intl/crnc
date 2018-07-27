module.exports = function (fn, msg = ''){
    return function(...args){
        return fn(...args)
                .then(() => assert.fail())        
                .catch((err) => {
                    if(err.name == "AssertionError"){
                        throw new Error(msg);
                    }
                });
    }
};