import { useEffect, useState, useRef, Fragment } from 'react';
import styles from './App.module.css';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from './firebase';

export const App = () => {
	const [todos, setTodos] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [refreshTodosFlag, setRefreshTodosFlag] = useState(false);
	const [searchTodo, setSearchTodo] = useState('');
	const [isSortingEnabled, setIsSortingEnabled] = useState(false);
	const [newTodoText, setNewTodoText] = useState('');
	const [changingTaskID, setChangingTaskID] = useState('');

	const filteredTodos = searchTodo
		? todos.filter((todo) => todo.text.toLowerCase().includes(searchTodo))
		: isSortingEnabled
			? Object.values(todos).sort((a, b) => a.text.localeCompare(b.text))
			: todos;

	useEffect(() => {
		const todosDbRef = ref(db, 'todos');

		return onValue(todosDbRef, (snapshot) => {
			const loadedTodos = snapshot.val() || {};
			setTodos(loadedTodos);
			setIsLoading(false);
		});
	}, []);

	const addTodo = (event) => {
		//event.preventDefault();
		setIsCreating(true);

		const todosDbRef = ref(db, 'todos');
		push(todosDbRef, {
			text: newTodoText,
			completed: false,
		})
			.then((response) => {
				console.log('Добавлена новая задача, ответ сервера:', response);
			})
			.finally(() => setIsCreating(false));
	};

	const onCompletedChange = (id, target) => {
		const updateTodoRef = ref(db, `todos/${id}`);
		update(updateTodoRef, { completed: target }).then((response) => {
			console.log('Задача поменяла "completed", ответ сервера:', response);
		});
	};

	const onSubmit = (id) => {
		setIsEdit(true);
		const updateTodoRef = ref(db, `todos/${id}`);
		update(updateTodoRef, { text: newTodoText })
			.then((response) => {
				console.log('Редактирована задача, ответ сервера:', response);
			})
			.finally(() => setIsEdit(false));
	};

	const onRemoveTodo = (id) => {
		setIsDeleting(true);

		const deleteTodoRef = ref(db, `todos/${id}`);
		remove(deleteTodoRef)
			.then((response) => {
				console.log('Задача удалена, ответ сервера: ', response);
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
				onChange={() => setIsSortingEnabled(!isSortingEnabled)}
			/>
			<div className={styles.todoList}>
				{Object.entries(filteredTodos).map(([id, { text, completed }]) => (
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
									{changingTaskID === id ? (
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
								onClick={(e) => setChangingTaskID(id)}
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
