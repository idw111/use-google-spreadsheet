import { useEffect, useState } from 'react';
import axios from 'axios';

const getSpreadsheetId = url => {
	const pattern = /docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-]*)/;
	const match = url.match(pattern);
	if (!match) return null;
	return match[1];
};

const convertToSimpleJson = (rows = []) => {
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
		const source = axios.CancelToken.source();
		const handleFetch = async url => {
			const sheetId = getSpreadsheetId(url);
			const endpoint = `https://spreadsheets.google.com/feeds/list/${sheetId}/1/public/full?alt=json`;
			try {
				const { data } = await axios.get(endpoint, { cancelToken: source.token });
				const rows = convertToSimpleJson(data?.feed?.entry);
				setState({ rows, isFetching: false });
			} catch (err) {
				setState({ rows: null, isFetching: false });
			}
		};
		handleFetch(url);
		return () => source.cancel('cancelled by useEffect cleaning');
	}, [url]);
	return state;
};

export default useGoogleSpreadsheet;
