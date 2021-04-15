import axios from 'axios';

export default class PermissionService {

    getPermissions() {
		axios.get('http://localhost:8086/permissions/get-all').then(res => console.log(res.data));
		return axios.get('http://localhost:8086/permissions/get-all').then(res => res.data);
	}

	insertPermission(permission) {
		axios.post('http://localhost:8086/permissions/insert/', permission)
		  .then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
	}

	deletePermission(permission) {
		
		axios.delete('http://localhost:8086/permissions/delete/' + permission.id)
		  .then((response) => {
			console.log(response);
		  }, (error) => {
			console.log(error);
		  });
	}

}
