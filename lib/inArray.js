/**
 * checks if an element is in array
 * @param  {Array}  array
 * @param  {Object} elem
 * @return {Boolean}
 */
module.exports = function(array,elem) {
    for(var i = 0; i < array.length; ++i) {
        if(array[i] === elem) {
            return true;
        }
    }

    return false;
};