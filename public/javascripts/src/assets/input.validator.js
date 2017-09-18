export default class Validator {
    constructor (fieldId) {
        this.fieldId = fieldId;

        this.valid = false;
        this.validationErrorClassName = 'validation-error';

        this.initalize();
    }

    initalize () {
        this.field = document.getElementById(this.fieldId);

        this.field.addEventListener('keyup', this.changeListener.bind(this));
    }

    changeListener () {
        let value = this.getValue().toString(),
            validationResult = this.validate(value);

        if (validationResult !== this.valid) {
            this.toggleError(validationResult);
        }

        this.setValid(validationResult);
    }

    setValid (isValid) {
        this.valid = isValid;
    }

    validate (value) {
        return value.length > 0;
    }

    isValid () {
        return this.valid;
    }

    getValue () {
        return this.field.value;
    }

    toggleError (isValid) {
        isValid ?
            this.hideError() :
            this.showError() ;
    }

    hideError () {
        if (this.errorEl) {
            this.errorEl.style.display = 'none';
        }
    }

    showError () {
        let error = document.getElementsByClassName(this.validationErrorClassName)[0];

        if (error) {
            error.style.display = 'block';
        } else {
            let newError = document.createElement('div'),
            fieldset = document.getElementsByTagName('fieldset')[0];
        
            newError
                .classList
                .add(this.validationErrorClassName);

            newError.innerHTML = 'Field cannot be empty';

            fieldset.appendChild(newError);

            this.errorEl = newError;
        }
    }
}