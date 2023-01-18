import { useState, useEffect } from 'react';
import DroneList from './DroneList';

function Main() {
	const [data, setData] = useState();
	const [violatedUsers, setViolatedUsers] = useState([]);
	const [isFetched, setIsFetched] = useState(false);
	const [dronesOwner, setDronesOwner] = useState([]);

	// Get the latest snapshot -> once every 2 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setIsFetched((prev) => !prev);
		}, 3000);
		getLocalDrones();
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
			// If drone already exists in violatedUsers, dont add it again.
			const isDroneBlacklisted = violatedUsers.find(
				({ serialNumber }) => serialNumber === drone.serialNumber
			);
			console.log(isDroneBlacklisted);
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
		const res = await fetch(
			`https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber}`,
			{
				'Content-Type': 'application/json',
				'access-allow-origin': '*',
			}
		);
		const data = await res.json();

		const droneOwner = {
			serialNumber: drone.serialNumber,
			...data,
			drone,
		};

		setDronesOwner((prev) => [...prev, droneOwner]);
		saveLocalDrones();
	}

	function saveLocalDrones() {
		localStorage.setItem('drones', JSON.stringify(dronesOwner));
	}

	function getLocalDrones() {
		if (localStorage.getItem('drones') === null) {
			localStorage.setItem('drones', JSON.stringify([]));
		} else {
			let drones = JSON.parse(localStorage.getItem('drones'));
			console.log(drones);
			setDronesOwner(drones);
		}
	}

	return (
		<div className="main-list">
			<h2>Drones who violated coords 250k X 250k</h2>
			<DroneList drones={dronesOwner} setDronesOwner={setDronesOwner} />
			<div className="goose">
				<img src="./goose.png" alt="" />
			</div>
		</div>
	);
}

export default Main;
