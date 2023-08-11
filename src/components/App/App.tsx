import classNames from 'classnames'
import { useLayoutEffect, useState } from 'react'
import { useWeatherContext } from '../../contexts/useWeatherContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { FavoritesBar } from '../FavoritesBar/FavoritesBar'
import { FavoritesStar } from '../FavoritesStar/FavoritesStar'
import { Forecast } from '../Forecast/Forecast'
import { MainInfo } from '../MainInfo/MainInfo'
import { MobileLoader } from '../MobileLoader/MobileLoader'
import { SearchBar } from '../SearchBar/SearchBar'
import { SecondayInfo } from '../SecondaryInfo/SecondayInfo'
import { Box } from '../reuseables/Box/Box'
import styles from './app.module.scss'

export type TimeInfo = {
	type: 'hour' | 'date',
	dt: number
}

export function App() {
	const [favoriteCities, setFavoriteCities] = useLocalStorage<string[]>('favoriteCities', [])
	const [isFavMobileOpen, setIsFavMobileOpen] = useState<boolean>(false)
	const [futureTimeInterval, setFutureTimeInterval] = useState<TimeInfo | null>(null)
	const [isMobile] = useMediaQuery('only screen and (max-width: 1000px)')
	const { city, error, isLoading, weatherData } = useWeatherContext()

	function futureTimeHandler(date: TimeInfo | null) {
		if (date?.dt === weatherData?.current.dt) {
			setFutureTimeInterval(null)
		}

		setFutureTimeInterval(date)
	}

	useLayoutEffect(() => {
		if (futureTimeInterval) {
			setFutureTimeInterval(null)
		}
	}, [city])

	return (
		<>
			{isLoading && isMobile ? (
				<MobileLoader />
			) : (
				<div className={classNames(styles.container, error && styles.errorOccured, favoriteCities.length === 0 && styles.containerWithoutFavorites, error && favoriteCities.length === 0 && styles.errorOccuredWithoutFavorites)}>
					<div className={styles.title}>
						<h1>Simple Weather</h1>
						{!isMobile && (
							<p>A Simplified Source for Weather Information</p>
						)}
					</div>
					<div className={styles.search}>
						<SearchBar />
					</div>
					{(favoriteCities.length > 0) && (
						<>
							<div className={classNames(styles.favorites, isFavMobileOpen
								? styles.favoritesShowOnMobile
								: styles.favoritesHideOnMobile
							)}>
								<FavoritesBar
									favoriteCities={favoriteCities}
									toggleShow={setIsFavMobileOpen}
								/>
							</div>
							<FavoritesStar
								show={isFavMobileOpen}
								toggleShow={setIsFavMobileOpen}
							/>
						</>
					)}
					{error ? (
						<div className={styles.error}>
							<Box error={true}>
								{error}
							</Box>
						</div>
					) : (
						<>
							<div className={styles.mainInfo}>
								<Box>
									<MainInfo
										futureTimeInterval={futureTimeInterval}
										favoriteCities={favoriteCities}
										setFavoriteCities={setFavoriteCities}
									/>
								</Box>
							</div>
							<div className={styles.secondaryInfo}>
								<Box>
									<SecondayInfo
										futureTimeInterval={futureTimeInterval}
										setFutureTimeInterval={futureTimeHandler}
									/>
								</Box>
							</div>
							<div className={styles.forecast}>
								<Box forecast>
									<Forecast
										futureTimeInterval={futureTimeInterval}
										setFutureTimeInterval={futureTimeHandler} />
								</Box>
							</div>
						</>
					)}
				</div>
			)}
		</>
	)
}
