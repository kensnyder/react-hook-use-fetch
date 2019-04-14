import { useState, useEffect } from 'react';

export function useFetch(url, startingConfig) {
	const [config, setConfig] = useState(startingConfig);
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(
		function() {
			const ctrl = new AbortController();
			const signal = ctrl.signal;
			if (config.debounce > 0) {
				debounce(config.debounce, runFetch.bind(null, signal))();
			} else {
				runFetch(signal);
			}
			return () => ctrl.abort();
		},
		[config],
	);

	return {
		data,
		isLoading,
		config,
		setConfig,
	};

	function searializeParams(params) {
		if (typeof params !== 'object') {
			return '';
		}
		const pairs = [];
		for (const name in params) {
			pairs.push(
				encodeURIComponent(name) +
					'=' +
					encodeURIComponent(params[name]),
			);
		}
		return pairs.length ? '?' + pairs.join('&') : '';
	}

	function runFetch(signal) {
		setIsLoading(() => true);
		// remove items that are not valid fetch params
		const { params, debounce, ...fetchConfig } = config;
		const queryString = searializeParams(params);
		// send config to fetch plus abort signal
		fetch(url + queryString, { ...fetchConfig, signal })
			.then(rsp =>
				rsp.ok
					? rsp
					: Promise.reject({
							message: rsp.statusText,
							status: rsp.status,
					  }),
			)
			.then(rsp => rsp.json())
			.then(newData => {
				if (newData.results.length > 10) {
					newData.results = newData.results.slice(0, 10);
				}
				setIsLoading(() => false);
				setData(() => newData);
			});
	}

	function debounce(wait, func) {
		let timeout;
		return function() {
			clearTimeout(timeout);
			timeout = setTimeout(func, wait);
		};
	}
}
