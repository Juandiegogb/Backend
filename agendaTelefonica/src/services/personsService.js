import axios from "axios";
const baseUrl = "/api";

const create = (newPerson) => {
  return axios.post(`${baseUrl}/persons`, newPerson);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/persons/${id}`);
};

const obtain = () => {
  return axios.get(`${baseUrl}/persons`);
};

const update = (id, body) => {
  return axios.put(`${baseUrl}/persons/${id}`, body);
};
export default { create, remove, obtain, update };
