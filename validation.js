/* eslint-disable no-unused-vars */ 

/**
 * FormValidatorJS v0.5 [BETA]
 * (c) 2023 - Gian Lorenzo Abaño
 * Contact: 07agstar@gmail.com
 * 
 * @class FormValidator
 */
class FormValidator {
    #currentForm = null;
    #errorMessage = "";
    #errorMessages = {};
    #rules = {};
    #errors = {};
    #validationClasses = [FormValidator.defaultRuleSet];

    /**
     * Creates an instance of FormValidator.
     * @param {*} [form=null]
     * @param {*} [options={
     *         rules: {},
     *         errorMessages: {},
     *         validationClasses: [FormValidator.defaultRuleSet],
     *         resetHook: null,
     *         successHook: null,
     *         failedHook: null,
     *     }]
     * @memberof FormValidator
     */
    constructor(form = null, options = {
        rules: {},
        errorMessages: {},
        validationClasses: [FormValidator.defaultRuleSet],
        resetHook: null,
        successHook: null,
        failedHook: null,
    }) {
        if (form != null)
            this.#currentForm = form;
        if (options?.["rules"] !== null && typeof options?.["rules"] !== 'undefined')
            this.#rules = options["rules"];
        if (options?.["errorMessages"] !== null && typeof options?.["errorMessages"] !== 'undefined')
            this.#errorMessages = options["errorMessages"];
        if (options?.["validationClasses"] !== null && typeof options?.["validationClasses"] !== 'undefined')
            this.#validationClasses = options["validationClasses"];

        if (options?.["resetHook"] !== null && typeof options?.["resetHook"] !== 'undefined')
            this.#resetHook = options["resetHook"];
        if (options?.["successHook"] !== null && typeof options?.["successHook"] !== 'undefined')
            this.#successHook = options["successHook"];
        if (options?.["failedHook"] !== null && typeof options?.["failedHook"] !== 'undefined')
            this.#failedHook = options["failedHook"];
    }

    resetHook() {
        if (this.#resetHook !== null)
            this.#resetHook();
    }

    #defaultresetHook = function() {
        // Bootstrap 5 - On Reset, Clear all form formatting.
        if (this.#currentForm == null)
            return;
        
        for (let f = 0; f < this.#currentForm.elements.length; f++) {
            const element = this.#currentForm.elements[f];
            element.classList.remove("is-valid");
            element.classList.remove("is-invalid");
            element.value = null;
        }
    };
    #defaultsuccessHook = function(element) {
        // Bootstrap 5 - On Success, Display Valid Style
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        element.nextElementSibling.innerHTML = "";
    };
    #defaultfailedHook = function(errorMessage, element) {
        // Bootstrap 5 - On Failure, Display Invalid Style
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        element.nextElementSibling.innerHTML = this.prettifyErrors(errorMessage);
    };

    #resetHook = this.#defaultresetHook;
    #successHook = this.#defaultsuccessHook;
    #failedHook = this.#defaultfailedHook;

    /**
     * Our Default Rule Sets. You can also use your own static validator class.
     *
     * @static
     * @memberof FormValidator
     */
    static defaultRuleSet = class {
        static differs(value, params, formData) {
            const compareTo = formData.querySelector("[name='" + params + "']")?.value;
            return !value.match(compareTo);
        }

        static equals(value, params) {
            return value == params;
        }

        static exact_length(value, params) {
            return value.length == parseInt(params);
        }

        static greater_than(value, params) {
            return parseInt(value) > parseInt(params);
        }

        static greater_than_equal_to(value, params) {
            return parseInt(value) >= parseInt(params);
        }

        static in_list(value, params) {
            const list = params.split(",");
            return list.includes(value);
        }

        static less_than(value, params) {
            return parseInt(value) < parseInt(params);
        }

        static less_than_equal_to(value, params) {
            return parseInt(value) <= parseInt(params);
        }

        static matches(value, params, formData) {
            const compareTo = formData.querySelector("[name='" + params + "']")?.value;
            return value == compareTo;
        }

        static max_length(value, params) {
            return value.length <= parseInt(params);
        }

        static min_length(value, params) {
            return value.length >= parseInt(params);
        }

        static not_equals(value, params) {
            return value !== params;
        }

        static not_in_list(value, params) {
            const list = params.split(",");
            return !list.includes(value);
        }

        static required(value) {
            return value.length > 0 || value !== "";
        }

        static alpha(value) {
            return value.match(/^[a-zA-Z]+$/gi);
        }

        static alpha_space(value) {
            return value.match(/^[A-Z ]+$/gi);
        }

        static alpha_dash(value) {
            return value.match(/^[a-z0-9_-]+$/gi);
        }

        static alpha_numeric_punct(value) {
            return value.match(/^[A-Z0-9 ~!#$%&*\-_+=|:.]+$/gi);
        }

        static alpha_numeric(value) {
            return value.match(/^[a-z0-9]+$/gi);
        }

        static alpha_numeric_space(value) {
            return value.match(/^[A-Z0-9 ]+$/gi);
        }

        static string(value) {
            return typeof value === 'string';
        }

        static decimal(value) {
            return value.match(/^[-+]?\d{0,}\.?\d+$/);
        }

        static integer(value) {
            return value.match(/^[-+]?\d+$/);
        }

        static is_natural(value) {
            return value.match(/^d+$/);
        }

        static is_natural_no_zero(value) {
            return value.match(/^d+$/) && (value !== "0" || value !== 0);
        }

        static numeric(value) {
            return value.match(/^[-+]?\d*\.?\d+$/);
        }

        static regex_match(value, params) {
            if (params.indexOf("/") == 0)
                params = params.slice(1, params.length - 1);
                
            const regex = new RegExp(params, 'gi');
            return regex.test(value);
        }

        static valid_email(value) {
            return value.match(/^\S+@\S+\.\S+$/);
        }

        static valid_ip(value, param) {
            if (param !== "ipv4" && param !== "ipv6")
                return value.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/) || value.match(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/); //ipv4 or ipv6
            
            if (param == "ipv4")
                return value.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);

            if (param == "ipv6")
                return value.match(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/);
            
            return false;
        }

        static valid_url(value) {
            try {
                new URL(value);
            } catch (err) {
                return false;
            }
            return true;
        }

        static valid_date(str = null, format = null) {
            if (str === null) {
                return false;
            }
        
            if (format === null || format === '') {
                return (new Date(str)).toString() !== 'Invalid Date';
            }
        
            const date = new Date(str);
            const formattedDate = FormValidator.defaultRuleSet.#formatDate(date, format);
            return formattedDate === str;
        }
        
        static #formatDate(date, format) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();

            const ampm = hour >= 12 ? 'pm' : 'am';
            let hours = hour % 12;
            hours = hours ? hours : 12;
        
            return format
                .replace('YYYY', year)
                .replace('MM', FormValidator.defaultRuleSet.#padZero(month))
                .replace('M', month)
                .replace('DD', FormValidator.defaultRuleSet.#padZero(day))
                .replace('D', day)
                .replace('HH', FormValidator.defaultRuleSet.#padZero(hour))
                .replace('H', hour)
                .replace('hh', FormValidator.defaultRuleSet.#padZero(hours))
                .replace('h', hours)
                .replace('mm', FormValidator.defaultRuleSet.#padZero(minute))
                .replace('m', minute)
                .replace('ss', FormValidator.defaultRuleSet.#padZero(second))
                .replace('s', second)
                .replace('SSS', FormValidator.defaultRuleSet.#padZero(millisecond, 3))
                .replace('S', millisecond)
                .replace('A', ampm.toUpperCase())
                .replace('a', ampm);
        }
        
        static #padZero(num, length = 2) {
            return String(num).padStart(length, '0');
        }

    }

    static defaultErrorMessages = {
            "alpha": "The {field} field may only contain alphabetical characters.",
            "alpha_dash": "The {field} field may only contain alphanumeric, underscore, and dash characters.",
            "alpha_numeric": "The {field} field may only contain alphanumeric characters.",
            "alpha_numeric_punct": "The {field} field may contain only alphanumeric characters, spaces, and  ~ ! # $ % & * - _ + = | : . characters.",
            "alpha_numeric_space": "The {field} field may only contain alphanumeric and space characters.",
            "alpha_space": "The {field} field may only contain alphabetical characters and spaces.",
            "decimal": "The {field} field must contain a decimal number.",
            "differs": "The {field} field must differ from the {param} field.",
            "equals": "The {field} field must be exactly: {param}.",
            "exact_length": "The {field} field must be exactly {param} characters in length.",
            "greater_than": "The {field} field must contain a number greater than {param}.",
            "greater_than_equal_to": "The {field} field must contain a number greater than or equal to {param}.",
            "hex": "The {field} field may only contain hexadecimal characters.",
            "in_list": "The {field} field must be one of: {param}.",
            "integer": "The {field} field must contain an integer.",
            "is_natural": "The {field} field must only contain digits.",
            "is_natural_no_zero": "The {field} field must only contain digits and must be greater than zero.",
            "is_not_unique": "The {field} field must contain a previously existing value in the database.",
            "is_unique": "The {field} field must contain a unique value.",
            "less_than": "The {field} field must contain a number less than {param}.",
            "less_than_equal_to": "The {field} field must contain a number less than or equal to {param}.",
            "matches": "The {field} field does not match the {param} field.",
            "max_length": "The {field} field cannot exceed {param} characters in length.",
            "min_length": "The {field} field must be at least {param} characters in length.",
            "not_equals": "The {field} field cannot be: {param}.",
            "not_in_list": "The {field} field must not be one of: {param}.",
            "numeric": "The {field} field must contain only numbers.",
            "regex_match": "The {field} field is not in the correct format.",
            "required": "The {field} field is required.",
            "required_with": "The {field} field is required when {param} is present.",
            "required_without": "The {field} field is required when {param} is not present.",
            "string": "The {field} field must be a valid string.",
            "timezone": "The {field} field must be a valid timezone.",
            "valid_email": "The {field} field must contain a valid email address.",
            "valid_ip": "The {field} field must contain a valid IP.",
            "valid_url": "The {field} field must contain a valid URL.",
            "valid_date": "The {field} field must contain a valid date.",
            // NOT YET IMPLEMENTED
            // "max_size": "{field} is too large of a file.",
            // "is_image": "{field} is not a valid, uploaded image file.",
            // "mime_in": "{field} does not have a valid mime type.",
            // "ext_in": "{field} does not have a valid file extension.",
            // "max_dims": "{field} is either not an image, or it is too wide or tall."
    };

    /**
     * Serialize DOM Form to JSON Array. If form is not specified, the form
     * used in `validateForm()` will be used.
     * 
     * @param {DOM} form The Form to serialize to JSON Array. (Optional)
     * @returns 
     */
    toJSONObject(form = null) {
        let ConvertedJSON = {};
        const theForm = form !== null ? this.#currentForm : form;
        if (typeof theForm === 'undefined' || theForm == null)
            return ConvertedJSON;
        
        const formData = new FormData(form !== null ? this.#currentForm : form);
        for (const [key, value] of formData.entries()) {
            ConvertedJSON[key] = value;
        }
        return ConvertedJSON;
    }

    /**
     * Return Errors in an Unordered List (successHook)
     * @param {Object} error The Object Errors from successHook
     * @returns `string` of errors in unordered list.
     */
    prettifyErrors(error) {
        let errorMessage = "<ul>";
        for (const [key, value] of Object.entries(error)) {
            errorMessage += "<li>" + value + "</li>";
        }
        return errorMessage+"</ul>";
    }

    /**
     * Return All Errors in an Unordered List.
     * @returns `string` of errors in unordered list.
     */
    prettifyErrorsAll() {
        let errorMessage = "<ul>";
        for (const [key, value] of Object.entries(this.#errors)) {
            for (const [key2, value2] of Object.entries(value)) {
                errorMessage += "<li>"+ value2 + "</li>";
            }
        }
        return errorMessage+"</ul>";
    }

    /**
     * Reset the fields.
     * Only useful if you want to use the same single instance.
     */
    reset() {
        this.#errorMessage = "";
        this.#errorMessages = {};
        // this.#rules = {};
        // this.#errors = {};
        // this.#validationClasses = [this.defaultRuleSet];
        // this.#successHook = this.#defaultsuccessHook;
        // this.#failedHook = this.#defaultfailedHook;
        // if (this.#currentForm !== null)
        //    this.destroyLiveValidation();
        if (typeof this.#resetHook === 'function')
            this.#resetHook();
        // this.#resetHook = this.#defaultresetHook;
    }

    /**
     * Set the function to call whem a specific field passed the validation.
     * 
     * ```js
     * const hook = (element) => {
     *  // do something with element...
     * }
     * validator.setSuccessHook(hook);
     * ```
     * @param {function} hook   Function to call after a field passed the validation.
     */
    setSuccessHook(hook) {
        this.#successHook = hook;
    }

     /**
     * Set the function to call when a specific field failed the validation.
     * 
     * ```js
     * const hook = (errorMessage, element) => {
     *  // do something with element...
     *  console.log(errorMessage); // return current field error messages.
     *  console.log(validator.prettifyErrors(errorMessage)); // return current field error messages in unordered list.
     * }
     * validator.setFailedHook(hook);
     * ```
     * 
     * @param {function} hook   Function to call after a field failed the validation.
     */
    setFailedHook(hook) {
        this.#failedHook = hook;
    }

     /**
     * Set the function to call when when `reset()` is called.
     * 
     * ```js
     * const hook = () => {
     *  // do something on reset
     * }
     * validator.setResetHook(hook);
     * ```
     * 
     * @param {function} hook   Function to call when `reset()` is called.
     */
     setResetHook(hook) {
        this.#resetHook = hook;
    }

    /**
     * Get Validation Error Messages
     */
    getErrors() {
        return this.#errors;
    }

    /**
     * Set the Rules for Validation
     * @param {Object} rules The rules to set
     */
    setRules(rules) {
        this.#rules = rules;
    }

    /**
     * Set the Validator Classes to use for validation
     * @param {Object} validationClasses The Validator Classes to use
     */
    setValidators(validationClasses) {
        this.#validationClasses = validationClasses;
    }

    /**
     * Set a Validator Class to use (Removes the Default Validator Class)
     * @param {Class} theClass The Validator Class to set
     */
    setValidator(theClass) {
        this.#validationClasses = [theClass];
    }

    /**
     * Add Validator Class to use
     * @param {Class} theClass The Validator Class to set
     */
    addValidator(theClass) {
        this.#validationClasses.push(theClass);
    }

    /**
     * Set Error Messages for Failed Validation
     * @param {Object} errors Validation Messages Array
     */
    setErrorMessages(errors) {
        this.#errorMessages = errors;
    }

    /**
     * For DOM required_with module
     */
    #required_with_form(value, param, form) {
        const fields_to_check = param.split(",");
        let required = [];
        for (let ftc in fields_to_check) {
            if (form.querySelector("[name='"+ fields_to_check[ftc] + "']")?.value.length > 0)
                required.push(true);
            else
                required.push(false);
        }
        return !required.includes(false);
    }

    /**
     * For DOM required_without module
     */
    #required_without_form(value, param, form) {
        const fields_to_check = param.split(",");
        let required = [];
        for (let ftc in fields_to_check) {
            if (form.querySelector("[name='"+ fields_to_check[ftc] + "']")?.value.length == 0)
                required.push(true);
            else
                required.push(false);
        }
        return !required.includes(false);
    }

    /**
     * Validate an Element against the rules.
     * 
     * @param {DOM} theElement elemenet to validate against the rules.
     * @returns 
     */
    #validateSingleForm(theElement) {
        const form = this.#currentForm;
        const theElementName = theElement.getAttribute("name");
        this.#errors[theElementName] = {};
        if (typeof theElementName === 'undefined' || theElementName == null || theElementName == "")
            return;
        const validation = theElement.getAttribute("validation");
        if (typeof validation === 'undefined' || validation == null || validation == "")
            return;
        const theRules = this.#splitRules(validation);

        // If field is permitted empty and empty, Continue.
        if (theRules.includes("permit_empty") && theElement.value == "") {
            if (typeof this.#successHook === 'function')
                this.#successHook(theElement);
            return;
        }
            

        // If required_with
        const with_required_with = theRules.filter((rule) => rule.match(/required_with\[/));
        if (with_required_with.length > 0) {
            let toContinue = [];
            for (let rw in with_required_with) {
                let match = with_required_with[rw].match(/(.*?)\[(.*)\]/);
                const rule = match[1];
                const param = typeof match[2] !== 'undefined' ? match[2] : "";
                let required = this.#required_with_form(theElement.value, param, form);
                if (!required && theElement.value == "")
                    toContinue.push(true);
                else
                    toContinue.push(false);
            }
            if (!toContinue.includes(false))
                return;
        } else {
            // If required_without
            const with_required_without = theRules.filter((rule) => rule.match(/required_without\[/))
            if (with_required_without.length > 0) {
                let toContinue = [];
                for (let rw in with_required_without) {
                    let match = with_required_without[rw].match(/(.*?)\[(.*)\]/);
                    const rule = match[1];
                    const param = typeof match[2] !== 'undefined' ? match[2] : "";
                    let required = this.#required_without_form(theElement.value, param, form);
                    if (!required && theElement.value == "")
                        toContinue.push(true);
                    else
                        toContinue.push(false);
                }
                if (!toContinue.includes(false))
                    return;
            }
        }
        
        // loop through the rules
        for (const i in theRules) {
            // For Duplicate Message Fix
            // if (theRules[i] == "required" && theRules.length > 0)
            //     continue;
            
            // Don't allow values to pass if checkbox and not checked.
            let value = theElement.value;
            if (theElement.type == "checkbox" && !theElement.checked)
                value = "";
                
            const result = this.#processRule(theElementName, theRules[i], value, form);

            // call the hooks
            if (result) {
                if (typeof this.#successHook === 'function')
                    this.#successHook(theElement);
            } else {
                if (typeof this.#failedHook === 'function')
                    this.#failedHook(this.#errorMessage, theElement);
                
                break;
            }
        }
    }

    /**
     * Validate a DOM Form.
     * 
     * In your HTML:
     * ```html
     *  <!-- bootstrap 5 form -->
     *<form id="theForm">
     *  <div class="form-group">
     *      <label class="form-label">Name:</label>
     *      <input type="text" class="form-control" name="name" validation="required|min_length[5]" value="" />
     *      <div class="invalid-feedback">
     *      </div>
     *  </div>
     * <div class="form-group">
     *      <label class="form-label">Age:</label>
     *      <input type="text" class="form-control" name="age" validation="required|integer|greater_than_equal_to[18]|less_than_equal_to[60]" value="" />
     *      <div class="invalid-feedback">
     *      </div>
     *  </div>
     *</form>
     * ```
     * 
     * In your JavaScript
     * ```js
     *  const validator = new FormValidator(); // initialize `FormValidator()`
     *  const messages = {
     *      "name": {
     *          "required":"Your {field} is required.",
     *          "min_length":"The minimum characters of your {field} : {value} should be {param}"  
     *       },
     *      "age":{
     *          "required":"Your {field} is required.",
     *          "integer":"{value} is not a valid integer",
     *          "greater_than_equal_to":"Your age must be {param} and above.",
     *          "less_than_equal_to":"Your age must be {param} and below."
     *      }
     *  }
     * validator.setErrroMessages(messages);
     * const theForm = document.getElementById('theForm');
     * validator.liveValidation(theForm); // enable live validation.
     * const result = validator.validateForm(theForm) // validate all;
     * if (result) {
     *  // validation success!
     *  validator.reset(); // clear form and detach live validation events.
     * } else {
     *  // there is an error.
     *  console.log(validator.getErrors()); // Get Errors in object format
     *  console.log(validator.prettifyErrorsAll()); // Get all errors in Unordered List format
     * }
     * ```
     * @param {Object} form - The DOM Form to Validate (optional)
     * @returns `true` on success, `false` on failure.
     */
    validateForm(form = null) {
        if (form !== null)
            this.#currentForm = form;

        if (this.#currentForm == null)
            return false;

        this.#errors = {};
        
        for (let i = 0; i < this.#currentForm.elements.length; i++) {
            this.#validateSingleForm(this.#currentForm.elements[i]);
        }
        return Object.entries(this.#errors).length <= 0;
    }

    /**
     * Validation Event for Live Validation
     */
    #liveValidateEvent = (e) => {
        this.#validateSingleForm(e.target);
    }


    /**
     * Enable Live Validation on a specific form
     *
     * @param {DOM} form - The Form to attach live validations (optional)
     * @memberof FormValidator
     */
    liveValidation(form = null) {
         if (form !== null)
            this.#currentForm = form;
        if (this.#currentForm == null)
            return;
        this.#currentForm.addEventListener("keyup", this.#liveValidateEvent);
        this.#currentForm.addEventListener("change", this.#liveValidateEvent);
    }

    /**
     * Remove Event Listeners for Live Validation
     *
     * @return {*} 
     * @memberof FormValidator
     */
    destroyLiveValidation() {
        if (this.#currentForm == null)
            return;

        this.#currentForm.removeEventListener("keyup", this.liveValidateEvent);
        this.#currentForm.removeEventListener("change", this.liveValidateEvent);
    }

    /**
     * Find the Method in Validator Classes
     * @param {String} theMethod Method to find in Validator Classes
     * @returns 
     */
    #whereCallable(theMethod) {
        for (const i in this.#validationClasses) {
            if (typeof this.#validationClasses[i][theMethod] === 'function')
                return this.#validationClasses[i][theMethod];
        }
        return undefined;
    }

    /**
     * Process a rule against the data value
     * @param {String} fieldname    The Field Name
     * @param {Object} rule         The Rule Parameters
     * @param {Object} data         The Value to validate
     * @param {Object} formData     The DOM Form
     * @returns `true` on success, `false` on failure
     */
    #processRule(fieldname, rule, data, formData) {
        let param = false;
        let theValidator = this.#whereCallable(rule);

        if (theValidator !== undefined) {
            // It is callable directly without parameters.
            let result = theValidator(data, formData);
            if (!result) {
                let errorMessage = typeof this.#errorMessages?.[fieldname]?.[rule] !== 'undefined' 
                                    ? this.#errorMessages[fieldname][rule] 
                                    : typeof FormValidator.defaultErrorMessages[rule] !== 'undefined' 
                                    ? FormValidator.defaultErrorMessages[rule]
                                    : "Please enter a valid: " + fieldname;
                this.#errors[fieldname] = { ...this.#errors[fieldname], [rule] : errorMessage.replace("{field}", fieldname).replace("{value}", data)};
                this.#errorMessage = this.#errors[fieldname];
                return false;
            }
        } else {
            // Maybe it needs parameters...
            let match = rule.match(/(.*?)\[(.*)\]/);
            if (match) {
                rule = match[1];
                param = match[2];
            }

            // Now, Let's try to call the function..
            theValidator = this.#whereCallable(rule);
            if (theValidator !== undefined && match) {
                let result = theValidator(data, param, formData);
                // there is an error
                if (!result) {
                    let errorMessage = typeof this.#errorMessages?.[fieldname]?.[rule] !== 'undefined' 
                                    ? this.#errorMessages[fieldname][rule] 
                                    : typeof FormValidator.defaultErrorMessages[rule] !== 'undefined' 
                                    ? FormValidator.defaultErrorMessages[rule]
                                    : "Please enter a valid: " + fieldname;
                    this.#errors[fieldname] = { ...this.#errors[fieldname], [rule] : errorMessage.replace("{field}", fieldname).replace("{value}", data).replace("{param}", param)};
                    this.#errorMessage = this.#errors[fieldname];
                    return false;
                }
            }
        }
        // success
        return true;
    }

    /**
     * Parses the Rules of each fields
     * @param {String} rules The Rules of the field.
     */
    #splitRules(rules) {
        if (!rules.includes('|')) {
            return [rules];
        }

        let string = rules;
        let splitRules = [];
        let length = string.length;
        let cursor = 0;

        while (cursor < length) {
            let pos = string.indexOf('|', cursor);

            if (pos === -1) {
            // we're in the last rule
            pos = length;
            }

            let rule = string.substring(cursor, pos);

            while (
            (rule.split('[').length - 1 - (rule.split('\[').length - 1)) !==
            (rule.split(']').length - 1 - (rule.split('\]').length - 1))
            ) {
            // the pipe is inside the brackets causing the closing bracket to
            // not be included. so, we adjust the rule to include that portion.
            pos = string.indexOf('|', cursor + rule.length + 1) || length;
            rule = string.substring(cursor, pos);
            }

            splitRules.push(rule);
            cursor += rule.length + 1; // +1 to exclude the pipe
        }

        return [...new Set(splitRules)];
    }

     /**
     * For Array required_with module
     */
     #required_with(value, param, form) {
        const fields_to_check = param.split(",");
        let required = [];
        for (let ftc in fields_to_check) {
            if (form[fields_to_check[ftc]]?.value.length > 0)
                required.push(true);
            else
                required.push(false);
        }
        return !required.includes(false);
    }

    /**
     * For Array required_without module
     */
    #required_without(value, param, form) {
        const fields_to_check = param.split(",");
        let required = [];
        for (let ftc in fields_to_check) {
            if (form[fields_to_check[ftc]]?.value.length == 0)
                required.push(true);
            else
                required.push(false);
        }
        return !required.includes(false);
    }

    /**
     * Validate a Key-Value Pair Array
     * 
     * ``js
     *  const data = {
     *      "name":"Gian Abano",
     *      "age":24
     *  }
     *  const rules = {
     *      "name":"required|min_length[5]",
     *      "age":"required|integer|greater_than_equal_to[18]|less_than_equal_to[60]"
     *  }
     *  const messages = {
     *      "name":{
     *          "required":"Your {field} is required",
     *          "min_length":"Your {field} must exceed the minimum length of {param}"
     *       },
     *      "age":{
     *          "required":"{field} is required",
     *          "integer":"{field} must be a valid number",
     *          "greater_than_equal_to":"You are only {value}. Minimum age requirement is {param}",
     *          "less_than_equal_to":"You are already {value}. Maximum age requirement is {param}"
     *       },
     *  }
     *  const response = validator.validateObject(data, rules, errors);
     *  if (response) {
     *      // validation success
     *      validation.reset();
     *  } else {
     *      console.log(validator.getErrors()); // Get Errors in object format
     *      console.log(validator.prettifyErrorsAll()); // Get all errors in Unordered List format
     *  }
     * ``
     * @param {Object} data     Key Value pair array to validate
     * @param {Object} rules    Rules to use for validation
     * @param {Object} errors   Errors to return on validation failure
     * @returns `true` on success, `false` on failure.
     */
    validateObject(data, rules = null, errors = null) {
        // set parameters if passed
        this.#errors = {};
        if (rules !== null)
            this.#rules = rules;
        if (errors !== null)
            this.#errorMessages = errors;

        // loop through the data
        for (const [key, value] of Object.entries(data)) {

            // parse the rules
            if (typeof this.#rules[key] === 'undefined')
                continue;

            // If field is permitted empty and empty, Continue.
            if (this.#rules[key].includes("permit_empty") && value == "")
                continue;
        
            const theRules = this.#splitRules(this.#rules[key]);

            // check for required_with and required_without rules
            const with_required_with = theRules.filter((rule) => rule.match(/required_with\[/));
            if (with_required_with.length > 0) {
                let toContinue = [];
                for (let rw in with_required_with) {
                    let match = with_required_with[rw].match(/(.*?)\[(.*)\]/);
                    const rule = match[1];
                    const param = typeof match[2] !== 'undefined' ? match[2] : "";
                    let required = this.#required_with(value, param, data);
                    if (!required && value == "")
                        toContinue.push(true);
                    else
                        toContinue.push(false);
                }
                if (!toContinue.includes(false))
                    continue;
            } else {
                // If required_without
                const with_required_without = theRules.filter((rule) => rule.match(/required_without\[/))
                if (with_required_without.length > 0) {
                    let toContinue = [];
                    for (let rw in with_required_without) {
                        let match = with_required_without[rw].match(/(.*?)\[(.*)\]/);
                        const rule = match[1];
                        const param = typeof match[2] !== 'undefined' ? match[2] : "";
                        let required = this.#required_without(value, param, data);
                        if (!required && value == "")
                            toContinue.push(true);
                        else
                            toContinue.push(false);
                    }
                    if (!toContinue.includes(false))
                        continue;
                }
            }

            // loop through the rules
            for (const i in theRules) {
                this.#processRule(key, theRules[i], value);
            }
        }
        return Object.entries(this.#errors).length <= 0;
    }

    /**
     * Validate a Single String
     * 
     * ```js
     * const value = "17";
     * const rules = "required|integer|greater_than_equal_to[18]|less_than_equal_to[60]";
     * const messages = {
     *      "required":"Age is required",
     *      "integer":"Must be a valid number",
     *      "greater_than_equal_to":"You are only {value}. Minimum age requirement is {param}",
     *      "less_than_equal_to":"You are already {value}. Maximum age requirement is {param}"
     * }
     * const response = validator.validateString(value, rules, messages);
     * if (response) {
     *  // age is >= 18 and <= 60
     * } else {
     *  // underage.
     *  console.log(validator.getValidateStringError()); // get validation errors
     * }
     * ```
     * @param {String} value    String to validate
     * @param {String} rules    Rules to use to validate value
     * @param {Object} errors   Error Messages to use
     * @returns `true` on success, `false` on failure.
     */
    validateString(value, rules = null, errors = null) {
        // reset errors.
        this.#errors = {};

        // set parameters if passed
        if (rules !== null)
            this.#rules["singleValidation"] = rules;
        if (errors !== null)
            this.#errorMessages["singleValidation"] = errors;
        if (rules == null && typeof this.#rules !== 'string')
            return false;
        
        const theRules = this.#splitRules(this.#rules["singleValidation"]);
            for (const i in theRules) {
                this.#processRule("singleValidation", theRules[i], value, null);
            }
        return Object.entries(this.#errors).length <= 0;
    }

    getValidateStringError() {
        return this.#errors["singleValidation"];
    }
}