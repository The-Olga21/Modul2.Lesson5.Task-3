import { useEffect, useState, useRef } from 'react';
import styles from './App.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [refreshTodosFlag, setRefreshTodosFlag] = useState(false);
	const [searchTodo, setSearchTodo] = useState('');
	const [isSortingEnabled, setIsSortingEnabled] = useState(false);
	const [newTodoText, setNewTodoText] = useState('');

	const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag);

	const filteredTodos = todos.filter((todo) => todo.text.includes(searchTodo));

	useEffect(() => {
		setIsLoading(true);

		fetch('http://localhost:3002/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTodosFlag]);

	const onSortingChange = () => {
		setIsSortingEnabled(!isSortingEnabled);
		console.log(isSortingEnabled);

		if (!isSortingEnabled) {
			const sortedTodos = [...filteredTodos];
			sortedTodos.sort((a, b) => {
				if (a.text.toLowerCase() < b.text.toLowerCase()) {
					return -1;
				}
				if (a.text.toLowerCase() > b.text.toLowerCase()) {
					return 1;
				}
				return 0;
			});
			setTodos(sortedTodos);
			console.log('sortedTodos:', sortedTodos, 'filteredTodos:', filteredTodos);
		} else if (isSortingEnabled) {
			setTodos(filteredTodos);

			console.log('filteredTodos:', filteredTodos);
		}
	};

	const addTodo = (event) => {
		event.preventDefault();
		setIsCreating(true);

		fetch('http://localhost:3002/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				text: newTodoText,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Добавлена новая задача, ответ сервера:', response);
				console.log('newTodo', newTodoText);
				refreshTodos();
				console.log(filteredTodos);
			})
			.finally(() => setIsCreating(false));
	};

	const onCompletedChange = (id, target) => {
		let url = 'http://localhost:3002/todos/';
		let newUrl = url + `/${id}`;

		fetch(newUrl, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				completed: target,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Редактирована задача, ответ сервера:', response);
				refreshTodos();
			});
	};
	const onUpdating = (id) => {
		setIsEdit(true);
	};

	const onSubmit = (id, event) => {
		event.preventDefault();

		let url = 'http://localhost:3002/todos/';
		let newUrl = url + `/${id}`;
		fetch(newUrl, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				text: newTodoText,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Редактирована задача, ответ сервера:', response);
				refreshTodos();
				console.log(refreshTodosFlag);
			})
			.finally(() => setIsEdit(false));
	};

	const onRemoveTodo = (id) => {
		setIsDeleting(true);

		let url = 'http://localhost:3002/todos/';
		let newUrl = url + `/${id}`;

		fetch(newUrl, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('Задача удалена, ответ сервера: ', response);
				refreshTodos();
			})
			.finally(() => setIsDeleting(false));
	};

	if (isLoading) {
		return <div className={styles.loader}></div>;
	}
	return (
		<div className={styles.app}>
			<form className={styles.todoForm} onSubmit={(event) => addTodo(event)}>
				<div>
					<input
						type="text"
						placeholder="Создать новую задачу..."
						onChange={({ target }) => setNewTodoText(target.value)}
					/>
					<button type="submit" disabled={isCreating}>
						Добавить задачу
					</button>
				</div>{' '}
			</form>
			<div className={styles.todoListTitle}>Список дел:</div>
			<input
				className={styles.searchTodo}
				type="text"
				value={searchTodo}
				placeholder="Поиск..."
				onChange={({ target }) => setSearchTodo(target.value)}
			/>
			<input
				className={styles.sortingTodos}
				type="checkbox"
				checked={isSortingEnabled}
				onChange={({ target }) => onSortingChange(target.checked)}
			/>
			<div className={styles.todoList}>
				{filteredTodos.map(({ id, text, completed }) => (
					<div className={styles.todoListItem} key={id}>
						<form
							className={styles.todoForm}
							onSubmit={(event) => onSubmit(id, event)}
						>
							<div className={styles.todoText}>
								<input
									className={styles.todoChecked}
									type="checkbox"
									checked={completed}
									onChange={({ target }) =>
										onCompletedChange(id, target.checked)
									}
								/>
								<div className={styles.todo}>
									{isEdit ? (
										<input
											className={styles.todoItemInput}
											id={id}
											type="text"
											value={newTodoText}
											onChange={({ target }) => {
												setNewTodoText(target.value);
											}}
										/>
									) : (
										<label className={styles.todoItem}>{text}</label>
									)}
								</div>
							</div>
							<button
								type="button"
								onClick={(e) => onUpdating(id)}
								className={styles.editTodoButton}
							>
								Редактировать
							</button>
							<button type="submit" className={styles.saveTodoButton}>
								Сохранить
							</button>
							<button
								type="button"
								onClick={(e) => onRemoveTodo(id)}
								className={styles.deleteTodoButton}
							>
								Удалить
							</button>
						</form>
					</div>
				))}
			</div>
		</div>
	);
};
