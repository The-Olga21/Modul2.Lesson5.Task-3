import * as yup from 'yup';
import { useState, useRef } from 'react';
import styles from './App.module.css';

const sendFormData = (formData) => {
	console.log(formData);
};

const emailChangeSchema = yup
	.string()
	.matches(
		/^[-.@\w_]*$/,
		'Неверный email. Допустимые символы: буквы, цифры, дефис, точка и нижнее подчеркивание.',
	)
	.max(25, 'Неверный email. Должно быть не более 25 символов.');

const emailBlurSchema = yup
	.string()
	.min(7, 'Неверный email. Должно быть не менее 7 символов.');

const passwordChangeSchema = yup
	.string()
	.max(35, 'Неверный пароль. Пароль должен содержать не более 35 символов');

const passwordBlurSchema = yup
	.string()
	.matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{0,}/,
		'Неверный пароль. Пароль должен содержать строчные и прописные буквы латиницы, цифры и специальные символы.',
	)
	.min(6, 'Неверный пароль. Пароль должен содержать не менее 6 символов.');

const validateAndGetErrorMessage = (schema, value) => {
	let errorMessage = null;

	try {
		schema.validateSync(value, { abortEarly: false });
	} catch ({ errors }) {
		errorMessage = errors.join('\n');
	}

	return errorMessage;
};

export const App = () => {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(null);

	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(null);

	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [passwordRepeatError, setPasswordRepeatError] = useState(null);

	const submitButtonRef = useRef(null);

	const onEmailChange = ({ target }) => {
		setEmail(target.value);

		const newErrorOfEmail = validateAndGetErrorMessage(
			emailChangeSchema,
			target.value,
		);

		setEmailError(newErrorOfEmail);
	};

	const onEmailBlur = ({ target }) => {
		const newErrorOfEmail = validateAndGetErrorMessage(emailBlurSchema, target.value);
		setEmailError(newErrorOfEmail);
	};

	const onPasswordChange = ({ target }) => {
		setPassword(target.value);

		const newErrorOfPassword = validateAndGetErrorMessage(
			passwordChangeSchema,
			target.value,
		);
		setPasswordError(newErrorOfPassword);
	};

	const onPasswordBlur = ({ target }) => {
		const newErrorOfPassword = validateAndGetErrorMessage(
			passwordBlurSchema,
			target.value,
		);
		setPasswordError(newErrorOfPassword);
	};

	const onCorrectOfPasswordRepeat = ({ target }) => {
		setPasswordRepeat(target.value);

		let newErrorOfPasswordRepeat = null;
		if (passwordRepeat !== password) {
			newErrorOfPasswordRepeat =
				'Повторный пароль не совпадает с введенным паролем';
		} else if (!!newErrorOfPasswordRepeat) {
			submitButtonRef.current.focus();
		}
		setPasswordRepeatError(newErrorOfPasswordRepeat);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		sendFormData({ email, password, passwordRepeat });
	};

	return (
		<div className={styles.app}>
			Регистрация
			<form className={styles.form} onSubmit={onSubmit}>
				{emailError && <div className={styles.error}>{emailError}</div>}
				{passwordError && <div className={styles.error}>{passwordError}</div>}
				{passwordRepeatError && (
					<div className={styles.error}>{passwordRepeatError}</div>
				)}
				<input
					name="email"
					type="email"
					placeholder="Почта"
					value={email}
					onChange={onEmailChange}
					onBlur={onEmailBlur}
				/>
				<input
					name="password"
					type="password"
					placeholder="Пароль"
					value={password}
					onChange={onPasswordChange}
					onBlur={onPasswordBlur}
				/>
				<input
					name="password"
					type="password"
					placeholder="Повтор пароля"
					value={passwordRepeat}
					onChange={onCorrectOfPasswordRepeat}
				/>
				<button
					ref={submitButtonRef}
					type="submit"
					disabled={!!emailError || !!passwordError || !!passwordRepeatError}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
