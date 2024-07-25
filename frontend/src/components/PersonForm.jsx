import React from 'react';

const PersonForm = ({ onSubmit, newName, newNumber, nameOnchange, numberOnChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input value={newName} onChange={nameOnchange} />
      </div>
      <div>
        Number:
        <input value={newNumber} onChange={numberOnChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
