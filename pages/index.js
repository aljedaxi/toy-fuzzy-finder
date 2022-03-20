import {useState} from 'react'
import S from 'sanctuary'

const {
	splitOn,
	pipe,
	regex,
	joinWith,
	regexEscape,
	map,
	matchAll,
} = S

const trace = s => {console.log(s); return s;};

const makeRegexp = n => pipe ([
	splitOn (''),
	xs => xs.length > 1 ? xs.reduce ((acc, val, idx, xs) => {
		const withReplacement = acc 
			? [...xs.slice (0, idx), '.?'.repeat (n), ...xs.slice(idx + n)].join ('')
			: ['.?'.repeat (n), ...xs.slice (n)].join ('')

		return acc 
			? `${acc}|${withReplacement}`
			: `${withReplacement}`
	}, '') : '',
	s => new RegExp (s, 'ig'),
])

export const Main = () => {
	const [input, setInput] = useState ('')
	const [query, setQuery] = useState ('')
	const [n, setN] = useState (1)
	const regex = makeRegexp (n) (query)
	const matches = input && query.length > 1
		? input.match (regex) ?? []
		: []

	console.log('regex', regex);
	console.log('matches', matches);

	const matchedText = matches.map (
		s => <div key={s} dangerouslySetInnerHTML={{
			__html: input.replace (
				s,
				`<mark>${s}</mark>`
			)
		}}/>
	)


	return (
		<div>
			<h1>My Epic Fuzzy Finder</h1>
			<h2>Options</h2>
			<label htmlFor="n">
				Number of allowed missing characters <br />
				<input type="number" step='1' value={n} onChange={e => setN (parseInt (e.target.value))}/>
			</label>
			<h2>Finder</h2>
			<label htmlFor="searchText">
				Input
			</label>
			<br />
			<textarea id="searchText" name="searchText" cols="30" rows="10" value={input} onChange={e => setInput (e.target.value)}/>
			<br />
			<label htmlFor="queryText">Query Text</label>
			<br />
			<input id='queryText' value={query} onChange={e => setQuery (e.target.value)} />
			<h2>Matches</h2>
			{matchedText}
		</div>
	)
}

export default Main
