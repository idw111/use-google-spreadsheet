import { useEffect, useState } from 'react';
import axios from 'axios';

const getSpreadsheetId = url => {
	const pattern = /docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-]*)/;
	const match = url.match(pattern);
	if (!match) return null;
	return match[1];
};

const convertToSimpleJson = (rows = []) => {
	console.log(rows);
	return rows.map(row => {
		const keys = Object.keys(row).filter(key => key.startsWith('gsx$'));
		return keys.reduce((simpleRow, key) => {
			return { ...simpleRow, [key.replace('gsx$', '')]: row[key]?.$t };
		}, {});
	});
};

const useGoogleSpreadsheet = url => {
	const [state, setState] = useState({ rows: null, isFetching: false });
	useEffect(() => {
		const handleFetch = async url => {
			console.log('handleFetch', url);
			const sheetId = getSpreadsheetId(url);
			const endpoint = `https://spreadsheets.google.com/feeds/list/${sheetId}/1/public/full?alt=json`;
			console.log('endpoint', endpoint);
			try {
				const { data } = await axios.get(endpoint, {});
				const rows = convertToSimpleJson(data?.feed?.entry);
				console.log(rows);
				setState({ rows, isFetching: false });
			} catch (err) {
				console.error(err);
				setState({ rows: null, isFetching: false });
			}
		};
		handleFetch(url);
	}, [url]);
	// handleFetch(url);
	return state;
};

export default useGoogleSpreadsheet;
