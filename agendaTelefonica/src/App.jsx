import { useEffect, useState } from "react";
import personsService from "./services/personsService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState(null);
  const [toShow, setToShow] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    console.log("effecting");
    personsService.obtain().then((res) => {
      setPersons(res.data);
    });
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }, [message]);

  const nameHandle = (e) => setNewName(e.target.value);
  const phoneHandle = (e) => setNewPhone(e.target.value);
  const searchHandle = (e) => {
    setToShow(
      persons.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setNewName(!newName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exist = persons.some((person) => person.name === newName);
    const index = persons.findIndex((person) => person.name === newName);

    if (exist) {
      if (confirm("Desea modificar el numero del contacto existente ?")) {
        const id = persons[index].id;
        const body = persons[index];
        body.phone = newPhone;
        personsService.update(id, body);
        setMessage({
          message: "Usuario modificado con exito ",
          color: "green",
        });
      }
    } else {
      personsService.create({ name: newName, phone: newPhone });
      setNewName(null);
      setNewPhone(null);
      setMessage({ message: "Contacto creado con exito", color: "green" });
      e.target.reset();
    }
  };

  const deleteHandler = (id) => {
    if (confirm("You want delete this contact?")) {
      personsService
        .remove(id)
        .then(() => {
          setNewName(!newName);
          setMessage({
            message: "Contacto eliminado con exito",
            color: "green",
          });
        })
        .catch((error) => {
          console.log(error);
          setMessage({
            message: "El usuario no existe en la base de datos",
            color: "red",
          });
        });
    } else {
      console.log("ok");
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <input type="text" placeholder="Search" onChange={searchHandle} />
      <h1>New contacts</h1>
      <Notification message={message} />
      <CreateForm
        handleSubmit={handleSubmit}
        nameHandle={nameHandle}
        phoneHandle={phoneHandle}
      />
      <h1>Contacts</h1>
      {toShow ? (
        <Contacts toShow={toShow} onDelete={deleteHandler} />
      ) : (
        <Contacts toShow={persons} onDelete={deleteHandler} />
      )}
    </div>
  );
};

const CreateForm = ({ handleSubmit, nameHandle, phoneHandle }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        type="text"
        placeholder="Name"
        onChange={nameHandle}
        required
      />
      <input
        required
        name="phone"
        type="text"
        placeholder="Phone"
        onChange={phoneHandle}
      />
      <button type="submit">Create</button>
    </form>
  );
};

const Contacts = ({ toShow, onDelete }) => {
  return (
    <div>
      {toShow.length > 0 ? (
        toShow.map((person) => (
          <Person person={person} key={person.id} onDelete={onDelete} />
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

const Person = ({ person, onDelete }) => {
  return (
    <div>
      <p>
        <strong>{person.name}</strong> {person.phone}
        <button
          onClick={() => {
            onDelete(person.id);
          }}
        >
          Delete
        </button>
      </p>
    </div>
  );
};

export default App;

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      style={{
        color: "white",
        fontStyle: "italic",
        fontSize: 16,
        background: message.color,
        padding: "10px",
        marginBottom: "5px",
      }}
    >
      {message.message}
    </div>
  );
};
