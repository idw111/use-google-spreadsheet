import * as React from 'react';
import axios, { CancelToken, CancelTokenSource } from 'axios';
import { fetchSpreadsheetV4 } from './spreadsheet-v4';
import { fetchSpreadsheetV3 } from './spreadsheet-v3';

export interface SimpleJson {
	_id: number;
}

const getSpreadsheetId = (url: string): string => {
	const pattern: RegExp = /docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-]*)/;
	const match = url.match(pattern);
	return !match ? url : match[1];
};

export const fetchSpreadsheet = async (shareUrlOrSheetId: string, API_KEY: string | void, cancelToken: CancelToken | undefined = undefined): Promise<any | undefined> => {
	const sheetId = getSpreadsheetId(shareUrlOrSheetId);
	if (API_KEY) return fetchSpreadsheetV4(sheetId, API_KEY, cancelToken);
	else return fetchSpreadsheetV3(sheetId, cancelToken);
};

const useGoogleSpreadsheet = (shareUrlOrSheetId: string, API_KEY: string | void) => {
	const [state, setState] = React.useState<{
		rows: Array<SimpleJson> | null;
		isFetching: boolean;
	}>({ rows: null, isFetching: false });
	const sourceRef = React.useRef<CancelTokenSource>();
	const sheetId = getSpreadsheetId(shareUrlOrSheetId);
	React.useEffect(() => {
		if (!API_KEY) console.warn('Fallback to v3 API because API_KEY is empty. Google Sheets API v3 will be deprecated soon. Google Sheets API v4 requires the second paramter API_KEY');
	}, []);
	React.useEffect(() => {
		sourceRef.current = axios.CancelToken.source();
		const handleFetch = async () => {
			setState((state) => ({ ...state, rows: null, isFetching: true }));
			const rows = await fetchSpreadsheet(sheetId, API_KEY, sourceRef.current?.token);
			setState((state) => ({ ...state, rows, isFetching: false }));
		};
		handleFetch();
		return () => sourceRef.current?.cancel('cancelled by useEffect cleaning');
	}, [shareUrlOrSheetId]);
	return state;
};

export default useGoogleSpreadsheet;
