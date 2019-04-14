import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { LibraryItem } from './LibraryItem.js';

export function LibraryList({ story }) {
	const url = 'https://api.cdnjs.com/libraries';
	const [searchTerm, setSearchTerm] = useState('');
	const { data, isLoading, config, setConfig } = useFetch(url, {
		params: { fields: 'description,author' },
	});

	return (
		<div className="LibraryList Component">
			<h2>Search for CDNJS libraries:</h2>
			<div>(with debounce of 150ms)</div>
			<div className="search-bar">
				<input
					value={searchTerm}
					onChange={updateSearchTerm}
					placeholder="Search..."
					size="40"
				/>
			</div>
			{data &&
				data.results &&
				data.results.map(library => (
					<LibraryItem library={library} key={library.name} />
				))}
			{isLoading && <div>Loading...</div>}
		</div>
	);

	function updateSearchTerm(evt) {
		const newSearchTerm = evt.target.value;
		setSearchTerm(() => newSearchTerm);
		setConfig(config => {
			return {
				...config,
				params: { ...config.params, search: newSearchTerm },
				debounce: 150,
			};
		});
	}
}
