import { useEffect, useState } from 'react';
import axios from 'axios';

const getSpreadsheetId = url => {
	const pattern = /docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-]*)/;
	const match = url.match(pattern);
	return !match ? url : match[1];
};

const getDataValues = row => row.values.map(value => value.formattedValue);

const convertSheetsToSimpleJson = (rows = []) => {
	const keys = getDataValues(rows[0]);
	return rows
		.filter((_, i) => i > 0)
		.map(row => {
			const values = getDataValues(row);
			return keys.reduce((simpleRow, key, i) => {
				return { ...simpleRow, [key]: values[i] || null };
			}, {});
		});
};

const useGoogleSpreadsheet = (url, key) => {
	if (!key) console.warn('The second paramter API_KEY is required');
	const [state, setState] = useState({ rows: null, isFetching: false });
	useEffect(() => {
		const source = axios.CancelToken.source();
		const handleFetch = async url => {
			const sheetId = getSpreadsheetId(url);
			const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true&key=${key}`;
			try {
				const { data } = await axios.get(endpoint, { cancelToken: source.token });
				const rows = convertSheetsToSimpleJson(data.sheets?.[0]?.data?.[0]?.rowData);
				console.log(rows);
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
