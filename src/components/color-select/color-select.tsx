import { ChangeEvent } from "react";

export type ColorOption = {
  value: string | undefined,
  display: string,
};

const colorOptions: ColorOption[] = [
  {
    value: '',
    display: 'None',
  },
  {
    value: 'red',
    display: 'Red',
  }, {
    value: 'blue',
    display: 'Blue',
  },
  {
    value: 'black',
    display: 'Black',
  }
];

export type ColorSelectProps = {
 onSelected?: (selected: ColorOption) => void; 
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function ColorSelect(props: ColorSelectProps) {
  const { onSelected, ...selectProps } = props;

  const handleChange = (event: {target: HTMLSelectElement}) => {

    const selectedOption = colorOptions
      .find(option => option.value === event.target.value);

    onSelected && selectedOption && onSelected(selectedOption);
  };

  return (
    <select onChange={handleChange} {...selectProps}>
      {colorOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.display}
        </option>
      ))}
    </select>
  );
}