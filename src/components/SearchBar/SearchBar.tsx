import { useMemo, useState, useEffect, useRef } from 'react';
import styles from './search-bar.module.scss'
import cityData from '../../data/cityData.json'
import Fuse from 'fuse.js';
import { City } from '../../data/city-types';
import { useWeatherContext } from '../../contexts/useWeatherContext';

export default function SearchBar() {
	const [fuseQuery, setFuseQuery] = useState('')
	const [input, setInput] = useState('')
	const { setCity } = useWeatherContext()
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const searchTimeout = setTimeout(() => setFuseQuery(input), 200);

		return () => clearTimeout(searchTimeout);
	}, [input])

	const results = useMemo(() => {
		const fuse = new Fuse(cityData as City[], {
			keys: ['city']
		})

		if (fuseQuery) {
			return fuse.search(fuseQuery).map((city) => city.item)
		}

		return cityData
	}, [fuseQuery])

	function handleChooseCity(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && inputRef.current) {
			setCity(results[0].city)
			setInput(results[0].city)
			inputRef.current.blur()
		}

		if (!e.keyCode && inputRef.current) {
			setCity(inputRef.current.value)
			setFuseQuery('')
			inputRef.current.blur()
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.input}>
				<input
					ref={inputRef}
					id="inputField"
					type="text"
					value={input}
					placeholder="Search for a city..."
					list="fuzzyList"
					onChange={(e) => setInput(e.target.value)}
					onKeyUp={(e) => handleChooseCity(e)}
				/>
				<datalist id="fuzzyList" className={styles.list}>
					{results.map((cityObj: City, idx) => (
						<option key={idx} value={cityObj.city} style={{ backgroundColor: 'blue' }} />
					))}
				</datalist>
			</div>
		</div>
	)
}