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
				return { _id: i + 1, ...simpleRow, [key]: values[i] || null };
			}, {});
		});
};

const convertSheetsToSimpleJsonForLegacy = (rows = []) => {
	return rows.map(row => {
		const keys = Object.keys(row).filter(key => key.startsWith('gsx$'));
		return keys.reduce((simpleRow, key) => {
			return { ...simpleRow, [key.replace('gsx$', '')]: row[key]?.$t };
		}, {});
	});
};

const useGoogleSpreadsheet = (shareUrlOrSheetId, API_KEY) => {
	const [state, setState] = useState({ rows: null, isFetching: false });
	useEffect(() => {
		if (!API_KEY) console.warn('Fallback to v3 API because API_KEY is empty. Google Sheets API v3 will be deprecated soon. Google Sheets API v4 requires the second paramter API_KEY');
	}, []);
	useEffect(() => {
		const source = axios.CancelToken.source();
		const sheetId = getSpreadsheetId(shareUrlOrSheetId);
		const handleFetch = async (fallback = false) => {
			const v3_endpoint = `https://spreadsheets.google.com/feeds/list/${sheetId}/1/public/full?alt=json`;
			const v4_endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true&key=${API_KEY}`;
			const endpoint = fallback ? v3_endpoint : v4_endpoint;
			setState({ rows: null, isFetching: true });
			try {
				const { data } = await axios.get(endpoint, { cancelToken: source.token });
				const rows = fallback ? convertSheetsToSimpleJsonForLegacy(data?.feed?.entry) : convertSheetsToSimpleJson(data.sheets?.[0]?.data?.[0]?.rowData);
				setState({ rows, isFetching: false });
			} catch (err) {
				if (!fallback) {
					console.warn('Fallback to v3 API because API_KEY does not seem to be valid');
					handleFetch(true);
				} else {
					setState({ rows: null, isFetching: false });
				}
			}
		};
		handleFetch(!API_KEY);
		return () => source.cancel('cancelled by useEffect cleaning');
	}, [shareUrlOrSheetId]);
	return state;
};

export default useGoogleSpreadsheet;
