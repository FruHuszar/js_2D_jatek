export default class Service {
  constructor() {}

  getData(VEGPONT, callback) {
    fetch(VEGPONT)
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch((error) => console.log(error));
  }
}
