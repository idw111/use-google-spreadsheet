# use-google-spreadsheet

> helps developers use google spreadsheet as their backend endpoint

## install

```bash
npm install use-google-spreadsheet
```

## usage

```javascript
import useGoogleSpreadsheet from 'use-google-spreadsheet';

const SomeComponent = ({}) => {
	const shareUrl = 'https://docs.google.com/spreadsheets/d/1W5D9WvlrXvndEc0b42OsdzJTT1M-MxKVYdPEtleqRQY/edit?usp=sharing';
	const { rows, isFetching } = useGoogleSpreadsheet(shareUrl);
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
	) : null;
};
```
