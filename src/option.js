import React from 'react';

const Option = props => (
  <label className={!props.count[props.option] ? "option-select disabled" : "option-select"} htmlFor={props.option}>{props.option} <span>({props.count[props.option] || '0'})</span>
    <input 
      type="checkbox" 
      id={props.option} 
      name={props.option} 
      value={props.option}
      disabled={props.count[props.option] ? false : true}
      onChange={e => {
        if (e.target.checked) {
          // Add value to array
          props.filter(e);
        } else {
          // Remove value from array
          props.clearFilter();
        }
      }} />
  </label>
)

export default Option;