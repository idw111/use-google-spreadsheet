import axios, { CancelToken } from 'axios';
import { SimpleJson } from '.';

interface Spreadsheet {
	sheets: Array<Sheet>;
}

interface Sheet {
	properties: SheetProperties;
	data: Array<SheetData>;
}

interface SheetProperties {
	sheetId: number;
	title: string;
	index: number;
	sheetType: string;
}

interface SheetData {
	rowData: Array<Row>;
	rowMetadata: Array<any>;
	columnMetadata: Array<any>;
}

interface Row {
	values: Array<Cell>;
}

interface Cell {
	userEnteredValue: { stringValue: string };
	effectiveValue: { stringValue: string };
	formattedValue: string;
}

const getDataValues = (row: Row): Array<string> => row.values.map((value) => value.formattedValue);

const convertSheetsToSimpleJson = (rows: Array<Row>): Array<SimpleJson> => {
	const labels = getDataValues(rows[0]);
	return rows
		.filter((_, i) => i > 0)
		.map(
			(row: Row, i): SimpleJson => {
				const values = getDataValues(row);
				return labels.reduce(
					(json, label, j) => ({
						...json,
						[label]: values[j] || null,
					}),
					{ _id: i + 2 }
				);
			}
		);
};

export const fetchSpreadsheetV4 = async (sheetId: string, API_KEY: string, cancelToken: CancelToken | undefined): Promise<Array<SimpleJson>> => {
	try {
		const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
		const { data }: { data: Spreadsheet } = await axios.get(endpoint, { params: { includeGridData: 'true', key: API_KEY }, cancelToken });
		const rows = data.sheets.reduce((rows: Array<any>, sheet: Sheet) => {
			return [...rows, ...convertSheetsToSimpleJson(sheet.data[0].rowData)];
		}, []);
		return rows;
	} catch (err) {
		console.error(err);
		return [];
	}
};

// export const updateSpreadsheetV4 = async (sheetId: string, updateInfo: CellUpdate, API_KEY: string, cancelToken: CancelToken | undefined): Promise<any> => {
// 	try {
// 		const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
