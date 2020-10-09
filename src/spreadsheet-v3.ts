import axios, { CancelToken } from 'axios';
import { SimpleJson } from '.';

interface Spreadsheet {
	feed: { entry: Array<Row> };
}

interface Row {
	[key: string]: Cell;
}

interface Cell {
	$t: string;
}

const convertSheetsToSimpleJson = (rows: Array<Row>): Array<SimpleJson> => {
	return rows?.map((row, i) => {
		const labels = Object.keys(row).filter((key: string) => /^gsx\$/.test(key));
		return labels.reduce(
			(json, label, i): SimpleJson => ({
				...json,
				[label.replace('gsx$', '')]: row[label]?.$t || null,
			}),
			{ _id: i + 2 }
		);
	});
};

export const fetchSpreadsheetV3 = async (sheetId: string, cancelToken: CancelToken | undefined): Promise<any> => {
	try {
		const endpoint = `https://spreadsheets.google.com/feeds/list/${sheetId}/1/public/full?alt=json`;
		const { data }: { data: Spreadsheet } = await axios.get(endpoint, { cancelToken });
		const rows = convertSheetsToSimpleJson(data.feed.entry);
		return rows;
	} catch (err) {
		console.error(err);
		return [];
	}
};
