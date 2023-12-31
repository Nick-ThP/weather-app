export interface IWeatherContext {
	allWeatherData: IWeatherData | null
	weatherSource: Current | Daily | null
	city: string
	futureTime: TimeInfo | null
	isLoading: boolean
	error: string | null
	setCity: (val: string) => void
	setFutureTime: (val: TimeInfo | null) => void
	setError: (val: string | null) => void
	refresh: () => void
}

export interface IWeatherData {
	lat: number
	lon: number
	timezone: string
	timezone_offset: number
	current: Current
	minutely: Minutely[]
	hourly: Current[]
	daily: Daily[]
}

export interface Current {
	dt: number
	sunrise?: number
	sunset?: number
	temp: number
	feels_like: number
	pressure: number
	humidity: number
	dew_point: number
	uvi: number
	clouds: number
	visibility: number
	wind_speed: number
	wind_deg: number
	wind_gust: number
	weather: Weather[]
	pop?: number
	rain?: {
		'1h': number
	}
}

export interface Daily {
	dt: number
	sunrise: number
	sunset: number
	moonrise: number
	moonset: number
	moon_phase: number
	temp: Temp
	feels_like: FeelsLike
	pressure: number
	humidity: number
	dew_point: number
	wind_speed: number
	wind_deg: number
	wind_gust: number
	weather: Weather[]
	clouds: number
	pop: number
	uvi: number
	rain?: number
}

export interface Weather {
	id: number
	main: Main
	description: Description
	icon: string
}

export enum Description {
	BrokenClouds = 'broken clouds',
	ClearSky = 'clear sky',
	FewClouds = 'few clouds',
	LightRain = 'light rain',
	OvercastClouds = 'overcast clouds',
	ScatteredClouds = 'scattered clouds'
}

export enum Main {
	Clear = 'Clear',
	Clouds = 'Clouds',
	Rain = 'Rain'
}

export interface FeelsLike {
	day: number
	night: number
	eve: number
	morn: number
}

export interface Temp {
	day: number
	min: number
	max: number
	night: number
	eve: number
	morn: number
}

export interface Minutely {
	dt: number
	precipitation: number
}

export type TimeInfo = {
	type: 'hour' | 'date'
	dt: number
}
