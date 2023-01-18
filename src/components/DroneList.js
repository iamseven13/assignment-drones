import Expire from './Expire';

function DroneList({ drones, setDronesOwner }) {
	return (
		<div className="drone-container">
			<table class="styled-table">
				<thead>
					<tr>
						<th>Pilot Full Name</th>
						<th>Serial Number</th>
						<th>Email Address</th>
						<th>Phone Number</th>
						<th>Distance X</th>
						<th>Distance Y</th>
					</tr>
				</thead>
				<tbody>
					{drones.map((drone, index) => {
						return (
							<Expire delay="600000" key={index}>
								<tr>
									<td>
										{drone.firstName} {drone.lastName}
									</td>
									<td>{drone.serialNumber}</td>
									<td>{drone.email}</td>
									<td>{drone.phoneNumber}</td>
									<td>{drone.drone.positionX}</td>
									<td>{drone.drone.positionY}</td>
								</tr>
							</Expire>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DroneList;
