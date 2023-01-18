import { useState, useEffect } from 'react';
import DroneList from './DroneList';

function Main() {
	const [data, setData] = useState();
	const [violatedUsers, setViolatedUsers] = useState([]);
	const [isFetched, setIsFetched] = useState(false);

	// Get the latest snapshot -> once every 2 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setIsFetched((prev) => !prev);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	// Fetch all data from the API -> XML to Json
	useEffect(() => {
		//Fetch the JSON data from the API endpoints.
		async function fetchData() {
			const res = await fetch(
				'https://api.factmaven.com/xml-to-json/?xml=http://assignments.reaktor.com/birdnest/drones',
				{
					'Content-Type': 'application/json',
				}
			);
			const data = await res.json();

			// destructure drone array from the object.
			const {
				capture: { drone },
			} = data?.report;
			console.log(drone);

			setData(drone);

			// Get droners who violated the zone
			const restrictedPositionX = 250000;
			const restrictedPositionY = 250000;

			if (data) {
				for (let user of drone) {
					findBadDrones(user, restrictedPositionX, restrictedPositionY);
				}
			}
		}

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetched]);

	// Function to iterate through the retrieved api data and find drones who violated the parameter
	function findBadDrones(drone, restrictedPositionX, restrictedPositionY) {
		//Get drone position snapshot
		const userPositionX = parseInt(drone.positionX);
		const userPositionY = parseInt(drone.positionY);

		// Write logic if user/drone position is less/= to restrictedPosition
		if (
			userPositionX <= restrictedPositionX ||
			userPositionY <= restrictedPositionY
		) {
			// If drone already exit in violatedUsers, dont add it again.
			const isDroneBlacklisted = violatedUsers.find(
				(blackListedDrone) =>
					blackListedDrone.serialNumber === drone.serialNumber
			);

			// If drone doenst exit in violatedUsers, add it.
			if (isDroneBlacklisted === undefined) {
				setViolatedUsers((prev) => [...prev, drone]);
				findDroneInfo(drone);
			}
		} else {
			return;
		}
	}

	async function findDroneInfo(drone) {
		let config = {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		};
		const res = await fetch(
			`https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`,

			config
		);
		const data = await res.json();
		console.log(data);
	}

	return (
		<>
			<DroneList drones={violatedUsers} />
		</>
	);
}

export default Main;
