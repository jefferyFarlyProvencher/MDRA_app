// yup 'import'?
import * as yup from 'yup'

//functions import
import containsOnlyNumbersFunction from '../../functions/containsOnlyNumbers';
import isLaterThanFunction from '../../functions/isLaterThan';

class NewYupString extends yup.string {

    equalTo(ref, msg) {
        return this.test({
            name: 'equalTo',
            exclusive: false,
            message: msg || '${path} must be the same as ${reference}',
            params: {
                reference: ref.path
            },
            test: function(value) {
                return value === this.resolve(ref)
            }
        })
    }

   containsOnlyNumbers(msg) {
        return this.test({
            message: msg || '${path} is does not contain solely numbers',
            name: 'containsOnlyNumbers',
            exclusive: true,
            test: function(value) {
                if(value){
                //console.log("NEw YUP FUNCTION 2: "+ value);
                    let result = containsOnlyNumbersFunction(value);
                    //console.log("HERE IS THE RESULT OF FUNCTION 2: "+ result);
                    return result;
                }
                return true
            }
        })
    }

    //this uses a format HH:MM to evaluate the time, so it needs
   isLaterThan(ref,msg) {
        return this.test({
            name: 'isLaterThan',
            exclusive: false,
            message: msg || '${path} must be later than ${reference}',
            params: {
                reference: ref.path
            },
            test: function(value) {
                if(value) {
                    let valueToCompare = this.resolve(ref);
                    //console.log("later ref: "+ ref);
                    //console.log("is it a number? "+ (typeof ref ==='number'&& (ref > 24 && ref < 0)) );
                    //console.log("RESOLVED;  "+ valueToCompare);
                    //console.log("laterThan||| PRINTING VALUETOCOMPARE: "+ valueToCompare +" <-if empty supposed to be here");
                    let result = isLaterThanFunction(""+value, ""+valueToCompare);
                    //console.log("ISLATERTHAN FINISHED");
                    //console.log("isLaterThan result: "+ result);
                    return result
                }
                return true
            }
        })
   }

    isEarlierThan(ref,msg) {
        return this.test({
            name: 'isEarlierThan',
            exclusive: false,
            message: msg || '${path} must be earlier than ${reference}',
            params: {
                reference: ref.path
            },
            test: function(value) {
                if(value) {
                    let valueToCompare = this.resolve(ref);
                    //console.log("earlier ref: "+ ref);
                    //console.log("is it a number? "+ (typeof ref ==='number'&& (ref > 24 && ref < 0)));
                    //console.log("RESOLVED;  "+ valueToCompare);
                    //console.log("earlier than ||| PRINTING VALUETOCOMPARE: "+ valueToCompare +" <-if empty supposed to be here");
                    let result = isLaterThanFunction(""+valueToCompare, ""+value);
                    //console.log("ISEARLIERTHAN FINISHED");
                    //console.log("isEarlierThan result: "+ result);
                    return result;
                }
                return true
            }
        })
    }
}

export default () => new NewYupString();