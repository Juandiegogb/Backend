import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const obtain = () => {
  return axios.get(baseUrl);
};

const update = (id, body) => {
  return axios.put(`${baseUrl}/${id}`, body);
};
export default { create, remove, obtain, update };
