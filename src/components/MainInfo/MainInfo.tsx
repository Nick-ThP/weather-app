import classNames from 'classnames'
import { useLayoutEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import rain from '../../assets/images/icons/rain.png'
import sun from '../../assets/images/icons/sun.png'
import sunrise from '../../assets/images/icons/sunrise.png'
import sunset from '../../assets/images/icons/sunset.png'
import wind from '../../assets/images/icons/wind.png'
import { useWeatherContext } from '../../context/useWeatherContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { createDateInfo } from '../../utils/date-formatting'
import { createRainInfo, createSunInfo, createTempInfo, createUvInfo } from '../../utils/weather-formatting'
import { Line } from '../reuseables/Line/Line'
import styles from './main-info.module.scss'

interface Props {
	favoriteCities: string[]
	setFavoriteCities: (arr: string[]) => void
}

export function MainInfo(props: Props) {
	const [isFavorite, setIsFavorite] = useState<boolean>(false)
	const [isMobile] = useMediaQuery('only screen and (max-width: 1000px)')
	const { allWeatherData, weatherSource, city, futureTime, isLoading, refresh } = useWeatherContext()

	useLayoutEffect(() => {
		if (props.favoriteCities.find((favCity) => favCity === city)) {
			setIsFavorite(true)
		} else {
			setIsFavorite(false)
		}
	}, [props.favoriteCities, city])

	function favoriteClickHandler(city: string) {
		if (props.favoriteCities.find((favCity) => favCity === city)) {
			props.setFavoriteCities(props.favoriteCities.filter((favCity) => favCity !== city))
		} else {
			props.setFavoriteCities([...props.favoriteCities, city].sort())
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={classNames(styles.column, !isMobile && !isLoading && styles.columnFirst)}>
				{isLoading ? (
					<Skeleton count={3.5} className={styles.skeleton} />
				) : (
					<>
						<div className={styles.row}>
							<h2>{city}</h2>
							<svg
								className={classNames(styles.star, isFavorite ? styles.starFavorite : styles.starNotFavorite)}
								onClick={() => favoriteClickHandler(city)}
								viewBox='0 0 576 512'
							>
								<path d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z' />
							</svg>
						</div>
						<div className={styles.row}>
							<div className={classNames(styles.currentDate)}>
								{weatherSource?.dt ? (
									<>
										<div>{createDateInfo(weatherSource?.dt).dateFull}</div>
										<div className={styles.refreshSpan}>
											{futureTime?.type !== 'date' ? <>{createDateInfo(weatherSource?.dt).preciseTime}</> : <>Full day</>}
											{!isMobile && !futureTime && (
												<svg className={styles.refreshIcon} viewBox='0 0 24 24' width='24' height='24' onClick={refresh}>
													<path d='M9 12l-4.463 4.969-4.537-4.969h3c0-4.97 4.03-9 9-9 2.395 0 4.565.942 6.179 2.468l-2.004 2.231c-1.081-1.05-2.553-1.699-4.175-1.699-3.309 0-6 2.691-6 6h3zm10.463-4.969l-4.463 4.969h3c0 3.309-2.691 6-6 6-1.623 0-3.094-.65-4.175-1.699l-2.004 2.231c1.613 1.526 3.784 2.468 6.179 2.468 4.97 0 9-4.03 9-9h3l-4.537-4.969z' />
												</svg>
											)}
										</div>
									</>
								) : (
									<div>Unavailable</div>
								)}
							</div>
						</div>
						<div className={styles.row}>
							<div className={styles.currentWeather}>
								{weatherSource?.weather[0].description
									.split('')
									.map((letter, idx) => (idx === 0 ? letter.toUpperCase() : letter))
									.join('') || 'Unavailable'}
							</div>
						</div>
						<div className={styles.row}>
							<div
								className={classNames(
									styles.temp,
									!weatherSource?.temp && styles.tempNone,
									typeof weatherSource?.temp === 'object' && styles.tempTwo
								)}
							>
								{weatherSource?.temp ? createTempInfo(weatherSource?.temp) : 'Unavailable'}
							</div>
							{weatherSource?.weather[0].icon && (
								<img
									className={styles.dynamicIcon}
									src={`https://openweathermap.org/img/wn/${weatherSource?.weather[0].icon}@2x.png`}
									alt='current weather depiction'
								/>
							)}
						</div>
					</>
				)}
			</div>
			<Line type='box' />
			<div className={classNames(styles.column, !isMobile && !isLoading && styles.columnSecond)}>
				{isLoading ? (
					<Skeleton count={3.5} className={styles.skeleton} />
				) : (
					<>
						<div className={styles.row}>
							<img className={styles.staticIcon} src={sun} alt='UV index' />
							<div className={styles.description}>
								<div>UV index</div>
								<div>{createUvInfo(weatherSource?.uvi || 0)}</div>
							</div>
						</div>
						<div className={styles.row}>
							<img className={styles.staticIcon} src={wind} alt='Wind' />
							<div className={styles.description}>
								<div>Wind speed</div>
								<div>{weatherSource?.wind_speed ? Math.round(weatherSource?.wind_speed * 10) / 10 : 0} m/s</div>
							</div>
						</div>
						<div className={styles.row}>
							<img className={styles.staticIcon} src={rain} alt='Rainfall' />
							<div className={styles.description}>
								<div>{futureTime?.type === 'date' ? 'Daily rainfall' : 'Rain this hour'}</div>
								<div>{weatherSource?.rain ? createRainInfo(weatherSource?.rain, futureTime) : 0} mm</div>
							</div>
						</div>
						<Line type='box' horizontalOnDesktop />
						<div className={styles.sunRow}>
							<div className={styles.sunInfo}>
								<img className={styles.staticIcon} src={sunrise} alt='sunrise' />
								{weatherSource?.dt ? (
									<>
										{weatherSource.sunrise ? (
											<>{createDateInfo(weatherSource?.sunrise).preciseTime}</>
										) : (
											<>{createSunInfo(weatherSource?.dt, 'sunrise', allWeatherData, futureTime)}</>
										)}
									</>
								) : (
									'Unavailable'
								)}
							</div>
							<div className={styles.sunInfo}>
								<img className={styles.staticIcon} src={sunset} alt='sunset' />
								{weatherSource?.dt ? (
									<>
										{weatherSource.sunset ? (
											<>{createDateInfo(weatherSource?.sunset).preciseTime}</>
										) : (
											<>{createSunInfo(weatherSource?.dt, 'sunset', allWeatherData, futureTime)}</>
										)}
									</>
								) : (
									'Unavailable'
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
