 const github = new GitHub();
 const searchUser = document.getElementById('searchUser');
 searchUser.addEventListener('keyup', (e) => {
 	const userText = e.target.value;
 	if(userText !== ''){
 		//make http call
 		github.getUser(userText)
 		.then(data => {
 			if(data.profile.message === 'Not Found'){
 				//show alert
 				document.getElementById('profile').innerHTML = `Name: Not Found`;
 			} else {
 				document.getElementById('profile').innerHTML = `
 				<div class="panel panel-primary">
 				  <div class="panel-heading">
 				    <h3 class="panel-title">Name: ${data.profile.name}</h3>
 				  </div>
 				  <div class="panel-body">
 				    Repository: ${data.profile.public_repos} <br>
 				    Location: ${data.profile.location} <br>
 				    Bio: ${data.profile.bio}<br>
                         Followers : ${data.profile.followers}
                      
 				  </div>
 				</div>`;
 			}
 		})
 	} else {
 		//Clear profile.
 		document.getElementById('profile').innerHTML = '';
 	}
 });