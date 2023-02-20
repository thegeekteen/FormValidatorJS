## FormValidatorJS v0.5 [BETA]
```js
/**
 * FormValidatorJS v0.5 [BETA]
 * (c) 2023 - Gian Lorenzo Abaño
 * Contact: 07agstar@gmail.com
 */
```
Form Validator is a `CodeIgniter 4` inspired form validation plugin for `JavaScript`. This plugin is still in `BETA` mode and not `battle tested`. So please bear with me. Thank you!
## Features

- CodeIgniter 4 Like Validation Syntax
- Painless Form Validation
- Bootstrap 5 Friendly
- Built-In Validators
- Supports Live Validation
- With Default Validation Error Messages


## Usage

Validate forms with this methods/functions:
- `validateForm()` - Validate form
- `validateString(value, rules, messages)` - Validate a string against the rule specified.
- `validateObject(theObject, rules, messages)` - Validate a Key-Value Object against the rules specified.

All of those methods/functions returns `true` on success, `false` on failure.

Get the Error Messages after Validation with this methods/functions:
- `getErrors()` - Returns the error in Key-Value Object
- `prettifyErrorsAll()` - Returns the error in an unordered list format.
- `prettifyErrors(errorMessage)` - Returns the error in an unordered list format (for usage with custom failed validation hook.)
- `getValidateStringError()` - Returns the error of `validateString()` method.
- `listErrors(errorMessage)` - Returns the error in array list format (for usage with custom failed validation hook.)
- `listErrorsAll()` - Returns the error in array list format.

Custom Hooks:
- `setSuccessHook()` - Set the function hook to run on every field that passed the validation (for live validation). The function parameters are: `element` (the DOM element of the field).
```javascript
validator.setSuccessHook((element) => {
    // SUCCESS: do something with element.
})

// or include in options
const options = {
    successHook: (element) => {
        // SUCCESS: do something with element
    }
}
```
- `setFailedHook()` - Set the function hook to run on every field that failed the validation (for live validation). The function parameters are: `errorMessages` (the errormessages object of the failed validation) and `element` (the DOM element of the field).
```javascript
validator.setFailedHook((errorMessage, element) => {
    // FAILED: do something with element.
    console.log(validator.listErrors(errorMessage)); // get errors as array
})

// or include in options
const options = {
    failedHook: (errorMessage, element) => {
        // FAILED: do something with element.
        console.log(validator.listErrors(errorMessage)); // get errors as array
    }
}
```
- `setResetHook()` - Set the function hook to run when `reset()` is called.
```javascript
validator.setResetHook(() => {
    // do something on reset
})

// or include in options
const options = {
    resetHook: () => {
        // do something on reset
    }
}
```

Custom Error Validation:
- `setErrorMessages(errorMessages)` - Set the Error Messages Object for Validation Errors.
```javascript
const errorMessages = {
    "name":{
        "required":"The {field} is required",
        "exact_length":"{field} with value: '{value}' don't match the exact length of: {param}"
    }
}
validator.setErrorMessages(errorMessages);

// or include in options
const options = {
    "errorMessages": errorMessages
}
```
- `addValidator(validationClass)` - Add a Validation Class to use. (see examples below)
- `setValidator(validationClass)` - Set the Validation Class to use. (will not use the default validation class).
- `setValidators([validationClass1, validationClass2])` - Set the Validations Classes to use. If you want to also include the default validation class, add `FormValidator.defaultRuleSet` class.

The Message String can contain variables: `{field}` (the field name), `{value}` (the field value), `{param}` (the param of the validator)

## Examples

### Options
These are the default options:
```javascript
options = {
    rules: {},
    errorMessages: {},
    validationClasses: [FormValidator.defaultRuleSet] // include `FormValidator.defaultRuleSet` for default validation methods.
    liveValidation: false, // If you want to validate every form keyup/change
    useDefaultHooks:false, // If you want to use default hooks (for bootstrap 5 forms)
    resetHook: null, // called when `reset()` is executed.
    successHook: null, // called when a validation is succ
    failedHook: null, // called when validation failed.
}
const validator = new FormValidator(form, options);
```

### Initialization
```javascript
// Create a new instance.
// Will throw an Exception when FormValidator is already
// initialized on the form.
const validator = new FormValidator(form, options)
// Get the existing instance. 
// When not initialized on the form, Create a new instance.
const validator = FormValidator.getOrCreateInstance(form, options)
```
### Attach Bootstrap 5 Live Validation and Validate Form:

`HTML`:
```html
<form id="theForm">
    <div class="form-group">
        <label class="form-label">Name:</label>
        <input type="text" class="form-control" name="name" validation="required|min_length[5]" value="" />
        <div class="invalid-feedback">
        </div>
    </div>
    <div class="form-group">
        <label class="form-label">Age:</label>
        <input type="text" class="form-control" name="age" validation="required|integer|greater_than_equal_to[18]|less_than_equal_to[60]" value="" />
        <div class="invalid-feedback">
    </div>
    </div>
</form>
```

`JavaScript`:
```javascript
const theForm = document.getElementById('theForm');
// error messages
const messages = {
    "name": {
        "required":"Your {field} is required.",
        "min_length":"The minimum characters of your {field} : {value} should be {param}"  
     },
    "age":{
        "required":"Your {field} is required.",
        "integer":"{value} is not a valid integer",
        "greater_than_equal_to":"Your age must be {param} and above.",
        "less_than_equal_to":"Your age must be {param} and below."
    }
}
// initialize `FormValidator()`
const validator = new FormValidator(theForm, {
    errorMessages: messages,
    liveValidation: true,
    useDefaultHooks: true
});
// validate form
const result = validator.validateForm();
if (result) {
    // validation success!
    validator.reset(); // clear form and errors.
    } else {
    // there is an error.
    console.log(validator.getErrors()); // Get Errors in object format
    console.log(validator.prettifyErrorsAll()); // Get all errors in Unordered List format
    console.log(validator.listErrorsAll()); // Get all errors in array format
}
```

### Validate a Key-Value Object

```javascript
const data = {
    "name":"Gian Abano",
    "age":24
}
const rules = {
    "name":"required|min_length[5]",
    "age":"required|integer|greater_than_equal_to[18]|less_than_equal_to[60]"
}
const messages = {
    "name":{
        "required":"Your {field} is required",
        "min_length":"Your {field} must exceed the minimum length of {param}"
    },
    "age":{
        "required":"{field} is required",
        "integer":"{field} must be a valid number",
        "greater_than_equal_to":"You are only {value}. Minimum age requirement is {param}",
        "less_than_equal_to":"You are already {value}. Maximum age requirement is {param}"
    },
}
const validator = new FormValidator(); // <-- If you don't need DOM Form Validation, don't add parameters.
const response = validator.validateObject(data, rules, messages);
if (response) {
    // validation success
    validation.reset();
} else {
    console.log(validator.getErrors()); // Get Errors in object format
    console.log(validator.prettifyErrorsAll()); // Get all errors in Unordered List format
}
```

### Validate a String

```javascript
const value = "17";
const rules = "required|integer|greater_than_equal_to[18]|less_than_equal_to[60]";
const messages = {
    "required":"Age is required",
    "integer":"Must be a valid number",
    "greater_than_equal_to":"You are only {value}. Minimum age requirement is {param}",
    "less_than_equal_to":"You are already {value}. Maximum age requirement is {param}"
}
const validator = new FormValidator(); // <-- If you don't need DOM Form Validation, don't add parameters.
const response = validator.validateString(value, rules, messages);
if (response) {
// age is >= 18 and <= 60
} else {
// underage.
console.log(validator.getValidateStringError()); // get validation errors
}
```

### Create your own Validation Class

```javascript
const myValidationClass = class {
    /**
     * @param {String} value    The Value to validate
     * @param {String} params   Parameters for Validation
     * @param {Object} form     The DOMForm / Object
     */
    static isGood(value, param, form) {
        return value == "good" && param == "veryGood";
    }
}
validator.addValidator(myValidationClass);
```

And use on your `HTML` like this:

```html
<form id="theForm">
    <div class="form-group">
        <label class="form-label">Only Accepts Good:</label>
        <input type="text" class="form-control" name="name" validation="required|good[veryGood]" value="" />
        <div class="invalid-feedback">
        </div>
    </div>
</form>
```

### Reset Errors
This will reset errors and execute `reset` hook.

```javascript
// This will reset errors and execute `reset` hook.
validator.reset(); 
```

### Destroy
Destroy `FormValidation` instance (including live validation). Please note that this will only remove the `FormValidation` instance pointer from the `form` DOM Element, and make validation methods throw `Error` exceptions.

```javascript
// pass `true` as paramater for hard reset.
validator.reset(true); 

// This will throw exceptions when called after `reset(true)`.
validator.validate();
validator.validateString(...);
validator.validateObject(...);
```

## Default Validation Rules

| Rule                  | Parameter | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Example                                            |
| :-------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| alpha                 | No        | Fails if field has anything other than alphabetic characters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                    |
| alpha_space           | No        | Fails if field contains anything other than alphabetic characters or spaces.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                    |
| alpha_dash            | No        | Fails if field contains anything other than alphanumeric characters, underscores or dashes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                    |
| alpha_numeric         | No        | Fails if field contains anything other than alphanumeric characters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                                                    |
| alpha_numeric_space   | No        | Fails if field contains anything other than alphanumeric or space characters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |                                                    |
| alpha_numeric_punct   | No        | Fails if field contains anything other than alphanumeric, space, or this limited set of punctuation characters: ~ (tilde), ! (exclamation), # (number), $ (dollar), % (percent), & (ampersand), * (asterisk), - (dash), _ (underscore), + (plus), = (equals), \| (vertical bar), : (colon), . (period).                                                                                                                                                                                                                                                                                                                                            |                                                    |
| decimal               | No        | Fails if field contains anything other than a decimal number. Also accepts a + or  - sign for the number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                    |
| differs               | Yes       | Fails if field does not differ from the one in the parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | differs[field_name]                                |
| exact_length          | Yes       | Fails if field is not exactly the parameter value. One or more comma-separated values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | exact_length[5] or exact_length[5,8,12]            |
| greater_than          | Yes       | Fails if field is less than or equal to the parameter value or not numeric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | greater_than[8]                                    |
| greater_than_equal_to | Yes       | Fails if field is less than the parameter value, or not numeric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | greater_than_equal_to[5]                           |
| in_list               | Yes       | Fails if field is not within a predetermined list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | in_list[red,blue,green]                            |
| integer               | No        | Fails if field contains anything other than an integer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                                                    |
| is_natural            | No        | Fails if field contains anything other than a natural number: 0, 1, 2, 3, etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |                                                    |
| is_natural_no_zero    | No        | Fails if field contains anything other than a natural number, except zero: 1, 2, 3, etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                    |
| less_than             | Yes       | Fails if field is greater than or equal to the parameter value or not numeric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | less_than[8]                                       |
| less_than_equal_to    | Yes       | Fails if field is greater than the parameter value or not numeric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | less_than_equal_to[8]                              |
| matches               | Yes       | The value must match the value of the field in the parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | matches[field]                                     |
| max_length            | Yes       | Fails if field is longer than the parameter value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | max_length[8]                                      |
| min_length            | Yes       | Fails if field is shorter than the parameter value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | min_length[3]                                      |
| not_in_list           | Yes       | Fails if field is within a predetermined list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | not_in_list[red,blue,green]                        |
| numeric               | No        | Fails if field contains anything other than numeric characters.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                    |
| regex_match           | Yes       | Fails if field does not match the regular expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | regex_match[/regex/]                               |
| permit_empty          | No        | Allows the field to receive an empty array, empty string, null or false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |                                                    |
| required              | No        | Fails if the field is an empty array, empty string, null or false.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                                                    |
| required_with         | Yes       | The field is required when any of the other required fields are present in the data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | required_with[field1,field2]                       |
| required_without      | Yes       | The field is required when any of other fields do not pass required checks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | required_without[field1,field2]                    |
| string                | No        | A generic alternative to the alpha* rules that confirms the element is a string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                    |
| valid_email           | No        | Fails if field does not contain a valid email address.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                                                    |
| valid_ip              | No        | Fails if the supplied IP is not valid. Accepts an optional parameter of ‘ipv4’ or ‘ipv6’ to specify an IP format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | valid_ip[ipv6]                                     |
| valid_url             | No        | Fails if field does not contain (loosely) a URL. Includes simple strings that could be hostnames, like “codeigniter”.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                                                    |
| valid_date            | No        | Fails if field does not contain a valid date. Accepts an optional parameter to matches a date format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | valid_date[YYYY-MM-DD]                             |
|                       |           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |                                                    |

## License
[MIT](https://choosealicense.com/licenses/mit/)
```
Copyright 2023 - Gian Abaño

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
