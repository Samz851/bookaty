
import { Select, type SelectProps } from 'antd';

export const SelectFields = ({}) => {
    const options: SelectProps['options'] = [
        {
            label: 'balance',
            value: 'balance',
        },
        {
            label: 'credit_total',
            value: 'credit_total',
        },
        {
            label: 'debit_total',
            value: 'debit_total',
        },
    ];
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
      };

    return (
        <Select
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      placeholder="Please select"
      defaultValue={['a10', 'c12']}
      onChange={handleChange}
      options={options}
    />
    )
}