import axios from 'axios';

const baseUrl = '/api/persons';
// const baseUrl = '/api/persons';

const create = (personObj) => {
  return axios.post(baseUrl, personObj).then((res) => res.data);
};
const get = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const del = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((res) => {
    console.log('deleting', res.data);
    return res.data;
  });
};
const update = (personObj) => {
  return axios.put(`${baseUrl}/${personObj.id}`, personObj).then((res) => {
    console.log('updating', res.data);
    return res.data;
  });
};
export default {
  create,
  get,
  del,
  update,
};
