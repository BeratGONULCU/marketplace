import axios from 'axios';

axios.get("http://localhost:8000/products")
  .then(response => {
    console.log(response.data);
  });
