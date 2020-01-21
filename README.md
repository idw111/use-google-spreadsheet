# use-google-spreadsheet

> helps developers use google spreadsheet as their data table (backend endpoint)

[Live Demo](https://idw111.github.io/use-google-spreadsheet/example/)

## install

```bash
npm install use-google-spreadsheet
```

## usage

1. Configure Google Cloud Console to get API key for Google Sheets API (API_KEY)

    - It uses Google Sheets API v4, when API_KEY is given
    - If API_KEY is not given, it falls back to Google Sheets API v3 which would be deprecated soon

2. Create a google spreadsheet

    - Insert keys in the first row
    - Insert values after first row

3. Publish the spreadsheet to web (File > Publish to Web)
4. Use the share url to fetch the data (File > Share)
5. You'll fetch the spreadsheet as the following

![spreadsheet](https://user-images.githubusercontent.com/445464/72701147-aacbc880-3b91-11ea-81c5-d75c5c476f31.png)

```json
// fetched data (rows)
[
	{ "key1": "row1:value1", "key2": "row1:value2", "key3": "row1:value3" },
	{ "key2": "row2:value1", "key2": "row2:value2", "key3": "row2:value3" },
	{ "key3": "row3:value1", "key2": "row3:value2", "key3": "row3:value3" }
]
```

## example

```javascript
import useGoogleSpreadsheet from 'use-google-spreadsheet';

const SomeComponent = ({}) => {
	const API_KEY = 'XXXXXXXXXXXX';
	const shareUrl = 'https://docs.google.com/spreadsheets/d/1W5D9WvlrXvndEc0b42OsdzJTT1M-MxKVYdPEtleqRQY/edit?usp=sharing';
	const { rows, isFetching } = useGoogleSpreadsheet(shareUrl, API_KEY);
	return isFetching ? (
		<Spinner />
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
	) : (
		<span>No Data</span>
	);
};
```

## api

### useGoogleSpreadsheet

    -   params @{string} shareUrl or sheetId
    -   params @{string} apiKey (optional)
    -   returns @{object}
        -   rows @{array}
        -   isFetching @{boolean}
