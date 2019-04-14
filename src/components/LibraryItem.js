import React from 'react';

export function LibraryItem({ library }) {
	return (
		<div className="LibraryItem Component">
			<h4>
				<a href={library.latest}>{library.name}</a>
			</h4>
			<p>{library.description}</p>
		</div>
	);
}
