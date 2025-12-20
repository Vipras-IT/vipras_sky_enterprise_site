/* eslint-disable react/prop-types */
import { Controller } from 'react-hook-form';
import { Input } from 'antd';

const CustomDateInput = ({
  label,
  type = 'text',
  placeholder = 'Enter Response',
  ...rest
}) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <Controller
        name={rest.name}
        control={rest.control}
        rules={rest.rules}
        render={({ field, fieldState }) => (
          <Input
            bordered={false}
            {...field}
            type={type}
            placeholder={placeholder}
            className={
              fieldState.invalid ? 'custom-input error' : 'custom-input'
            }
          />
        )}
      />
    </div>
  );
};
export default CustomDateInput;
