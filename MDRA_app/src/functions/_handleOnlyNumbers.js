import * as Yup from "yup";

export default _handleOnlyNumbers = function(msg){
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || 'Must contain only numbers',
        test: function(value) {
            console.log("evaluating onlyNumbers");
            console.log(value);
            console.log(/[a-zA-Z]+/.test(value));
            return /^\d+$/.test(value);
        },
    });
};