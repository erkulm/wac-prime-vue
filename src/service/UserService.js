import axios from 'axios';

export default class UserService {

    getUsers() {
		axios.get('http://localhost:8086/users/get-all').then(res => console.log(res.data));
		return axios.get('http://localhost:8086/users/get-all').then(res => res.data);
	}

	insertUser(user) {
		axios.post('http://localhost:8086/users/insert', user)
		  .then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
	}

	deleteUser(user) {
		
		axios.delete('http://localhost:8086/users/delete/' + user.id)
		  .then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
	}

}
