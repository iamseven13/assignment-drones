function DroneList({ drones }) {
	return (
		<>
			<h2>Drones who violated</h2>
			{drones.map((drone, index) => {
				return <li key={index}>{drone.serialNumber}</li>;
			})}
		</>
	);
}

export default DroneList;
