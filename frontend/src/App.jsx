import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Server from './services/Server';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  console.log('Current persons:', persons);

  const queryResult = persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    Server.get().then((initialNumber) => {
      setPersons(initialNumber);
    });
  }, []);

  const handleFilterChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSetNewName = (e) => {
    setNewName(e.target.value);
  };
  const handleSetNewNumber = (e) => {
    setNewNumber(e.target.value);
  };
  const showMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  const addNewPerson = (event) => {
    event.preventDefault();
    const newPersonObj = {
      name: newName,
      number: newNumber,
    };
    if (newPersonObj.name == '' || newPersonObj.number == '') {
      showMessage('Both a name and number must be provided');
      return;
    }
    const doesNameExist = persons.some((person) => person.name == newName);
    if (doesNameExist) {
      if (window.confirm(`${newName} is already added to the phone book, replace the old number with a new one?`)) {
        const personTochange = persons.find((person) => person.name == newName);
        const updatedPerson = { ...personTochange, number: newNumber };

        Server.update(updatedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map((person) => (person.id !== updatedPerson.id ? person : returnedPerson)));
          })
          .catch((err) => {
            setMessage(`Information of ${updatedPerson.name} has already been removed`);
            Server.get().then((currentPersons) => setPersons(currentPersons));
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
      return;
    }

    Server.create(newPersonObj)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        showMessage(`Added  ${newName}`);
        setNewName('');
        setNewNumber('');
      })
      .catch((err) => {
        console.log(err.response.data.error);
        showMessage(err.response.data.error);
      });

    console.log(persons);
    console.log('adding new persone: ', newPersonObj);
  };
  const deletePerson = (id) => {
    const name = persons.find((p) => p.id == id).name;
    if (window.confirm(`delete ${name}`)) {
      Server.del(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter searchQuery={search} onChange={handleFilterChange} />
      <h2>Add New Numbers</h2>

      <PersonForm
        onSubmit={addNewPerson}
        newName={newName}
        newNumber={newNumber}
        nameOnchange={handleSetNewName}
        numberOnChange={handleSetNewNumber}
      />

      <Persons queryResult={queryResult} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
