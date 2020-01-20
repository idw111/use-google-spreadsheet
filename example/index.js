import '@babel/polyfill';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useGoogleSpreadsheet from '../src';

const urls = [
	'https://docs.google.com/spreadsheets/d/1W5D9WvlrXvndEc0b42OsdzJTT1M-MxKVYdPEtleqRQY/edit?usp=sharing',
	'https://docs.google.com/spreadsheets/d/1XqhOiYajpp7zzj3ncJ8EpCKZoNOJSjiQdLTXCiBqCWc/edit?usp=sharing'
];

const Example = ({}) => {
	const [index, setIndex] = useState(0);
	const { rows, isFetching } = useGoogleSpreadsheet(urls[index]);
	const handleChangeUrl = () => {
		setIndex((index + 1) % urls.length);
	};
	return (
		<>
			{isFetching ? (
				<div className="loading">loading...</div>
			) : rows ? (
				<ul>
					{rows.map((row, i) => {
						return (
							<li key={i}>
								{Object.keys(row).map((key, i) => (
									<span key={i}>
										{key}: {row[key]}
										<br />
									</span>
								))}
							</li>
						);
					})}
				</ul>
			) : null}
			<button onClick={handleChangeUrl}>change url</button>
		</>
	);
};

window.onload = function() {
	ReactDOM.render(<Example />, document.getElementById('root'));
};
