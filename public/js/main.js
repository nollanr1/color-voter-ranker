const deleteButtons = document.querySelectorAll('.deleteButton')
const voteButtons = document.querySelectorAll('.voteButton')

Array.from(deleteButtons).forEach((element)=>{
	element.addEventListener('click', deleteColor)
})

Array.from(voteButtons).forEach((element)=>{
	element.addEventListener('click', addVote)
})

async function deleteColor(){
	const hexVal = this.parentNode.childNodes[3].innerText;
	const numVotes = this.parentNode.childNodes[5].innerText;
	
	try{
		const res = await fetch('deletecolor', {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				color: hexVal,
				//votes: numVotes
			})
		})
		const data = await res.json()
		console.log(data)
		location.reload()
	}catch(err){
		console.log(err)
	}
}

async function addVote(){
	const hexVal = this.parentNode.childNodes[3].innerText;
	const numVotes = this.parentNode.childNodes[5].innerText;

	try{
		const res = await fetch('vote', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				color: hexVal,
				votes: numVotes
			})
		})
		const data = await res.json()
		console.log(data)
		location.reload()
	}catch(err){
		console.log(err)
	}
}