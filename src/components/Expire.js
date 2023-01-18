import { useState, useEffect } from 'react';

const Expire = (props) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setVisible(false);
			localStorage.removeItem('drones');
		}, props.delay);
	}, [props.delay]);

	return visible ? <div>{props.children}</div> : <div />;
};

export default Expire;
