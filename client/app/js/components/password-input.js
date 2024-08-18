function PasswordInput() {
	const inputs = document.querySelectorAll('.password-field')

	inputs.forEach(input => {
		const switcher = input.querySelector('.password-field-switch')
		const field = input.querySelector('.password-field input')
		const icon = input.querySelector('.password-field-switch img')
		
		switcher.addEventListener('click', () => {

			if (field.type === 'password') {
				icon.src = 'images/icons/password-open.svg'
				field.type = 'text'
			} else {
				icon.src = 'images/icons/password-close.svg'
				field.type = 'password'
			}
		})
		
	})
}

export default PasswordInput;