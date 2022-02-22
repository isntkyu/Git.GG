class GitHub {

	async getUser(user){
		const profileResponse = await fetch(`https://api.github.com/users/${user}`);
		const profilestar = await fetch(`https://api.github.com/users/${user}/repos`);

		const profile = await profileResponse.json();
		const star = await profilestar.json();

		// star.sort(function(a,b) {
		// 	return parseFloat(b.stargazers_count) - parseFloat(a.stargazers_count);
		// });
		return {
			profile//, star
		}
	}
}
