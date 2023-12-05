import PropTypes from 'prop-types';

import { FormControl } from '@mui/material';

import classes from '@components/InputRHF/style.module.scss';

const InputRHF = ({ children, input, disabled = false, register, errors, accept = undefined }) => (
  <FormControl className={classes.inputContainer}>
    <label htmlFor={input?.name} className={classes.inputLabel}>
      {input?.label}
      <input
        className={`${classes.input} ${errors[input?.name] && classes.inputError}`}
        {...register(input?.name, {
          required: input?.required,
          pattern: { value: input?.pattern, message: input?.messagePatern },
          minLength: {
            value: input?.minLength,
            message: input?.messageMin,
          },
        })}
        type={input?.type}
        id={input?.name}
        defaultValue={input?.value}
        accept={accept && accept}
        disabled={disabled}
      />
    </label>
    {errors[input?.name] && <span className={classes.inputLabelError}>{errors[input?.name].message}</span>}
    {children}
  </FormControl>
);
InputRHF.propTypes = {
  children: PropTypes.element,
  input: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.string,
    pattern: PropTypes.shape(RegExp),
    type: PropTypes.string,
    value: PropTypes.string,
    messagePatern: PropTypes.string,
    messageMin: PropTypes.string,
    minLength: PropTypes.number,
  }),
  register: PropTypes.func,
  errors: PropTypes.object,
  accept: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InputRHF;
