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
                console.log("NEw YUP FUNCTION 2: "+ value);
                let result = containsOnlyNumbersFunction(value);
                console.log("HERE IS THE RESULT OF FUNCTION 2: "+ result);
                return result;
            }
        })
    }

    //this uses a format HH:MM to evaluate the time, so it needs
   isLaterThan(ref,msg) {
        return this.test({
            name: 'isLaterThan',
            exclusive: false,
            message: msg || '${path} must be the same as ${reference}',
            params: {
                reference: ref.path
            },
            test: function(value) {
                return isLaterThanFunction(value,this.resolve(ref))
            }
        })
   }
}

export default () => new NewYupString();